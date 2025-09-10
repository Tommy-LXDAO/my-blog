export const getApiBaseUrl = () => {
  return "http://127.0.0.1:8080/api";
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};