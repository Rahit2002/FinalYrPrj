import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9191/api';

class ApiClient {
  constructor() {
    // Create axios instance
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // Include cookies in requests
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Transform response to match our expected format
        return {
          success: true,
          data: response.data.data || response.data,
          message: response.data.message,
          token: response.data.token,
        };
      },
      (error) => {
        console.error('API Error:', error);
        
        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const errorMessage = error.response.data?.message || 
                             error.response.data?.error || 
                             `HTTP error! status: ${error.response.status}`;
          throw new Error(errorMessage);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error('Network error - no response from server');
        } else {
          // Something else happened
          throw new Error(error.message || 'An unexpected error occurred');
        }
      }
    );
  }

  // GET request
  async get(endpoint, config = {}) {
    return this.client.get(endpoint, config);
  }

  // POST request
  async post(endpoint, data = {}, config = {}) {
    return this.client.post(endpoint, data, config);
  }

  // PUT request
  async put(endpoint, data = {}, config = {}) {
    return this.client.put(endpoint, data, config);
  }

  // DELETE request
  async delete(endpoint, config = {}) {
    return this.client.delete(endpoint, config);
  }

  // PATCH request
  async patch(endpoint, data = {}, config = {}) {
    return this.client.patch(endpoint, data, config);
  }
}

const apiClient = new ApiClient();
export default apiClient;