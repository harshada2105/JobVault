import axiosClient from './axiosClient';

export const searchApi = {
  search: (query) => axiosClient.get('/search', { params: { query } })
};
