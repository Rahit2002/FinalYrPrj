import apiClient from './api.js';

class AuthService {
  // Patient Authentication
  async registerPatient(userData) {
    try {
      const payload = {
        email: userData.email,
        password: userData.password,
        fullName: `${userData.firstName} ${userData.lastName}`.trim(),
        gender: userData.gender,
        phoneNumber: userData.phone
      };

      const response = await apiClient.post('/patient/register', payload);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async loginPatient(email, password) {
    try {
      const payload = { email, password };
      const response = await apiClient.post('/patient/login', payload);
      
      // Store user data in localStorage
      if (response.success && response.data) {
        const userData = {
          ...response.data,
          role: 'patient',
          token: response.token
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', 'patient');
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Doctor Authentication  
  async registerDoctor(userData) {
    try {
      const payload = {
        email: userData.email,
        password: userData.password,
        fullName: `${userData.firstName} ${userData.lastName}`.trim(),
        specialization: userData.specialization,
        licenseNumber: userData.licenseNumber,
        phoneNumber: userData.phone
      };

      const response = await apiClient.post('/doctor/register', payload);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async loginDoctor(email, password) {
    try {
      const payload = { email, password };
      const response = await apiClient.post('/doctor/login', payload);
      
      // Store user data in localStorage
      if (response.success && response.data) {
        const userData = {
          ...response.data,
          role: 'doctor',
          token: response.token
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', 'doctor');
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Common Methods
  async logout() {
    try {
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      
      // Note: The backend doesn't seem to have logout endpoints, 
      // but we clear the client-side data
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get user type
  getUserType() {
    return localStorage.getItem('userType');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const user = this.getCurrentUser();
    return user !== null;
  }

  // Check if user is a specific role
  isPatient() {
    return this.getUserType() === 'patient';
  }

  isDoctorService() {
    return this.getUserType() === 'doctor';
  }

  // Get user profile (calls appropriate API based on user type)
  async getUserProfile() {
    try {
      const userType = this.getUserType();
      if (!userType) {
        throw new Error('User not logged in');
      }

      const endpoint = userType === 'patient' ? '/patient/profile' : '/doctor/profile';
      const response = await apiClient.get(endpoint);
      
      // Update localStorage with fresh data
      if (response.success && response.data) {
        const currentUser = this.getCurrentUser();
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update user profile
  async updateUserProfile(profileData) {
    try {
      const userType = this.getUserType();
      if (!userType) {
        throw new Error('User not logged in');
      }

      const endpoint = userType === 'patient' ? '/patient/profile' : '/doctor/profile';
      const response = await apiClient.put(endpoint, profileData);
      
      // Update localStorage with fresh data
      if (response.success && response.data) {
        const currentUser = this.getCurrentUser();
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const authService = new AuthService();
export default authService;