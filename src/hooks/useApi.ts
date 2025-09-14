import { getApiBaseUrl } from '../lib/config';
import { useCallback } from 'react';

export const useApi = () => {
  const fetchApi = useCallback(async (path: string, options: RequestInit = {}) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${path}`;
    
    // 获取存储在localStorage中的token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };
    
    // 如果有token，并且不是登录或获取公钥的请求，则在请求头中添加Authorization头
    if (token && path !== '/auth/login' && path !== '/auth/rsa_public_key') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      return await response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }, []);
  
  return { fetchApi };
};
