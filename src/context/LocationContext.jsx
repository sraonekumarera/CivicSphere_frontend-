import React, { createContext, useContext, useState, useEffect } from 'react';
import { locationService } from '../services/locationService';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem('civicsphere_coords');
    return saved ? JSON.parse(saved) : null;
  });

  const [localityName, setLocalityName] = useState(() => {
    return localStorage.getItem('civicsphere_locality') || '';
  });

  const [radiusKm, setRadiusKm] = useState(() => {
    const saved = localStorage.getItem('civicsphere_radius');
    return saved ? parseInt(saved, 10) : 15;
  });

  const [consentStatus, setConsentStatus] = useState(() => {
    return localStorage.getItem('civicsphere_consent') || 'PROMPT'; // PROMPT, GRANTED, DENIED, MANUAL
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localities, setLocalities] = useState([]);

  // Fetch predefined municipal localities
  useEffect(() => {
    locationService.getLocalities()
      .then((res) => {
        if (res.data) setLocalities(res.data);
      })
      .catch((err) => console.error('Error fetching municipal localities:', err));
  }, []);

  const openConsentModal = () => setIsModalOpen(true);
  const closeConsentModal = () => setIsModalOpen(false);

  // User explicitly grants browser GPS permission
  const grantLocationConsent = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoords(newCoords);
        setLocalityName('Current Device Location');
        setConsentStatus('GRANTED');
        setIsModalOpen(false);

        localStorage.setItem('civicsphere_coords', JSON.stringify(newCoords));
        localStorage.setItem('civicsphere_locality', 'Current Device Location');
        localStorage.setItem('civicsphere_consent', 'GRANTED');

        // Persist preference to backend if logged in
        locationService.savePreference({
          latitude: newCoords.latitude,
          longitude: newCoords.longitude,
          localityName: 'Current Device Location',
          radiusKm: radiusKm,
          consentGranted: true,
        }).catch(() => {});
      },
      (error) => {
        console.warn('Geolocation permission denied or timed out:', error.message);
        denyLocationConsent();
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // User explicitly denies location permission
  const denyLocationConsent = () => {
    setConsentStatus('DENIED');
    setIsModalOpen(false);
    localStorage.setItem('civicsphere_consent', 'DENIED');
  };

  // User opts for manual locality selection (no GPS tracking)
  const setManualLocality = (locality) => {
    const newCoords = {
      latitude: locality.latitude,
      longitude: locality.longitude,
    };
    setCoords(newCoords);
    setLocalityName(locality.name);
    setConsentStatus('MANUAL');
    setIsModalOpen(false);

    localStorage.setItem('civicsphere_coords', JSON.stringify(newCoords));
    localStorage.setItem('civicsphere_locality', locality.name);
    localStorage.setItem('civicsphere_consent', 'MANUAL');

    locationService.savePreference({
      latitude: newCoords.latitude,
      longitude: newCoords.longitude,
      localityName: locality.name,
      radiusKm: radiusKm,
      consentGranted: false, // Explicitly manual selection
    }).catch(() => {});
  };

  const updateRadius = (newRadius) => {
    setRadiusKm(newRadius);
    localStorage.setItem('civicsphere_radius', newRadius.toString());

    if (coords) {
      locationService.savePreference({
        latitude: coords.latitude,
        longitude: coords.longitude,
        localityName: localityName,
        radiusKm: newRadius,
        consentGranted: consentStatus === 'GRANTED',
      }).catch(() => {});
    }
  };

  const revokeConsent = () => {
    setCoords(null);
    setLocalityName('');
    setConsentStatus('DENIED');
    localStorage.removeItem('civicsphere_coords');
    localStorage.removeItem('civicsphere_locality');
    localStorage.setItem('civicsphere_consent', 'DENIED');

    locationService.revokeConsent().catch(() => {});
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        localityName,
        radiusKm,
        consentStatus,
        isModalOpen,
        localities,
        hasLocation: !!coords,
        openConsentModal,
        closeConsentModal,
        grantLocationConsent,
        denyLocationConsent,
        setManualLocality,
        updateRadius,
        revokeConsent,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
