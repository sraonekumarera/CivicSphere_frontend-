import React from 'react';
import { useLocation } from '../../context/LocationContext';

export const RadiusSlider = ({ onChange }) => {
  const { radiusKm, updateRadius } = useLocation();

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    updateRadius(val);
    if (onChange) onChange(val);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate)', whiteSpace: 'nowrap' }}>
        <i className="fas fa-bullseye" style={{ color: 'var(--primary)', marginRight: '4px' }}></i>
        Radius: <span style={{ color: 'var(--dark)' }}>{radiusKm} km</span>
      </label>
      <input
        type="range"
        min="1"
        max="50"
        step="1"
        value={radiusKm}
        onChange={handleSliderChange}
        style={{
          cursor: 'pointer',
          accentColor: 'var(--primary)',
          width: '130px',
        }}
      />
    </div>
  );
};
