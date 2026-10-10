import api from './api';

export const adminService = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  getCandidates: async () => {
    const res = await api.get('/admin/candidates');
    return res.data;
  },

  performVerificationAction: async (id, action, remarks) => {
    const res = await api.post(`/admin/candidates/${id}/action`, { action, remarks });
    return res.data;
  },

  getPendingNews: async () => {
    const res = await api.get('/admin/news/pending');
    return res.data;
  },

  approveNews: async (id) => {
    const res = await api.post(`/admin/news/${id}/approve`);
    return res.data;
  },

  rejectNews: async (id, reason) => {
    const res = await api.post(`/admin/news/${id}/reject?reason=${encodeURIComponent(reason)}`);
    return res.data;
  },

  getReports: async () => {
    const res = await api.get('/admin/reports');
    return res.data;
  },

  resolveReport: async (id, action, adminNotes) => {
    const res = await api.post(`/admin/reports/${id}/resolve?action=${encodeURIComponent(action)}&adminNotes=${encodeURIComponent(adminNotes || '')}`);
    return res.data;
  },

  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  toggleUserStatus: async (id) => {
    const res = await api.post(`/admin/users/${id}/toggle-status`);
    return res.data;
  },

  getAuditLogs: async () => {
    const res = await api.get('/admin/audit-logs');
    return res.data;
  },
};
