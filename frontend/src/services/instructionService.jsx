import api from './api';

class InstructionService {
  async getInstructions(params = {}) {
    try {
      const response = await api.get('/instructions', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch instructions');
    }
  }

  async getInstructionById(id) {
    try {
      const response = await api.get(`/instructions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch instruction');
    }
  }

  async createInstruction(dto) {
    try {
      const response = await api.post('/instructions', dto);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create instruction');
    }
  }

  async updateInstruction(id, instruction) {
    try {
      const response = await api.put(`/instructions/${id}`, instruction);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update instruction');
    }
  }

  async deleteInstruction(id) {
    try {
      const response = await api.delete(`/instructions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete instruction');
    }
  }
}

export const instructionService = new InstructionService();