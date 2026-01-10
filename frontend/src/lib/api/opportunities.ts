import apiClient from './client';

export const opportunitiesAPI = {
  // Health check
  healthCheck: async () => {
    return apiClient.get('/health');
  },

  // Get all opportunities
  getAll: async () => {
    return apiClient.get('/opportunities');
  },

  // Get opportunities by type
  getByType: async (type: string) => {
    return apiClient.get(`/opportunities?type=${type}`);
  },

  // Search opportunities
  search: async (query: string) => {
    return apiClient.get(`/opportunities/search?q=${query}`);
  },
};