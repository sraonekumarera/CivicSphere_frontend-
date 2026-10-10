import React from 'react';
import { Link } from 'react-router-dom';

export const NewsCard = ({ news }) => {
  return (
    <div className="card">
      <div className="card-img-wrapper">
        {news.imageUrl ? (
          <img src={news.imageUrl} alt={news.title} className="card-img" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: 'var(--slate)' }}>
            <i className="fas fa-newspaper" style={{ fontSize: '2.5rem' }}></i>
          </div>
        )}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.4rem' }}>
          <span className="badge badge-category">{news.category}</span>
          {news.distanceKm != null && typeof news.distanceKm === 'number' && (
            <span className="badge badge-geo">
              <i className="fas fa-location-arrow"></i> {news.distanceKm.toFixed(1)} km
            </span>
          )}
        </div>
      </div>

      <div className="card-body">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: '1.3' }}>
          <Link to={`/news/${news.id}`} style={{ color: 'var(--dark)' }}>
            {news.title}
          </Link>
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--slate)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {news.summary}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--light-slate)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}>
            <i className="fas fa-map-marker-alt"></i>
            <span style={{ fontWeight: 600 }}>{news.localityName || news.location}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <i className="fas fa-calendar-alt"></i> {new Date(news.createdAt).toLocaleDateString()}
            </span>
            {news.attachmentName && (
              <span className="badge" style={{ background: '#fef3c7', color: '#b45309', textTransform: 'none' }} title="Downloadable file attached">
                <i className="fas fa-paperclip"></i> Attachment
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {news.authorPhotoUrl ? (
            <img src={news.authorPhotoUrl} alt="author" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <i className="fas fa-user-circle" style={{ color: 'var(--slate)' }}></i>
          )}
          <span style={{ fontSize: '0.82rem', color: 'var(--slate)' }}>
            By <strong>{news.authorName}</strong>
          </span>
        </div>
        <Link to={`/news/${news.id}`} className="btn btn-primary btn-sm">
          Read Story <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};
