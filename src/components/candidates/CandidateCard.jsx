import React from 'react';
import { Link } from 'react-router-dom';

export const CandidateCard = ({ candidate }) => {
  return (
    <div className="card">
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid var(--border)', background: '#fafafa' }}>
        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
          {candidate.profilePhotoUrl ? (
            <img
              src={candidate.profilePhotoUrl}
              alt={candidate.name}
              style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)', boxShadow: 'var(--shadow-sm)' }}
            />
          ) : (
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
              <i className="fas fa-user-tie"></i>
            </div>
          )}
          <span
            className="badge badge-verified"
            style={{ position: 'absolute', bottom: '-4px', right: '-4px', boxShadow: 'var(--shadow-sm)', padding: '0.2rem 0.5rem' }}
            title="Officially verified candidate"
          >
            <i className="fas fa-check-circle"></i> Verified
          </span>
        </div>

        <h3 style={{ fontSize: '1.2rem', color: 'var(--dark)', fontWeight: 700, marginBottom: '0.25rem' }}>
          {candidate.name}
        </h3>
        <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: '0.35rem' }}>
          {candidate.party || 'Independent'}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)' }}></i>
          <span>{candidate.area}</span>
        </div>
      </div>

      <div className="card-body">
        <p style={{ fontSize: '0.88rem', color: 'var(--slate)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {candidate.profile}
        </p>
      </div>

      <div className="card-footer" style={{ justifyContent: 'center' }}>
        <Link to={`/candidates/${candidate.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
          View Full Profile & Platform <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};
