import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { citizenService } from '../../services/citizenService';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isCandidate, isCitizen, logout } = useAuth();
  const { coords, localityName, openConsentModal } = useLocation();
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    if (isAuthenticated && isCitizen) {
      citizenService.getWallet()
        .then((res) => {
          if (res.data) setWalletBalance(res.data.balance);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, isCitizen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <i className="fas fa-landmark"></i>
          </div>
          <span>CivicSphere</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink to="/news" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <i className="fas fa-newspaper" style={{ marginRight: '4px' }}></i> Local News
            </NavLink>
          </li>
          <li>
            <NavLink to="/candidates" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <i className="fas fa-user-tie" style={{ marginRight: '4px' }}></i> Local Leaders
            </NavLink>
          </li>

          {/* Location indicator button */}
          <li>
            <button
              onClick={openConsentModal}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '9999px' }}
              title="Change your community locality"
            >
              <i className="fas fa-map-marker-alt" style={{ color: coords ? 'var(--success)' : 'var(--slate)' }}></i>
              <span style={{ fontSize: '0.8rem', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {localityName || (coords ? 'Location Set' : 'Select Locality')}
              </span>
            </button>
          </li>

          {isAuthenticated ? (
            <>
              {/* Civic Coins Badge for Citizens */}
              {isCitizen && walletBalance !== null && (
                <li>
                  <Link
                    to="/citizen/dashboard"
                    className="badge"
                    style={{ background: '#fef3c7', color: '#b45309', padding: '0.4rem 0.75rem', fontSize: '0.82rem', textDecoration: 'none' }}
                    title="Civic Reward Coins"
                  >
                    <i className="fas fa-coins" style={{ color: '#d97706' }}></i> {walletBalance} Coins
                  </Link>
                </li>
              )}

              {/* Role specific dashboard link */}
              {isAdmin && (
                <li>
                  <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-shield-alt" style={{ color: 'var(--primary)' }}></i> Admin Console
                  </NavLink>
                </li>
              )}
              {isCandidate && (
                <li>
                  <NavLink to="/candidate/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-id-card" style={{ color: 'var(--secondary)' }}></i> Candidate Portal
                  </NavLink>
                </li>
              )}
              {isCitizen && (
                <li>
                  <NavLink to="/citizen/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <i className="fas fa-user-circle"></i> Citizen Hub
                  </NavLink>
                </li>
              )}

              {/* User profile & logout */}
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {user.profilePhotoUrl ? (
                  <img
                    src={user.profilePhotoUrl}
                    alt="avatar"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Sign Out">
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register-citizen" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
