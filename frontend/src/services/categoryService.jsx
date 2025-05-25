import api from "./api";

class CategoryService {
  async getCategories(params = {}) {
    try {
      const response = await api.get("/categories", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }

  async getCategoriesByName(name, params = {}) {
    try {
      const response = await api.get(
        `/categories/name/${encodeURIComponent(name)}`,
        { params }
      );
      // Điều chỉnh để phù hợp với dữ liệu trả về
      return {
        data: response.data.data,
        meta: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: response.data.data.length, // Giả sử total dựa trên length của data
        },
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories by name"
      );
    }
  }

  async getCategoryById(id) {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch category"
      );
    }
  }

  async createCategory(category) {
    try {
      const response = await api.post("/categories", category);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }

  async updateCategory(id, category) {
    try {
      const response = await api.put(`/categories/${id}`, category);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }

  async deleteCategory(id) {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }

  // Added method to fetch recipes
  async getRecipes(params = {}) {
    try {
      const response = await api.get("/recipes", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch recipes"
      );
    }
  }
}

export const categoryService = new CategoryService();
