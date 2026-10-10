import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { candidateService } from '../services/candidateService';
import { citizenService } from '../services/citizenService';
import { useAuth } from '../context/AuthContext';

export const CandidateDetailPage = () => {
  const { id } = useParams();
  const { isCitizen } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    setLoading(true);
    candidateService.getCandidateDetail(id)
      .then((res) => setCandidate(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Error loading profile'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !candidate) return;

    try {
      await citizenService.submitFeedback({
        candidateId: candidate.id,
        content: feedbackText.trim(),
      });
      setFeedbackSent(true);
      setFeedbackText('');
      setTimeout(() => setFeedbackSent(false), 3000);
    } catch (err) {
      alert('Error sending inquiry: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading candidate profile...</div>;
  }

  if (error || !candidate) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: 'var(--radius-md)' }}>
        <h2>Candidate Not Found</h2>
        <p style={{ color: 'var(--slate)', margin: '1rem 0' }}>{error}</p>
        <Link to="/candidates" className="btn btn-primary">Back to Directory</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0284c7, #4f46e5)', height: '120px' }}></div>
        <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-50px', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              {candidate.profilePhotoUrl ? (
                <img
                  src={candidate.profilePhotoUrl}
                  alt={candidate.name}
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: 'var(--shadow-md)' }}
                />
              ) : (
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#fff', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'var(--primary)', boxShadow: 'var(--shadow-md)' }}>
                  <i className="fas fa-user-tie"></i>
                </div>
              )}
              <div>
                <h1 style={{ fontSize: '1.8rem', color: 'var(--dark)' }}>{candidate.name}</h1>
                <div style={{ color: 'var(--secondary)', fontWeight: 600 }}>{candidate.party}</div>
              </div>
            </div>

            <span className="badge badge-verified" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <i className="fas fa-check-circle"></i> Verified Representative
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--slate)' }}>
            <div><i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)' }}></i> Constituency: <strong>{candidate.area}</strong></div>
            {candidate.verifiedAt && (
              <div><i className="fas fa-shield-alt" style={{ color: 'var(--success)' }}></i> Verified: <strong>{new Date(candidate.verifiedAt).toLocaleDateString()}</strong></div>
            )}
          </div>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--dark)', marginBottom: '0.75rem' }}>Policy Platform & Vision</h3>
          <div style={{ lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-line', marginBottom: '2rem' }}>
            {candidate.profile}
          </div>

          {/* Constituent inquiry form */}
          {isCitizen ? (
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>
                <i className="fas fa-envelope-open-text" style={{ color: 'var(--primary)' }}></i> Contact Representative
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate)', marginBottom: '1rem' }}>
                Submit questions or inquiries directly to this verified candidate. Earn <strong>+10 coins</strong>!
              </p>

              {feedbackSent ? (
                <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <i className="fas fa-check"></i> Inquiry sent to candidate! 10 coins awarded.
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit}>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter your message or inquiry..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                    style={{ marginBottom: '0.75rem' }}
                  ></textarea>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Send Direct Inquiry (+10 Coins)
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate)' }}>
                Please <Link to="/login" style={{ fontWeight: 600 }}>Sign In as a Citizen</Link> to send direct inquiries to this candidate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
