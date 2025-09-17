import { Router } from 'express';
import { analyticsFiltersSchema } from '../utils/validation';
import { prisma } from '../utils/database';
import { sendSuccess, sendError, handleAsync } from '../utils/response';
import { authenticate } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Get productivity analytics
router.get('/productivity', handleAsync(async (req: AuthenticatedRequest, res) => {
  const filters = analyticsFiltersSchema.parse(req.query);
  const userId = req.user!.id;

  let startDate: Date;
  let endDate: Date = new Date();

  // Calculate date range based on period or custom dates
  if (filters.startDate && filters.endDate) {
    startDate = new Date(filters.startDate);
    endDate = new Date(filters.endDate);
  } else {
    const period = filters.period || 'month';
    startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
  }

  // Get task analytics
  const taskStats = await prisma.task.groupBy({
    by: ['status'],
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: true,
  });

  // Get habit analytics
  const habitStats = await prisma.habitEntry.groupBy({
    by: ['date'],
    where: {
      habit: { userId },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: true,
    orderBy: { date: 'asc' },
  });

  // Get daily task completion trends
  const dailyTaskTrends = await prisma.task.groupBy({
    by: ['createdAt'],
    where: {
      userId,
      status: 'COMPLETED',
      completedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: true,
    orderBy: { createdAt: 'asc' },
  });

  // Calculate productivity score
  const totalTasks = taskStats.reduce((sum, stat) => sum + stat._count, 0);
  const completedTasks = taskStats.find(stat => stat.status === 'COMPLETED')?._count || 0;
  const totalHabitEntries = habitStats.reduce((sum, stat) => sum + stat._count, 0);
  
  // Simple productivity score calculation
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const habitConsistencyRate = Math.min((totalHabitEntries / Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))) * 100, 100);
  const productivityScore = (taskCompletionRate + habitConsistencyRate) / 2;

  // Get analytics entries for the period
  const analyticsEntries = await prisma.analyticsEntry.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: 'asc' },
  });

  // Format trends data
  const trends = {
    tasksCompleted: dailyTaskTrends.map(trend => ({
      date: trend.createdAt.toISOString().split('T')[0],
      count: trend._count,
    })),
    habitsCompleted: habitStats.map(stat => ({
      date: stat.date.toISOString().split('T')[0],
      count: stat._count,
    })),
  };

  sendSuccess(res, {
    period: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    },
    summary: {
      tasksCompleted: completedTasks,
      totalTasks,
      habitsTracked: totalHabitEntries,
      productivityScore: Math.round(productivityScore * 100) / 100,
    },
    trends,
    analyticsEntries,
  }, 'Productivity analytics retrieved successfully');
}));

// Get dashboard overview
router.get('/dashboard', handleAsync(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Get today's stats
  const [
    todayTasks,
    todayHabits,
    weekTasks,
    weekHabits,
    monthTasks,
    monthHabits,
    recentTasks,
    recentHabits,
  ] = await Promise.all([
    // Today's completed tasks
    prisma.task.count({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        },
      },
    }),
    // Today's habit entries
    prisma.habitEntry.count({
      where: {
        habit: { userId },
        date: today,
      },
    }),
    // This week's completed tasks
    prisma.task.count({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: startOfWeek },
      },
    }),
    // This week's habit entries
    prisma.habitEntry.count({
      where: {
        habit: { userId },
        date: { gte: startOfWeek },
      },
    }),
    // This month's completed tasks
    prisma.task.count({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: startOfMonth },
      },
    }),
    // This month's habit entries
    prisma.habitEntry.count({
      where: {
        habit: { userId },
        date: { gte: startOfMonth },
      },
    }),
    // Recent tasks
    prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    // Recent habits
    prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  // Calculate streaks (simplified)
  const taskStreak = await calculateStreak(userId, 'task');
  const habitStreak = await calculateStreak(userId, 'habit');

  sendSuccess(res, {
    today: {
      tasksCompleted: todayTasks,
      habitsCompleted: todayHabits,
    },
    thisWeek: {
      tasksCompleted: weekTasks,
      habitsCompleted: weekHabits,
    },
    thisMonth: {
      tasksCompleted: monthTasks,
      habitsCompleted: monthHabits,
    },
    streaks: {
      taskStreak,
      habitStreak,
    },
    recent: {
      tasks: recentTasks,
      habits: recentHabits,
    },
  }, 'Dashboard data retrieved successfully');
}));

// Helper function to calculate streaks
async function calculateStreak(userId: string, type: 'task' | 'habit'): Promise<number> {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    let hasActivity = false;

    if (type === 'task') {
      const taskCount = await prisma.task.count({
        where: {
          userId,
          status: 'COMPLETED',
          completedAt: {
            gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
            lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
          },
        },
      });
      hasActivity = taskCount > 0;
    } else {
      const habitCount = await prisma.habitEntry.count({
        where: {
          habit: { userId },
          date: currentDate,
        },
      });
      hasActivity = habitCount > 0;
    }

    if (hasActivity) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }

    // Prevent infinite loop
    if (streak > 365) break;
  }

  return streak;
}

export default router;
