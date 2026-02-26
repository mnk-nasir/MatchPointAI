import axios, { AxiosError, AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_API_URL as string | undefined;
if (!baseURL) {
  throw new Error('VITE_API_URL is not defined. Set it in your environment.');
}

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data: any = error.response?.data;
    const normalized = {
      status,
      message:
        (data && (data.detail || data.message)) ||
        error.message ||
        'Network Error',
      details: data || null,
    };
    return Promise.reject(normalized);
  }
);

export default api;

