import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LocationConsentModal } from './components/location/LocationConsentModal';

// Pages
import { Home } from './pages/Home';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { CandidateDetailPage } from './pages/CandidateDetailPage';
import { Login } from './pages/Login';
import { RegisterCitizen } from './pages/RegisterCitizen';
import { RegisterCandidate } from './pages/RegisterCandidate';
import { RegisterAdmin } from './pages/RegisterAdmin';
import { AdminDashboard } from './pages/AdminDashboard';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { NotFound } from './pages/NotFound';

import './App.css';

export const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <LocationConsentModal />

      <main className="main-content">
        <div className="container">
          <Routes>
            {/* Public Feeds */}
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/candidates/:id" element={<CandidateDetailPage />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register-citizen" element={<RegisterCitizen />} />
            <Route path="/register-candidate" element={<RegisterCandidate />} />
            <Route path="/register-admin" element={<RegisterAdmin />} />

            {/* Role-Protected Portals */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_CANDIDATE']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
