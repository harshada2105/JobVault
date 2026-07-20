import axiosClient from './axiosClient';

export const contactApi = {
  getAll: (params = {}) => axiosClient.get('/contacts', { params }),
  getById: (id) => axiosClient.get(`/contacts/${id}`),
  create: (data) => axiosClient.post('/contacts', data),
  update: (id, data) => axiosClient.put(`/contacts/${id}`, data),
  remove: (id) => axiosClient.delete(`/contacts/${id}`)
};
