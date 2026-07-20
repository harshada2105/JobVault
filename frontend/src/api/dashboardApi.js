import axiosClient from './axiosClient';

export const dashboardApi = {
  summary: () => axiosClient.get('/dashboard/summary'),
  statistics: () => axiosClient.get('/statistics')
};
