import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:5000/api' 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000 // 60 secondes pour les gros fichiers
});

export const speechAPI = {
  // Transcription simple
  transcribeAudio: async (audioFile) => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await api.post('/speech/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la transcription');
    }
  },

  // Transcription avec timestamps
  transcribeWithTimestamps: async (audioFile) => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await api.post('/speech/transcribe-timestamps', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la transcription');
    }
  },

  // Test de santé du backend
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend indisponible');
    }
  }
};

export default api;