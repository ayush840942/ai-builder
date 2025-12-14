/// <reference types="vite/client" />
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
        try {
            const { state } = JSON.parse(authData);
            if (state.token) {
                config.headers.Authorization = `Bearer ${state.token}`;
            }
        } catch (e) { }
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data: { email: string; password: string; name: string }) =>
        api.post('/api/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/api/auth/login', data),
    logout: () => api.post('/api/auth/logout'),
};

// Projects API
export const projectsAPI = {
    getAll: () => api.get('/api/projects'),
    getById: (id: string) => api.get(`/api/projects/${id}`),
    create: (data: { name: string; description?: string }) =>
        api.post('/api/projects', data),
    update: (id: string, data: any) => api.put(`/api/projects/${id}`, data),
    delete: (id: string) => api.delete(`/api/projects/${id}`),
};

// AI Code Generation API
export const aiAPI = {
    generateCode: (data: {
        prompt: string;
        type?: string;
    }) => api.post('/api/ai/generate', data),

    generateLanding: (description: string) =>
        api.post('/api/ai/landing', { description }),

    generateDashboard: (description: string) =>
        api.post('/api/ai/dashboard', { description }),

    improveCode: (data: { code: string; instructions: string }) =>
        api.post('/api/ai/improve', data),

    explainCode: (data: { code: string }) =>
        api.post('/api/ai/explain', data),
};

// Image Generation API
export const imageAPI = {
    generate: (data: {
        prompt: string;
        style?: string;
        provider?: 'stability' | 'huggingface'
    }) => api.post('/api/image/generate', data),

    getStyles: () => api.get('/api/image/styles'),
};

// Voice API
export const voiceAPI = {
    // Text to Speech - returns audio blob
    textToSpeech: async (text: string, voiceId?: string): Promise<Blob> => {
        const response = await api.post('/api/voice/tts', { text, voiceId }, {
            responseType: 'blob'
        });
        return response.data;
    },

    // Speech to Text
    speechToText: async (audioBlob: Blob): Promise<string> => {
        const response = await api.post('/api/voice/stt', audioBlob, {
            headers: { 'Content-Type': audioBlob.type }
        });
        return response.data.data.transcript;
    },

    // Get available voices
    getVoices: () => api.get('/api/voice/voices'),

    // Check service status
    getStatus: () => api.get('/api/voice/status'),
};

// Health check
export const healthAPI = {
    check: () => api.get('/health'),
};

export default api;
