import api from "./api";

class IngredientService {
  async getIngredients(params = {}) {
    try {
      const response = await api.get("/ingredients", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch ingredients"
      );
    }
  }

  async getIngredientById(id) {
    try {
      const response = await api.get(`/ingredients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch ingredient"
      );
    }
  }

  async getIngredientByName(name, params = {}) {
    try {
      const response = await api.get(
        `/ingredients/name/${encodeURIComponent(name)}`,
        { params }
      );
      // Giả sử API trả về { data: {...}, message, code }
      // Chuyển đổi để khớp với cấu trúc mong đợi
      const ingredients = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
      return {
        data: ingredients, // Đảm bảo data là mảng
        meta: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: ingredients.length, // Giả sử total dựa trên length, cần điều chỉnh nếu API cung cấp
        },
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch ingredients by name"
      );
    }
  }

  async createIngredient(dto) {
    try {
      const response = await api.post("/ingredients", dto);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create ingredient"
      );
    }
  }

  async updateIngredient(id, ingredient) {
    try {
      const response = await api.put(`/ingredients/${id}`, ingredient);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update ingredient"
      );
    }
  }

  async deleteIngredient(id) {
    try {
      const response = await api.delete(`/ingredients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete ingredient"
      );
    }
  }
}

export const ingredientService = new IngredientService();
