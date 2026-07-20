import axiosClient from './axiosClient';

export const applicationApi = {
  getAll: (params = {}) => axiosClient.get('/applications', { params }),
  getById: (id) => axiosClient.get(`/applications/${id}`),
  create: (data) => axiosClient.post('/applications', data),
  update: (id, data) => axiosClient.put(`/applications/${id}`, data),
  updateStatus: (id, data) => axiosClient.patch(`/applications/${id}/status`, data),
  remove: (id) => axiosClient.delete(`/applications/${id}`),
  history: (id) => axiosClient.get(`/applications/${id}/history`)
};
