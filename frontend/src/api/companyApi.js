import axiosClient from './axiosClient';

export const companyApi = {
  getAll: (params = {}) => axiosClient.get('/companies', { params }),
  getById: (id) => axiosClient.get(`/companies/${id}`),
  create: (data) => axiosClient.post('/companies', data),
  update: (id, data) => axiosClient.put(`/companies/${id}`, data),
  remove: (id) => axiosClient.delete(`/companies/${id}`)
};
