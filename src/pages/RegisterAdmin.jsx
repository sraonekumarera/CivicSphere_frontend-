import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export const RegisterAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    secretKey: '',
    captchaInput: '',
  });

  const [captcha, setCaptcha] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadCaptcha = () => {
    authService.getCaptcha()
      .then((res) => setCaptcha(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.registerAdmin(formData);
      alert('Administrator account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin registration failed');
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
      <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ width: '48px', height: '48px', margin: '0 auto 1rem auto', fontSize: '1.4rem', background: 'var(--primary)' }}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--dark)' }}>Admin Portal Setup</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate)', marginTop: '0.25rem' }}>
            Restricted to authorized municipal electoral officers
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
            <label className="form-label">Administrative Master Secret Key</label>
            <input
              type="password"
              name="secretKey"
              className="form-control"
              placeholder="Enter master key..."
              value={formData.secretKey}
              onChange={handleChange}
              required
            />
            <small style={{ color: 'var(--slate)', fontSize: '0.75rem' }}>
              Default development key: <code>CIVIC_SPHERE_SUPER_ADMIN_2026</code>
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Administrator Full Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Admin Username</label>
              <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required minLength="6" />
            </div>
          </div>

          {/* Captcha */}
          {captcha && (
            <div className="form-group" style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Anti-Bot Security:</label>
                <button type="button" onClick={loadCaptcha} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}>
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--dark)', marginBottom: '0.5rem' }}>
                {captcha.question}
              </div>
              <input type="text" name="captchaInput" className="form-control" placeholder="Result..." value={formData.captchaInput} onChange={handleChange} required />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating Administrator...' : 'Create Admin Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--slate)' }}>
          Already have admin access? <Link to="/login" style={{ fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};
