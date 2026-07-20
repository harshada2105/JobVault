import axiosClient from './axiosClient';

export const documentApi = {
  getAll: () => axiosClient.get('/documents'),
  create: (data) => axiosClient.post('/documents', data),
  remove: (id) => axiosClient.delete(`/documents/${id}`)
};
