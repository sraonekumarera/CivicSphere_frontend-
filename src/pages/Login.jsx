import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login(username.trim(), password);
      if (res.data) {
        const { token, ...userData } = res.data;
        login(token, userData);

        // Redirect based on role
        if (userData.role === 'ROLE_ADMIN') {
          navigate('/admin/dashboard');
        } else if (userData.role === 'ROLE_CANDIDATE') {
          navigate('/candidate/dashboard');
        } else {
          navigate('/citizen/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ width: '48px', height: '48px', margin: '0 auto 1rem auto', fontSize: '1.4rem' }}>
            <i className="fas fa-lock"></i>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--dark)' }}>Sign in to CivicSphere</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate)', marginTop: '0.25rem' }}>
            Access Citizen, Candidate, or Admin portals
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or elena_rostova"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>}
            {loading ? ' Authenticating...' : ' Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--slate)' }}>
          Don't have an account yet?
          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register-citizen" style={{ fontWeight: 600 }}>Citizen Register</Link>
            <span>•</span>
            <Link to="/register-candidate" style={{ fontWeight: 600 }}>Candidate Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
