const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error('Invalid JSON response from server');
    }
    throw error;
  }
};
