import React from 'react';
import { useLocation } from '../../context/LocationContext';

export const LocationConsentModal = () => {
  const {
    isModalOpen,
    closeConsentModal,
    grantLocationConsent,
    denyLocationConsent,
    setManualLocality,
    localities,
    coords,
    localityName,
    revokeConsent,
  } = useLocation();

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeConsentModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              <i className="fas fa-location-arrow"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--dark)' }}>Location & Community Feed</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>Consent-Driven Civic Geolocation</p>
            </div>
          </div>
          <button
            onClick={closeConsentModal}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--light-slate)', cursor: 'pointer' }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--slate)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
          CivicSphere uses your location exclusively to display verified local council announcements, municipal projects, and community leaders relevant to your immediate neighborhood.
        </p>

        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#065f46', fontWeight: 600, marginBottom: '0.25rem' }}>
            <i className="fas fa-user-shield"></i> Your Privacy Guarantee
          </div>
          <div style={{ color: 'var(--slate)' }}>
            We <strong>never track your movements</strong> or share coordinates with third parties. You may revoke consent or choose a neighborhood manually anytime.
          </div>
        </div>

        {/* Current status if already set */}
        {coords && (
          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#ecfdf5', borderRadius: 'var(--radius-sm)', border: '1px solid #a7f3d0' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#065f46', fontWeight: 600 }}>ACTIVE LOCATION:</span>
              <div style={{ fontWeight: 600, color: '#047857' }}>
                {localityName || (coords?.latitude != null && coords?.longitude != null ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : 'Location Set')}
              </div>
            </div>
            <button
              onClick={revokeConsent}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--danger)', borderColor: '#fca5a5', background: '#fff' }}
            >
              <i className="fas fa-ban"></i> Revoke
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={grantLocationConsent}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem' }}
          >
            <i className="fas fa-crosshairs"></i> Use Device Location (GPS Permission)
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--light-slate)', margin: '0.25rem 0' }}>
            — OR SELECT YOUR NEIGHBORHOOD MANUALLY —
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
            {localities.map((loc) => (
              <button
                key={loc.name}
                onClick={() => setManualLocality(loc)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem 0.85rem',
                  background: localityName === loc.name ? 'var(--primary-light)' : '#ffffff',
                  border: `1px solid ${localityName === loc.name ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: varDarkColor(localityName === loc.name) }}>
                    {loc.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>{loc.description}</div>
                </div>
                <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem', color: 'var(--light-slate)' }}></i>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={denyLocationConsent} className="btn btn-outline btn-sm">
            Decline & Browse Citywide
          </button>
        </div>
      </div>
    </div>
  );
};

function varDarkColor(isSelected) {
  return isSelected ? 'var(--primary)' : 'var(--dark)';
}
