import { apiClient } from './apiClient';

export const fetchMenu = async (options = {}) => {
  try {
    const data = await apiClient('/menu', options);
    
    if (data && data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Unexpected response shape');
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    if (error.message === 'Unexpected response shape') {
      throw error;
    }
    // Forward rate limit error message
    if (error.message && error.message.includes('Too many requests')) {
      throw error;
    }
    throw new Error('Network failure');
  }
};