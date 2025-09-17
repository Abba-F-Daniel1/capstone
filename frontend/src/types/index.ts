export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  completedAt?: string;
  category?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  targetValue?: number;
  unit?: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  entries?: HabitEntry[];
  _count?: {
    entries: number;
  };
}

export interface HabitEntry {
  id: string;
  date: string;
  value?: number;
  notes?: string;
  createdAt: string;
}

export interface AnalyticsEntry {
  id: string;
  date: string;
  tasksCompleted: number;
  habitsCompleted: number;
  productivityScore?: number;
  timeSpent?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface HabitFilters {
  status?: string;
  frequency?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AnalyticsFilters {
  period?: 'week' | 'month' | 'quarter' | 'year';
  startDate?: string;
  endDate?: string;
}

export interface DashboardData {
  today: {
    tasksCompleted: number;
    habitsCompleted: number;
  };
  thisWeek: {
    tasksCompleted: number;
    habitsCompleted: number;
  };
  thisMonth: {
    tasksCompleted: number;
    habitsCompleted: number;
  };
  streaks: {
    taskStreak: number;
    habitStreak: number;
  };
  recent: {
    tasks: Task[];
    habits: Habit[];
  };
}

export interface ProductivityAnalytics {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    tasksCompleted: number;
    totalTasks: number;
    habitsTracked: number;
    productivityScore: number;
  };
  trends: {
    tasksCompleted: Array<{
      date: string;
      count: number;
    }>;
    habitsCompleted: Array<{
      date: string;
      count: number;
    }>;
  };
  analyticsEntries: AnalyticsEntry[];
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  completedHabits: number;
  totalEntries: number;
  todayEntries: number;
}
