import api from './api';

class UserService {
  // Fetch all users with pagination
  async getUsers(params = {}) {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  // Fetch a single user by ID
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }

  // Register a new user
  async register(user) {
    try {
      const response = await api.post('/users', user);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Update a user, including profile picture
  async updateUser(id, userData, file) {
    try {
      const formData = new FormData();
      // Append user data as raw JSON
      Object.keys(userData).forEach(key => {
        if (userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });

      // Add profile picture file if provided
      if (file) {
        formData.append('profile_picture', file);
      }

      const response = await api.put(`/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  }

  // Delete a user
  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }
// Search a user
  async searchUsers({ full_name, email, page = 1, limit = 10 }) {
    try {
      const response = await api.get('/users/search', {
        params: { full_name, email, page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search users');
    }
  }
}

export const userService = new UserService();