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

  // Filter recipes by categoryIds and ingredientIds with pagination
  async filterRecipes({ categoryIds, ingredientIds, page, limit } = {}) {
    try {
      const params = {};

      if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
        params.categoryIds = categoryIds;
      }

      if (ingredientIds && Array.isArray(ingredientIds) && ingredientIds.length > 0) {
        params.ingredientIds = ingredientIds;
      }

      if (page !== undefined) {
        params.page = page;
      }
      if (limit !== undefined) {
        params.limit = limit;
      }

      const response = await api.get('/recipes/filter', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to filter recipes');
    }
  }

  async getTopContributors() {
    try {
      const response = await api.get('/recipes/users/top-contributors');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch top contributors');
    }
  }

  async getMostFavoritedRecipes(limit = 5) {
    try {
      const response = await api.get('/recipes/most-favorited');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch most favorited recipes');
    }
  }

  async searchRecipesByName(name, params = {}) {
    try {
      const response = await api.get('/recipes/search', {
        params: { name, ...params },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search recipes');
    }
  }

  // Create a new recipe
  async createRecipe(dto, files = {}) {
    try {
      const formData = new FormData();
      formData.append('dto', JSON.stringify(dto));

      if (files.images && files.images.length > 0) {
        files.images.forEach((file) => {
          formData.append('files', file);
        });
      }
      if (files.videos && files.videos.length > 0) {
        files.videos.forEach((file) => {
          formData.append('files', file);
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

      if (files.images && files.images.length > 0) {
        files.images.forEach((file) => {
          formData.append('files', file);
        });
      }
      if (files.videos && files.videos.length > 0) {
        files.videos.forEach((file) => {
          formData.append('files', file);
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