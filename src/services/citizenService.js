import api from './api';

export const citizenService = {
  getWallet: async () => {
    const res = await api.get('/citizen/wallet');
    return res.data;
  },

  claimReadReward: async (newsId) => {
    const res = await api.post(`/citizen/read-award/${newsId}`);
    return res.data;
  },

  submitFeedback: async (data) => {
    const res = await api.post('/citizen/feedback', data);
    return res.data;
  },

  getMyFeedback: async () => {
    const res = await api.get('/citizen/feedback');
    return res.data;
  },

  submitReport: async (data) => {
    const res = await api.post('/citizen/report', data);
    return res.data;
  },

  getQuizzes: async () => {
    const res = await api.get('/citizen/quizzes');
    return res.data;
  },

  submitQuiz: async (quizId, selectedOption) => {
    const res = await api.post('/citizen/quizzes/submit', { quizId, selectedOption });
    return res.data;
  },
};
