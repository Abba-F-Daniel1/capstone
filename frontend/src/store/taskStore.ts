import { create } from 'zustand';
import { Task, TaskFilters, TaskStats } from '../types';
import { tasksApi } from '../services/api';
import toast from 'react-hot-toast';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  filters: TaskFilters;
  stats: TaskStats | null;
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  
  // Actions
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearCurrentTask: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  filters: {
    page: 1,
    limit: 20,
  },
  stats: null,
  isLoading: false,
  totalPages: 0,
  currentPage: 1,
  hasNext: false,
  hasPrev: false,

  fetchTasks: async (filters?: TaskFilters) => {
    set({ isLoading: true });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const response = await tasksApi.getTasks(currentFilters);
      const { data, pagination } = response.data;
      
      set({
        tasks: data,
        filters: currentFilters,
        totalPages: pagination.totalPages,
        currentPage: pagination.page,
        hasNext: pagination.hasNext,
        hasPrev: pagination.hasPrev,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to fetch tasks';
      toast.error(message);
    }
  },

  fetchTask: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await tasksApi.getTask(id);
      const task = response.data.data!;
      
      set({
        currentTask: task,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to fetch task';
      toast.error(message);
    }
  },

  createTask: async (data: Partial<Task>) => {
    set({ isLoading: true });
    try {
      const response = await tasksApi.createTask(data);
      const newTask = response.data.data!;
      
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }));
      
      toast.success('Task created successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to create task';
      toast.error(message);
      throw error;
    }
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    set({ isLoading: true });
    try {
      const response = await tasksApi.updateTask(id, data);
      const updatedTask = response.data.data!;
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? updatedTask : task
        ),
        currentTask: state.currentTask?.id === id ? updatedTask : state.currentTask,
        isLoading: false,
      }));
      
      toast.success('Task updated successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to update task';
      toast.error(message);
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true });
    try {
      await tasksApi.deleteTask(id);
      
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        currentTask: state.currentTask?.id === id ? null : state.currentTask,
        isLoading: false,
      }));
      
      toast.success('Task deleted successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to delete task';
      toast.error(message);
    }
  },

  fetchStats: async () => {
    try {
      const response = await tasksApi.getTaskStats();
      const stats = response.data.data!;
      
      set({ stats });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to fetch task stats';
      toast.error(message);
    }
  },

  setFilters: (filters: Partial<TaskFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearCurrentTask: () => {
    set({ currentTask: null });
  },
}));
