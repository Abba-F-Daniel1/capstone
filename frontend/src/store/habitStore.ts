import { create } from 'zustand';
import { Habit, HabitFilters, HabitStats, HabitEntry } from '../types';
import { habitsApi } from '../services/api';
import toast from 'react-hot-toast';

interface HabitState {
  habits: Habit[];
  currentHabit: Habit | null;
  filters: HabitFilters;
  stats: HabitStats | null;
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  
  // Actions
  fetchHabits: (filters?: HabitFilters) => Promise<void>;
  fetchHabit: (id: string) => Promise<void>;
  createHabit: (data: Partial<Habit>) => Promise<void>;
  updateHabit: (id: string, data: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  createHabitEntry: (habitId: string, data: { date: string; value?: number; notes?: string }) => Promise<void>;
  fetchHabitEntries: (habitId: string, params?: any) => Promise<HabitEntry[]>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: Partial<HabitFilters>) => void;
  clearCurrentHabit: () => void;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  currentHabit: null,
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

  fetchHabits: async (filters?: HabitFilters) => {
    set({ isLoading: true });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const response = await habitsApi.getHabits(currentFilters);
      const { data, pagination } = response.data;
      
      set({
        habits: data,
        filters: currentFilters,
        totalPages: pagination.totalPages,
        currentPage: pagination.page,
        hasNext: pagination.hasNext,
        hasPrev: pagination.hasPrev,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to fetch habits';
      toast.error(message);
    }
  },

  fetchHabit: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await habitsApi.getHabit(id);
      const habit = response.data.data!;
      
      set({
        currentHabit: habit,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to fetch habit';
      toast.error(message);
    }
  },

  createHabit: async (data: Partial<Habit>) => {
    set({ isLoading: true });
    try {
      const response = await habitsApi.createHabit(data);
      const newHabit = response.data.data!;
      
      set((state) => ({
        habits: [newHabit, ...state.habits],
        isLoading: false,
      }));
      
      toast.success('Habit created successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to create habit';
      toast.error(message);
      throw error;
    }
  },

  updateHabit: async (id: string, data: Partial<Habit>) => {
    set({ isLoading: true });
    try {
      const response = await habitsApi.updateHabit(id, data);
      const updatedHabit = response.data.data!;
      
      set((state) => ({
        habits: state.habits.map((habit) =>
          habit.id === id ? updatedHabit : habit
        ),
        currentHabit: state.currentHabit?.id === id ? updatedHabit : state.currentHabit,
        isLoading: false,
      }));
      
      toast.success('Habit updated successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to update habit';
      toast.error(message);
      throw error;
    }
  },

  deleteHabit: async (id: string) => {
    set({ isLoading: true });
    try {
      await habitsApi.deleteHabit(id);
      
      set((state) => ({
        habits: state.habits.filter((habit) => habit.id !== id),
        currentHabit: state.currentHabit?.id === id ? null : state.currentHabit,
        isLoading: false,
      }));
      
      toast.success('Habit deleted successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to delete habit';
      toast.error(message);
    }
  },

  createHabitEntry: async (habitId: string, data: { date: string; value?: number; notes?: string }) => {
    try {
      const response = await habitsApi.createHabitEntry(habitId, data);
      const newEntry = response.data.data!;
      
      set((state) => ({
        habits: state.habits.map((habit) =>
          habit.id === habitId
            ? {
                ...habit,
                entries: [newEntry, ...(habit.entries || [])],
              }
            : habit
        ),
        currentHabit: state.currentHabit?.id === habitId
          ? {
              ...state.currentHabit,
              entries: [newEntry, ...(state.currentHabit.entries || [])],
            }
          : state.currentHabit,
      }));
      
      toast.success('Habit entry recorded successfully');
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to record habit entry';
      toast.error(message);
      throw error;
    }
  },

  fetchHabitEntries: async (habitId: string, params?: any) => {
    try {
      const response = await habitsApi.getHabitEntries(habitId, params);
      return response.data.data!;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to fetch habit entries';
      toast.error(message);
      return [];
    }
  },

  fetchStats: async () => {
    try {
      const response = await habitsApi.getHabitStats();
      const stats = response.data.data!;
      
      set({ stats });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to fetch habit stats';
      toast.error(message);
    }
  },

  setFilters: (filters: Partial<HabitFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearCurrentHabit: () => {
    set({ currentHabit: null });
  },
}));
