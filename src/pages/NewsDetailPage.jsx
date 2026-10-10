import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsService } from '../services/newsService';
import { citizenService } from '../services/citizenService';
import { useAuth } from '../context/AuthContext';

export const NewsDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isCitizen } = useAuth();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [coinAwarded, setCoinAwarded] = useState(false);

  // Reporting modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    newsService.getNewsDetail(id)
      .then((res) => {
        setNews(res.data);
        // If logged in as Citizen, claim reading engagement coin reward!
        if (isAuthenticated && isCitizen) {
          citizenService.claimReadReward(id)
            .then(() => setCoinAwarded(true))
            .catch(() => {});
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error loading article');
      })
      .finally(() => setLoading(false));
  }, [id, isAuthenticated, isCitizen]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !news) return;

    setSubmittingFeedback(true);
    try {
      await citizenService.submitFeedback({
        candidateId: news.authorId,
        newsId: news.id,
        content: feedbackText.trim(),
      });
      setFeedbackText('');
      alert('Feedback submitted successfully! +10 Civic Coins credited to your wallet.');
    } catch (err) {
      alert('Error submitting feedback: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim() || !news) return;

    try {
      await citizenService.submitReport({
        newsId: news.id,
        reason: reportReason.trim(),
      });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportReason('');
      }, 2000);
    } catch (err) {
      alert('Error filing report: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--slate)' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}></i>
        <p>Loading article...</p>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: 'var(--danger)', marginBottom: '1rem' }}></i>
        <h2>Article Not Found</h2>
        <p style={{ color: 'var(--slate)', margin: '0.75rem 0 1.5rem 0' }}>{error || 'This article could not be retrieved.'}</p>
        <Link to="/news" className="btn btn-primary">
          <i className="fas fa-arrow-left"></i> Back to Local News
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Coin Award Notification */}
      {coinAwarded && (
        <div style={{ background: '#d1fae5', border: '1px solid #34d399', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <i className="fas fa-coins" style={{ fontSize: '1.5rem', color: '#b45309' }}></i>
          <div>
            <strong style={{ color: '#065f46' }}>Civic Engagement Reward!</strong>
            <div style={{ fontSize: '0.85rem', color: '#047857' }}>
              You earned <strong>+5 Virtual Coins</strong> for actively reading this verified civic update. Credited to your Civic Wallet!
            </div>
          </div>
        </div>
      )}

      {/* Article Container */}
      <article style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className="badge badge-category">{news.category}</span>
          <span className="badge badge-verified">
            <i className="fas fa-check-circle"></i> Official & Verified
          </span>
          {news.distanceKm != null && typeof news.distanceKm === 'number' && (
            <span className="badge badge-geo">
              <i className="fas fa-location-arrow"></i> {news.distanceKm.toFixed(1)} km away
            </span>
          )}
        </div>

        <h1 style={{ fontSize: '2.2rem', lineHeight: '1.25', marginBottom: '1rem', color: 'var(--dark)' }}>
          {news.title}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', fontSize: '0.88rem', color: 'var(--slate)' }}>
          <div><i className="fas fa-user-circle"></i> Author: <strong>{news.authorName}</strong></div>
          <div><i className="fas fa-map-marker-alt"></i> Location: <strong>{news.localityName || news.location}</strong></div>
          <div><i className="fas fa-calendar-alt"></i> Published: {new Date(news.createdAt).toLocaleDateString()}</div>
          <div><i className="fas fa-eye"></i> Views: {news.views}</div>
        </div>

        {/* Hero Image */}
        {news.imageUrl && (
          <div style={{ marginBottom: '2rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '450px', border: '1px solid var(--border)' }}>
            <img src={news.imageUrl} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {/* Body Text */}
        <div style={{ fontSize: '1.08rem', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-line', marginBottom: '2rem' }}>
          {news.content}
        </div>

        {/* File Attachment Card */}
        {news.attachmentName && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid var(--secondary)', borderRadius: 'var(--radius-sm)', margin: '2rem 0', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fas fa-file-pdf" style={{ fontSize: '2rem', color: '#ef4444' }}></i>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--dark)', fontSize: '0.95rem' }}>{news.attachmentName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>Official Municipal Attachment</div>
              </div>
            </div>
            {news.attachmentKey && (
              <a
                href={news.attachmentKey.startsWith('http') ? news.attachmentKey : `/api/media/public/${news.attachmentKey}`}
                target="_blank"
                rel="noreferrer"
                download
                className="btn btn-secondary btn-sm"
              >
                <i className="fas fa-download"></i> Download Document
              </a>
            )}
          </div>
        )}

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/news" className="btn btn-outline btn-sm">
            <i className="fas fa-arrow-left"></i> Back to News
          </Link>

          {isCitizen && (
            <button
              onClick={() => setShowReportModal(true)}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}
            >
              <i className="fas fa-flag"></i> Report Inaccurate Content
            </button>
          )}
        </div>
      </article>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#991b1b', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
              <i className="fas fa-exclamation-triangle"></i> Flag Content for Admin Review
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--slate)', marginBottom: '1.25rem' }}>
              Citizens earn <strong>+10 reward coins</strong> for helping administrators identify misleading, offensive, or inaccurate news.
            </p>

            {reportSuccess ? (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                <div>Report submitted to moderation queue! Watchdog coins credited.</div>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <div className="form-group">
                  <label className="form-label">Reason for reporting</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Describe why this article is inaccurate or violates platform guidelines..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowReportModal(false)} className="btn btn-outline btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger btn-sm">
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Citizen Feedback Form */}
      <section style={{ background: '#ffffff', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-comments" style={{ color: 'var(--primary)' }}></i> Community Feedback & Inquiries
        </h3>

        {isCitizen ? (
          <form onSubmit={handleFeedbackSubmit} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Leave a Question or Public Feedback</label>
              <span className="badge" style={{ background: '#fef3c7', color: '#b45309' }}>+10 Coins</span>
            </div>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Ask a question to the author or share your civic perspective..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
              style={{ marginBottom: '0.75rem' }}
            ></textarea>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submittingFeedback}>
              <i className="fas fa-paper-plane"></i> {submittingFeedback ? 'Submitting...' : 'Post Feedback (+10 Coins)'}
            </button>
          </form>
        ) : (
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--slate)' }}>
            <p style={{ fontSize: '0.92rem' }}>
              Want to join the conversation and earn civic reward coins?{' '}
              <Link to="/login" style={{ fontWeight: 600 }}>Sign In</Link> or{' '}
              <Link to="/register-citizen" style={{ fontWeight: 600 }}>Register as a Citizen</Link>.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
