import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="brand-icon" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>
            <i className="fas fa-landmark"></i>
          </div>
          <span style={{ fontWeight: 700, color: 'var(--dark)' }}>CivicSphere</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--light-slate)' }}>— Local News & Public Engagement Platform</span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
          <Link to="/news">Local News</Link>
          <Link to="/candidates">Verified Candidates</Link>
          <Link to="/register-candidate">Candidate Registration</Link>
          <Link to="/register-admin">Administrator Portal</Link>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--light-slate)' }}>
          © {new Date().getFullYear()} CivicSphere. Secure, Decentralized & Community-Driven.
        </div>
      </div>
    </footer>
  );
};
