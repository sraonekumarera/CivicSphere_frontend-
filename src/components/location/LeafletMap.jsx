import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export const LeafletMap = ({
  centerCoords,
  newsItems = [],
  radiusKm = 15,
  height = '420px',
  onMarkerClick,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const circleLayerRef = useRef(null);

  // Fix default Leaflet icon paths in Vite/Webpack bundlers
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const defaultLat = centerCoords?.latitude || 40.7128;
    const defaultLng = centerCoords?.longitude || -74.0060;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 12,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Center, User Marker, Radius Circle, and News Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    if (circleLayerRef.current) {
      map.removeLayer(circleLayerRef.current);
      circleLayerRef.current = null;
    }

    // 1. Plot User Marker and Radius Circle if center coordinates are available
    if (centerCoords && centerCoords.latitude && centerCoords.longitude) {
      map.setView([centerCoords.latitude, centerCoords.longitude], 12);

      // Custom icon for user
      const userIcon = L.divIcon({
        className: 'user-geo-marker',
        html: `<div style="background:#0284c7; width:18px; height:18px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 8px rgba(2,132,199,0.8);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      L.marker([centerCoords.latitude, centerCoords.longitude], { icon: userIcon })
        .bindPopup(`<strong>Your Location</strong><br/>Scanning within ${radiusKm} km`)
        .addTo(markersLayerRef.current);

      // Radius circle
      if (radiusKm && radiusKm > 0) {
        circleLayerRef.current = L.circle([centerCoords.latitude, centerCoords.longitude], {
          radius: radiusKm * 1000,
          color: '#0284c7',
          weight: 2,
          fillColor: '#38bdf8',
          fillOpacity: 0.12,
        }).addTo(map);
      }
    }

    // 2. Plot News Items Pins
    newsItems.forEach((item) => {
      if (item.latitude && item.longitude) {
        const marker = L.marker([item.latitude, item.longitude]);

        const popupContent = `
          <div style="min-width: 180px; font-family: sans-serif;">
            <span style="display:inline-block; font-size:10px; font-weight:700; color:#4f46e5; text-transform:uppercase; margin-bottom:4px;">
              ${item.category || 'Civic'}
            </span>
            <h4 style="font-size:13px; margin:0 0 6px 0; color:#0f172a; font-weight:700;">
              ${item.title}
            </h4>
            <div style="font-size:11px; color:#64748b; margin-bottom:8px;">
              ${item.location || item.localityName || ''}
              ${item.distanceKm != null && typeof item.distanceKm === 'number' ? ` • <strong>${item.distanceKm.toFixed(1)} km away</strong>` : ''}
            </div>
            <a href="/news/${item.id}" style="display:inline-block; font-size:11px; font-weight:600; color:#0284c7; text-decoration:none;">
              Read Story &rarr;
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick(item);
        });

        marker.addTo(markersLayerRef.current);
      }
    });
  }, [centerCoords, newsItems, radiusKm]);

  return (
    <div style={{ position: 'relative', width: '100%', height: height }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-md)' }} />
    </div>
  );
};
