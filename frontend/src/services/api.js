import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/user'),
  logout: () => Promise.resolve()
};

// Profile Service
export const profileService = {
  getProfile: (userId) => api.get(`/profile/${userId}`),
  updateProfile: (userId, profileData) => api.put(`/profile/${userId}`, profileData),
  deleteProfile: (userId) => api.delete(`/profile/${userId}`)
};

// Application Service
export const applicationService = {
  createApplication: (applicationData) => api.post('/applications', applicationData),
  getUserApplications: () => api.get('/applications'),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateApplication: (id, applicationData) => api.put(`/applications/${id}`, applicationData),
  deleteApplication: (id) => api.delete(`/applications/${id}`)
};

// Document Service
export const documentService = {
  uploadDocument: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getDocumentsByApplication: (applicationId) => api.get(`/documents/${applicationId}`),
  deleteDocument: (documentId) => api.delete(`/documents/${documentId}`)
};

// Admin Service
export const adminService = {
  getAllApplications: (params) => api.get('/admin/applications', { params }),
  getStatistics: () => api.get('/admin/statistics'),
  getApplicationDetails: (applicationId) => api.get(`/admin/applications/${applicationId}`),
  updateApplicationStatus: (applicationId, status) => 
    api.put(`/admin/applications/${applicationId}/status`, { status }),
  deleteApplication: (applicationId) => api.delete(`/admin/applications/${applicationId}`)
};

// AI Service
export const aiService = {
  evaluateApplication: (applicationId) => api.post(`/ai/evaluate/${applicationId}`),
  evaluateAllApplications: () => api.post('/ai/evaluate-all')
};

export default api;
