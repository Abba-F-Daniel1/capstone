import axios, { AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse, User, Task, Habit, HabitEntry, DashboardData, ProductivityAnalytics, TaskStats, HabitStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post('/auth/login', data),
  
  getMe: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get('/auth/me'),
  
  updateProfile: (data: { name?: string; avatar?: string }): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.put('/auth/profile', data),
};

// Tasks API
export const tasksApi = {
  getTasks: (params?: any): Promise<AxiosResponse<PaginatedResponse<Task>>> =>
    api.get('/tasks', { params }),
  
  getTask: (id: string): Promise<AxiosResponse<ApiResponse<Task>>> =>
    api.get(`/tasks/${id}`),
  
  createTask: (data: Partial<Task>): Promise<AxiosResponse<ApiResponse<Task>>> =>
    api.post('/tasks', data),
  
  updateTask: (id: string, data: Partial<Task>): Promise<AxiosResponse<ApiResponse<Task>>> =>
    api.put(`/tasks/${id}`, data),
  
  deleteTask: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/tasks/${id}`),
  
  getTaskStats: (): Promise<AxiosResponse<ApiResponse<TaskStats>>> =>
    api.get('/tasks/stats/overview'),
};

// Habits API
export const habitsApi = {
  getHabits: (params?: any): Promise<AxiosResponse<PaginatedResponse<Habit>>> =>
    api.get('/habits', { params }),
  
  getHabit: (id: string): Promise<AxiosResponse<ApiResponse<Habit>>> =>
    api.get(`/habits/${id}`),
  
  createHabit: (data: Partial<Habit>): Promise<AxiosResponse<ApiResponse<Habit>>> =>
    api.post('/habits', data),
  
  updateHabit: (id: string, data: Partial<Habit>): Promise<AxiosResponse<ApiResponse<Habit>>> =>
    api.put(`/habits/${id}`, data),
  
  deleteHabit: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/habits/${id}`),
  
  createHabitEntry: (habitId: string, data: { date: string; value?: number; notes?: string }): Promise<AxiosResponse<ApiResponse<HabitEntry>>> =>
    api.post(`/habits/${habitId}/entries`, data),
  
  getHabitEntries: (habitId: string, params?: any): Promise<AxiosResponse<ApiResponse<HabitEntry[]>>> =>
    api.get(`/habits/${habitId}/entries`, { params }),
  
  getHabitStats: (): Promise<AxiosResponse<ApiResponse<HabitStats>>> =>
    api.get('/habits/stats/overview'),
};

// Analytics API
export const analyticsApi = {
  getProductivity: (params?: any): Promise<AxiosResponse<ApiResponse<ProductivityAnalytics>>> =>
    api.get('/analytics/productivity', { params }),
  
  getDashboard: (): Promise<AxiosResponse<ApiResponse<DashboardData>>> =>
    api.get('/analytics/dashboard'),
};

export default api;
