import { apiClient } from './apiClient';

export const fetchMenu = async (options = {}) => {
  try {
    const response = await fetch('/menu.json', options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data && data.success && data.data) {
      return data.data;
    }
    
    throw new Error('Unexpected response shape');
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    throw new Error('Network failure');
  }
};