import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.8rem', color: 'var(--dark)', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--slate)', maxWidth: '450px', margin: '0 auto 2rem auto' }}>
        The page you are looking for does not exist or has been moved to another civic portal directory.
      </p>
      <Link to="/" className="btn btn-primary">
        <i className="fas fa-home"></i> Return to CivicSphere Home
      </Link>
    </div>
  );
};
