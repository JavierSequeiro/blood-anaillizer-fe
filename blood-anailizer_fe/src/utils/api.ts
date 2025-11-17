import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-69acea83`;

export interface ApiConfig {
  accessToken?: string;
}

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  config?: ApiConfig
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config?.accessToken || publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API request failed: ${response.statusText}`);
  }

  return data;
}

export const authApi = {
  signup: async (email: string, password: string, name: string, userType: string, language: string) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, userType, language }),
    });
  },

  signin: async (email: string, password: string) => {
    return apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

export const bloodTestApi = {
  create: async (testData: any, accessToken: string) => {
    return apiRequest('/blood-tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    }, { accessToken });
  },

  getAll: async (accessToken: string) => {
    return apiRequest('/blood-tests', {
      method: 'GET',
    }, { accessToken });
  },

  getById: async (testId: string, accessToken: string) => {
    return apiRequest(`/blood-tests/${testId}`, {
      method: 'GET',
    }, { accessToken });
  },
};

export const userApi = {
  getPreferences: async (accessToken: string) => {
    return apiRequest('/user/preferences', {
      method: 'GET',
    }, { accessToken });
  },
};