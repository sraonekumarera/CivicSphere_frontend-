import React from 'react';
import { useLocation } from '../../context/LocationContext';
import { RadiusSlider } from '../location/RadiusSlider';
import { LocalitySelector } from '../location/LocalitySelector';

export const NearbyNewsFilter = ({
  isNearbyActive,
  onToggleNearby,
  showMap,
  onToggleMap,
}) => {
  const { coords, localityName, openConsentModal } = useLocation();

  return (
    <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Left side: Location status & toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={onToggleNearby}
            className={`btn ${isNearbyActive ? 'btn-primary' : 'btn-outline'} btn-sm`}
            style={{ borderRadius: '9999px' }}
          >
            <i className="fas fa-crosshairs"></i>
            {isNearbyActive ? 'Filtering Nearby News' : 'Filter by Distance (Nearby)'}
          </button>

          {isNearbyActive && coords && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--dark)' }}>
              <span className="badge badge-geo">
                <i className="fas fa-map-marker-alt"></i> {localityName || 'Device Coords'}
              </span>
              <button
                onClick={openConsentModal}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
              >
                Change
              </button>
            </div>
          )}

          {!coords && isNearbyActive && (
            <button onClick={openConsentModal} className="btn btn-outline btn-sm" style={{ borderColor: 'var(--warning)', color: '#b45309' }}>
              <i className="fas fa-exclamation-triangle"></i> Location not set. Click to choose.
            </button>
          )}
        </div>

        {/* Right side: Radius slider & Map view toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {isNearbyActive && coords && <RadiusSlider />}

          <button
            onClick={onToggleMap}
            className={`btn ${showMap ? 'btn-secondary' : 'btn-outline'} btn-sm`}
          >
            <i className={`fas ${showMap ? 'fa-list' : 'fa-map-marked-alt'}`}></i>
            {showMap ? 'Hide Map View' : 'Show Map View'}
          </button>
        </div>
      </div>
    </div>
  );
};
