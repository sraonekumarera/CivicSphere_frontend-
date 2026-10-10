import api from './api';

export const locationService = {
  getLocalities: async () => {
    const res = await api.get('/location/localities');
    return res.data;
  },

  getPreference: async () => {
    const res = await api.get('/location/preference');
    return res.data;
  },

  savePreference: async (data) => {
    const res = await api.post('/location/preference', data);
    return res.data;
  },

  revokeConsent: async () => {
    const res = await api.delete('/location/preference');
    return res.data;
  },
};
