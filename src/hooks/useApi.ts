import { getApiBaseUrl } from '../lib/config';

export const useApi = () => {
  const fetchApi = async (path, options = {}) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${path}`;
    
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
      
      return await response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };
  
  return { fetchApi };
};