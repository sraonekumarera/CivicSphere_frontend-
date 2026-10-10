import api from './api';

export const mediaService = {
  uploadProfilePhoto: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/media/upload/profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return res.data;
  },

  uploadNewsImage: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/media/upload/news-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return res.data;
  },

  uploadNewsAttachment: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/media/upload/news-attachment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return res.data;
  },

  uploadCandidateDocument: async (file, documentType, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const res = await api.post('/media/upload/candidate-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return res.data;
  },

  downloadSecureDocument: async (storageKey, fileName) => {
    const res = await api.get(`/media/secure/candidate-document/${storageKey}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'candidate_document.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
