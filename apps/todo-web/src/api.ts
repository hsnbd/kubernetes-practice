import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  category_id?: string;
  title: string;
  description: string;
  completed: boolean;
  due_date?: string;
  priority: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  tags?: Tag[];
  category?: Category;
}

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/login', data),
  getMe: () => api.get<User>('/auth/me'),
};

// Todos API
export const todosAPI = {
  getAll: (params?: { category_id?: string; completed?: boolean; search?: string; tag?: string }) =>
    api.get<Todo[]>('/todos', { params }),
  getShared: () => api.get<Todo[]>('/todos/shared'),
  getById: (id: string) => api.get<Todo>(`/todos/${id}`),
  create: (data: {
    title: string;
    description?: string;
    category_id?: string;
    due_date?: string;
    priority?: number;
    tags?: string[];
  }) => api.post<Todo>('/todos', data),
  update: (id: string, data: {
    title?: string;
    description?: string;
    category_id?: string;
    due_date?: string;
    priority?: number;
    tags?: string[];
  }) => api.put<Todo>(`/todos/${id}`, data),
  toggleComplete: (id: string) => api.patch<Todo>(`/todos/${id}/complete`),
  delete: (id: string) => api.delete(`/todos/${id}`),
  share: (id: string, data: { shared_with_email: string; can_edit: boolean }) =>
    api.post(`/todos/${id}/share`, data),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get<Category[]>('/categories'),
  create: (data: { name: string; color: string }) => api.post<Category>('/categories', data),
  update: (id: string, data: { name?: string; color?: string }) =>
    api.put<Category>(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Tags API
export const tagsAPI = {
  getAll: () => api.get<Tag[]>('/tags'),
  create: (data: { name: string }) => api.post<Tag>('/tags', data),
  delete: (id: string) => api.delete(`/tags/${id}`),
};
