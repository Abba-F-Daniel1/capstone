import { create } from 'zustand';
import { DashboardData, ProductivityAnalytics, AnalyticsFilters } from '../types';
import { analyticsApi } from '../services/api';
import toast from 'react-hot-toast';

interface AnalyticsState {
  dashboardData: DashboardData | null;
  productivityData: ProductivityAnalytics | null;
  filters: AnalyticsFilters;
  isLoading: boolean;
  
  // Actions
  fetchDashboard: () => Promise<void>;
  fetchProductivity: (filters?: AnalyticsFilters) => Promise<void>;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  dashboardData: null,
  productivityData: null,
  filters: {
    period: 'month',
  },
  isLoading: false,

  fetchDashboard: async () => {
    set({ isLoading: true });
    try {
      const response = await analyticsApi.getDashboard();
      const dashboardData = response.data.data!;
      
      set({
        dashboardData,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to fetch dashboard data';
      toast.error(message);
    }
  },

  fetchProductivity: async (filters?: AnalyticsFilters) => {
    set({ isLoading: true });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const response = await analyticsApi.getProductivity(currentFilters);
      const productivityData = response.data.data!;
      
      set({
        productivityData,
        filters: currentFilters,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.error?.message || 'Failed to fetch productivity data';
      toast.error(message);
    }
  },

  setFilters: (filters: Partial<AnalyticsFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },
}));
