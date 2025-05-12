import api from './api';

class RecipeService {
  // Fetch all recipes with pagination
  async getRecipes(params = {}) {
    try {
      const response = await api.get('/recipes', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recipes');
    }
  }

  // Fetch a single recipe by ID
  async getRecipeById(id) {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recipe');
    }
  }

  // Fetch recipes by user ID with pagination
  async getRecipesByUserId(userId, params = {}) {
    try {
      const response = await api.get(`/recipes/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recipes by user');
    }
  }

  // Create a new recipe
  async createRecipe(dto, files = {}) {
    try {
      const formData = new FormData();
      formData.append('dto', JSON.stringify(dto));

      // Add image files if provided
      if (files.images && files.images.length > 0) {
        files.images.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      }

      // Add video files if provided
      if (files.videos && files.videos.length > 0) {
        files.videos.forEach((file, index) => {
          formData.append(`videos[${index}]`, file);
        });
      }

      const response = await api.post('/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create recipe');
    }
  }

  // Update an existing recipe
  async updateRecipe(id, dto, files = {}) {
    try {
      const formData = new FormData();
      formData.append('dto', JSON.stringify(dto));

      // Add image files if provided
      if (files.images && files.images.length > 0) {
        files.images.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      }

      // Add video files if provided
      if (files.videos && files.videos.length > 0) {
        files.videos.forEach((file, index) => {
          formData.append(`videos[${index}]`, file);
        });
      }

      const response = await api.put(`/recipes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update recipe');
    }
  }

  // Delete a recipe
  async deleteRecipe(id) {
    try {
      const response = await api.delete(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete recipe');
    }
  }
}

export const recipeService = new RecipeService();