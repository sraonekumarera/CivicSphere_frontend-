import React from 'react';
import { useLocation } from '../../context/LocationContext';

export const LocalitySelector = ({ onSelect }) => {
  const { localities, localityName, setManualLocality } = useLocation();

  const handleChange = (e) => {
    const val = e.target.value;
    if (!val) return;
    const found = localities.find((l) => l.name === val);
    if (found) {
      setManualLocality(found);
      if (onSelect) onSelect(found);
    }
  };

  return (
    <select
      className="form-control"
      value={localityName || ''}
      onChange={handleChange}
      style={{ fontSize: '0.88rem', minWidth: '200px' }}
    >
      <option value="">Choose Neighborhood...</option>
      {localities.map((loc) => (
        <option key={loc.name} value={loc.name}>
          {loc.name}
        </option>
      ))}
    </select>
  );
};
