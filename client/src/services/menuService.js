import { apiClient } from './apiClient';

export const fetchMenu = async () => {
  try {
    const data = await apiClient('/menu');
    
    if (data && data.success && data.data) {
      return data.data; // This is the menu structure
    }
    
    throw new Error('Unexpected response shape');
  } catch (error) {
    if (error.message === 'Unexpected response shape') {
      throw error;
    }
    throw new Error('Network failure');
  }
};