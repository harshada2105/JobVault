import axiosClient from './axiosClient';

export const interviewApi = {
  getAll: (params = {}) => axiosClient.get('/interviews', { params }),
  getById: (id) => axiosClient.get(`/interviews/${id}`),
  create: (data) => axiosClient.post('/interviews', data),
  update: (id, data) => axiosClient.put(`/interviews/${id}`, data),
  updateStatus: (id, data) => axiosClient.patch(`/interviews/${id}/status`, data),
  remove: (id) => axiosClient.delete(`/interviews/${id}`)
};
