import { apiClient } from './apiClient.js';

export const fetchStatus = async () => {
  try {
    const data = await apiClient('/status');
    if (data && data.success && data.data && data.data.status === 'ok') {
      return { success: true, message: data.message };
    }
    throw new Error('Unexpected response shape');
  } catch {
    throw new Error('Backend unavailable');
  }
};
