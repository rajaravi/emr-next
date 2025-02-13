// src/utils/services/httpService.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Base URL for your API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://140.245.29.170/backend/public/api';
let token = null;
if (typeof window !== 'undefined') {
  token = localStorage.getItem('authKey');
}
// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': (token) ? 'Bearer '+token+'' : '',
  },
});

// Handle the API response
const handleResponse = (response: AxiosResponse) => {
  if (response.status === 200 || response.status === 201) {
    return response.data;
  }
  throw new Error(`Unexpected response code: ${response.status}`);
};

// Handle the API error
const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    // Handle Axios errors
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error('API error response:', error.response);
      throw new Error(error.response.data.message || 'An error occurred while processing your request.');
    } else if (error.request) {
      // Request was made but no response received
      console.error('API no response:', error.request);
      throw new Error('No response received from the server. Please try again later.');
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('API request setup error:', error.message);
      throw new Error(error.message);
    }
  } else {
    // Handle non-Axios errors
    console.error('API unknown error:', error);
    throw new Error('An unknown error occurred. Please try again later.');
  }
};

// Execute a GET request
export const execute_axios_get = async (url: string, config?: AxiosRequestConfig): Promise<any> => {
  try {
    const response = await axiosInstance.get(url, config);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Execute a POST request
export const execute_axios_post = async (url: string, data: any, config?: AxiosRequestConfig): Promise<any> => {
  try {
    const response = await axiosInstance.post(url, data, config);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Add more HTTP methods as needed, such as PUT, DELETE, etc.
