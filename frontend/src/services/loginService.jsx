import api from './api';

class LoginService {
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      const token = response.data.data.token;
      localStorage.setItem('access_token', token);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }
}

export const loginService = new LoginService();