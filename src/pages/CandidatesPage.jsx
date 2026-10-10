import React, { useEffect, useState } from 'react';
import { candidateService } from '../services/candidateService';
import { CandidateCard } from '../components/candidates/CandidateCard';

export const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [areaFilter, setAreaFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCandidates = () => {
    setLoading(true);
    candidateService.getVerifiedCandidates(areaFilter)
      .then((res) => {
        setCandidates(res.data || []);
      })
      .catch((err) => {
        console.error('Error fetching candidates:', err);
        setCandidates([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCandidates();
  }, [areaFilter]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '0.5rem' }}>
          Verified Local Representatives & Candidates
        </h1>
        <p style={{ color: 'var(--slate)', fontSize: '1rem' }}>
          Official candidate registry validated against legal credentials and electoral constituency proof
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Filter candidates by constituency area (e.g. Ward 4, Riverdale)..."
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          />
        </div>
        <button onClick={fetchCandidates} className="btn btn-primary">
          <i className="fas fa-filter"></i> Filter
        </button>
        {areaFilter && (
          <button onClick={() => setAreaFilter('')} className="btn btn-outline">
            Reset
          </button>
        )}
      </div>

      {/* Candidates Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate)' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--primary)' }}></i>
          <p>Loading verified representatives...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <i className="fas fa-user-tie" style={{ fontSize: '3rem', color: 'var(--light-slate)', marginBottom: '1rem' }}></i>
          <h3 style={{ color: 'var(--dark)', marginBottom: '0.5rem' }}>No verified candidates found</h3>
          <p style={{ color: 'var(--slate)' }}>Try adjusting your area filter or check back later.</p>
        </div>
      ) : (
        <div className="card-grid">
          {candidates.map((cand) => (
            <CandidateCard key={cand.id} candidate={cand} />
          ))}
        </div>
      )}
    </div>
  );
};
