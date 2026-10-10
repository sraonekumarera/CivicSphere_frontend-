import api from './api';

export const newsService = {
  getPublicNews: async (category = '', query = '') => {
    let url = '/news/public';
    const params = new URLSearchParams();
    if (category && category !== 'ALL') params.append('category', category);
    if (query) params.append('q', query);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await api.get(url);
    return res.data;
  },

  getNearbyNews: async (lat, lng, radiusKm = 15) => {
    const res = await api.get(`/news/public/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`);
    return res.data;
  },

  getNewsDetail: async (id) => {
    const res = await api.get(`/news/public/${id}`);
    return res.data;
  },

  createCandidateNews: async (data) => {
    const res = await api.post('/news/candidate', data);
    return res.data;
  },

  createAdminNews: async (data) => {
    const res = await api.post('/news/admin', data);
    return res.data;
  },

  updateNews: async (id, data) => {
    const res = await api.put(`/news/${id}`, data);
    return res.data;
  },

  deleteNews: async (id) => {
    const res = await api.delete(`/news/${id}`);
    return res.data;
  },
};
