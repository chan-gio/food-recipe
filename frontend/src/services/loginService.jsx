import api from './api';

class LoginService {
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      const { token, user_id } = response.data.data;
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_id', user_id);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    window.location.href = '/login';
  }
}

export const loginService = new LoginService();