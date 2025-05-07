import api from './api';

class ReviewService {
  async getReviews(params = {}) {
    try {
      const response = await api.get('/reviews', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }

  async getReviewById(id) {
    try {
      const response = await api.get(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch review');
    }
  }

  async createReview(dto) {
    try {
      const response = await api.post('/reviews', dto);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  }

  async updateReview(id, review) {
    try {
      const response = await api.put(`/reviews/${id}`, review);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  }

  async deleteReview(id) {
    try {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  }
}

export const reviewService = new ReviewService();