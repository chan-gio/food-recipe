import api from './api';

class FavoriteService {
  async getAllFavorites(params = {}) {
    try {
      const response = await api.get('/favorites', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }

  async getFavoritesByUserId(userId, params = {}) {
    try {
      const response = await api.get(`/favorites/${userId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user favorites');
    }
  }

  async createFavorite(dto) {
    try {
      const response = await api.post('/favorites', dto);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create favorite');
    }
  }

  async deleteFavorite(userId, recipeId) {
    try {
      const response = await api.delete(`/favorites/${userId}/${recipeId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete favorite');
    }
  }
}

export const favoriteService = new FavoriteService();