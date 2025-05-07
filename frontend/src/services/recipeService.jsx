import api from './api';

class RecipeService {
  async getRecipes(params = {}) {
    try {
      const response = await api.get('/recipes', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recipes');
    }
  }

  async getRecipeById(id) {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recipe');
    }
  }

  async createRecipe(dto) {
    try {
      const response = await api.post('/recipes', dto);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create recipe');
    }
  }

  async updateRecipe(id, recipe) {
    try {
      const response = await api.put(`/recipes/${id}`, recipe);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update recipe');
    }
  }

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