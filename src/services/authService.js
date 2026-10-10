import api from './api';

export const authService = {
  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    return res.data;
  },

  getCaptcha: async () => {
    const res = await api.get('/auth/captcha');
    return res.data;
  },

  registerAdmin: async (data) => {
    const res = await api.post('/auth/register-admin', data);
    return res.data;
  },

  registerCandidate: async (data) => {
    const res = await api.post('/auth/register-candidate', data);
    return res.data;
  },

  registerCitizen: async (data) => {
    const res = await api.post('/auth/register-citizen', data);
    return res.data;
  },

  sendOtp: async (username) => {
    const res = await api.post(`/auth/otp/send?username=${encodeURIComponent(username)}`);
    return res.data;
  },

  verifyOtp: async (username, otp) => {
    const res = await api.post('/auth/otp/verify', { username, otp });
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
