import React, { useEffect, useState } from 'react';
import { newsService } from '../services/newsService';
import { useLocation } from '../context/LocationContext';
import { NewsCard } from '../components/news/NewsCard';
import { NearbyNewsFilter } from '../components/news/NearbyNewsFilter';
import { LeafletMap } from '../components/location/LeafletMap';

export const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const { coords, radiusKm, openConsentModal } = useLocation();

  const categories = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Civic & Council', value: 'Civic' },
    { label: 'Infrastructure', value: 'Infrastructure' },
    { label: 'Health & Wellness', value: 'Health' },
    { label: 'Education & Youth', value: 'Education' },
    { label: 'Environment & Parks', value: 'Environment' },
    { label: 'Community Events', value: 'Events' },
  ];

  const fetchNews = async () => {
    setLoading(true);
    try {
      if (isNearbyActive && coords) {
        const res = await newsService.getNearbyNews(coords.latitude, coords.longitude, radiusKm);
        let items = res.data || [];
        if (category !== 'ALL') {
          items = items.filter((item) => item.category?.toLowerCase() === category.toLowerCase());
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          items = items.filter(
            (item) =>
              item.title?.toLowerCase().includes(q) ||
              item.summary?.toLowerCase().includes(q) ||
              item.location?.toLowerCase().includes(q)
          );
        }
        setNewsList(items);
      } else {
        const res = await newsService.getPublicNews(category, searchQuery);
        setNewsList(res.data || []);
      }
    } catch (err) {
      console.error('Error loading news:', err);
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category, isNearbyActive, coords, radiusKm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNews();
  };

  const handleToggleNearby = () => {
    if (!coords && !isNearbyActive) {
      openConsentModal();
      setIsNearbyActive(true);
    } else {
      setIsNearbyActive(!isNearbyActive);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '0.5rem' }}>
          Local News & Civic Announcements
        </h1>
        <p style={{ color: 'var(--slate)', fontSize: '1rem' }}>
          Official municipal actions, neighborhood updates, and community reports
        </p>
      </div>

      {/* Geolocation Toolbar */}
      <NearbyNewsFilter
        isNearbyActive={isNearbyActive}
        onToggleNearby={handleToggleNearby}
        showMap={showMap}
        onToggleMap={() => setShowMap(!showMap)}
      />

      {/* Interactive Map View */}
      {showMap && (
        <div style={{ marginBottom: '2rem' }}>
          <LeafletMap
            centerCoords={coords}
            newsItems={newsList}
            radiusKm={isNearbyActive ? radiusKm : 0}
            height="380px"
          />
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search news by keyword, title, or neighborhood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            <i className="fas fa-search"></i> Search
          </button>
          <button
            type="button"
            onClick={() => { setCategory('ALL'); setSearchQuery(''); setIsNearbyActive(false); }}
            className="btn btn-outline"
          >
            Reset
          </button>
        </form>
      </div>

      {/* News Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate)' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--primary)' }}></i>
          <p>Loading verified community stories...</p>
        </div>
      ) : newsList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <i className="fas fa-newspaper" style={{ fontSize: '3rem', color: 'var(--light-slate)', marginBottom: '1rem' }}></i>
          <h3 style={{ color: 'var(--dark)', marginBottom: '0.5rem' }}>No articles found</h3>
          <p style={{ color: 'var(--slate)', maxWidth: '500px', margin: '0 auto' }}>
            {isNearbyActive
              ? `No approved articles currently found within ${radiusKm} km of your selected locality. Try widening your radius slider or switching to citywide feed.`
              : 'Try modifying your search keywords or switching category filters.'}
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {newsList.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      )}
    </div>
  );
};
