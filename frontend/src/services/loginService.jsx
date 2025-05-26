import api from './api';

class LoginService {
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      const { access_token, user_id } = response.data.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_id', user_id);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }
}

export const loginService = new LoginService();