import axiosClient from './axiosClient';

export const profileApi = {
  get: () => axiosClient.get('/profile'),
  update: (data) => axiosClient.put('/profile', data)
};
