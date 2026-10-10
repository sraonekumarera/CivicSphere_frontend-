import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../services/newsService';
import { candidateService } from '../services/candidateService';
import { NewsCard } from '../components/news/NewsCard';
import { CandidateCard } from '../components/candidates/CandidateCard';
import { useLocation } from '../context/LocationContext';

export const Home = () => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [featuredCandidates, setFeaturedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { coords, localityName, openConsentModal } = useLocation();

  useEffect(() => {
    Promise.all([
      newsService.getPublicNews(),
      candidateService.getVerifiedCandidates(),
    ])
      .then(([newsRes, candRes]) => {
        if (newsRes.data) setFeaturedNews(newsRes.data.slice(0, 3));
        if (candRes.data) setFeaturedCandidates(candRes.data.slice(0, 3));
      })
      .catch((err) => console.error('Error fetching home content:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="badge-pill">
            <i className="fas fa-satellite-dish" style={{ color: 'var(--success)' }}></i>
            <span>Consent-Based Local News & Public Accountability</span>
          </div>

          <h1>Transparent Community Engagement & Local Governance</h1>
          <p>
            CivicSphere connects citizens with verified municipal leaders, nearby civic updates, and neighborhood announcements — secured by role-based verification and ethical geolocation.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/news" className="btn btn-primary btn-lg">
              <i className="fas fa-newspaper"></i> Explore Local News
            </Link>
            <button onClick={openConsentModal} className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              <i className="fas fa-location-arrow"></i> {localityName ? `Locality: ${localityName}` : 'Set My Neighborhood'}
            </button>
          </div>
        </div>
      </section>

      {/* 3 Major Portals Overview */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Platform Access Portals</h2>
            <p className="section-subtitle">Dedicated workflows tailored for citizens, local leaders, and municipal admins</p>
          </div>
        </div>

        <div className="card-grid">
          {/* 1. Admin */}
          <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>1. Municipal Administrator</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate)', marginBottom: '1.25rem' }}>
                Verify candidate credentials against identity documents, moderate community news submissions, resolve flagged content, and review audit logs.
              </p>
              <Link to="/login" className="btn btn-outline btn-sm">
                <i className="fas fa-lock"></i> Admin Entrance
              </Link>
            </div>
          </div>

          {/* 2. Candidate */}
          <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
                <i className="fas fa-user-tie"></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>2. Local Leader / Candidate</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate)', marginBottom: '1.25rem' }}>
                Register constituency credentials, securely upload verification documents, publish news with location coordinates, and answer inquiries.
              </p>
              <Link to="/register-candidate" className="btn btn-secondary btn-sm">
                <i className="fas fa-id-card"></i> Candidate Register
              </Link>
            </div>
          </div>

          {/* 3. Citizen */}
          <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
            <div className="card-body">
              <div style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.75rem' }}>
                <i className="fas fa-users"></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>3. Citizen / Constituent</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate)', marginBottom: '1.25rem' }}>
                Explore nearby verified news, review verified representative platforms, participate in civic quizzes, and earn virtual reward coins.
              </p>
              <Link to="/register-citizen" className="btn btn-success btn-sm">
                <i className="fas fa-hand-holding-heart"></i> Citizen Register
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Latest Verified Community News</h2>
            <p className="section-subtitle">Official council actions, municipal health drives, and neighborhood updates</p>
          </div>
          <Link to="/news" className="btn btn-outline btn-sm">
            View All News <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate)' }}>Loading news feed...</div>
        ) : (
          <div className="card-grid">
            {featuredNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Verified Leaders Section */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Verified Local Representatives</h2>
            <p className="section-subtitle">Officially vetted candidates with confirmed constituency credentials</p>
          </div>
          <Link to="/candidates" className="btn btn-outline btn-sm">
            All Representatives <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate)' }}>Loading candidate directory...</div>
        ) : (
          <div className="card-grid">
            {featuredCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
