import api from './api';

export const candidateService = {
  getVerifiedCandidates: async (area = '') => {
    let url = '/candidates/public';
    if (area) url += `?area=${encodeURIComponent(area)}`;
    const res = await api.get(url);
    return res.data;
  },

  getCandidateDetail: async (id) => {
    const res = await api.get(`/candidates/public/${id}`);
    return res.data;
  },

  getMyProfile: async () => {
    const res = await api.get('/candidate/me');
    return res.data;
  },

  updateMyProfile: async (data) => {
    const res = await api.put('/candidate/me', data);
    return res.data;
  },

  getMyNews: async () => {
    const res = await api.get('/candidate/news');
    return res.data;
  },

  getMyFeedback: async () => {
    const res = await api.get('/candidate/feedback');
    return res.data;
  },

  replyFeedback: async (id, reply) => {
    const res = await api.post(`/candidate/feedback/${id}/reply`, { reply });
    return res.data;
  },
};
