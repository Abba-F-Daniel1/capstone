import { Router } from 'express';
import { createHabitSchema, updateHabitSchema, createHabitEntrySchema, paginationSchema, habitFiltersSchema } from '../utils/validation';
import { prisma } from '../utils/database';
import { sendSuccess, sendError, sendPaginated, handleAsync } from '../utils/response';
import { authenticate } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all habits with pagination and filters
router.get('/', handleAsync(async (req: AuthenticatedRequest, res) => {
  const { page = 1, limit = 20 } = paginationSchema.parse(req.query);
  const filters = habitFiltersSchema.parse(req.query);

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    userId: req.user!.id,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.frequency) {
    where.frequency = filters.frequency;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // Get habits and total count
  const [habits, total] = await Promise.all([
    prisma.habit.findMany({
      where,
      skip,
      take: limit,
      include: {
        entries: {
          orderBy: { date: 'desc' },
          take: 7, // Last 7 entries
        },
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.habit.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendPaginated(res, habits, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}));

// Get habit by ID
router.get('/:id', handleAsync(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const habit = await prisma.habit.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
    include: {
      entries: {
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!habit) {
    sendError(res, 404, 'NOT_FOUND', 'Habit not found');
    return;
  }

  sendSuccess(res, habit, 'Habit retrieved successfully');
}));

// Create new habit
router.post('/', handleAsync(async (req: AuthenticatedRequest, res) => {
  const data = createHabitSchema.parse(req.body);

  const habit = await prisma.habit.create({
    data: {
      ...data,
      userId: req.user!.id,
    },
  });

  sendSuccess(res, habit, 'Habit created successfully');
}));

// Update habit
router.put('/:id', handleAsync(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const data = updateHabitSchema.parse(req.body);

  // Check if habit exists and belongs to user
  const existingHabit = await prisma.habit.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!existingHabit) {
    sendError(res, 404, 'NOT_FOUND', 'Habit not found');
    return;
  }

  const habit = await prisma.habit.update({
    where: { id },
    data,
  });

  sendSuccess(res, habit, 'Habit updated successfully');
}));

// Delete habit
router.delete('/:id', handleAsync(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  // Check if habit exists and belongs to user
  const habit = await prisma.habit.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!habit) {
    sendError(res, 404, 'NOT_FOUND', 'Habit not found');
    return;
  }

  await prisma.habit.delete({
    where: { id },
  });

  sendSuccess(res, null, 'Habit deleted successfully');
}));

// Create habit entry
router.post('/:id/entries', handleAsync(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const data = createHabitEntrySchema.parse(req.body);

  // Check if habit exists and belongs to user
  const habit = await prisma.habit.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!habit) {
    sendError(res, 404, 'NOT_FOUND', 'Habit not found');
    return;
  }

  // Create or update entry
  const entry = await prisma.habitEntry.upsert({
    where: {
      habitId_date: {
        habitId: id,
        date: new Date(data.date),
      },
    },
    update: {
      value: data.value,
      notes: data.notes,
    },
    create: {
      habitId: id,
      date: new Date(data.date),
      value: data.value,
      notes: data.notes,
    },
  });

  sendSuccess(res, entry, 'Habit entry created successfully');
}));

// Get habit entries
router.get('/:id/entries', handleAsync(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;

  // Check if habit exists and belongs to user
  const habit = await prisma.habit.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!habit) {
    sendError(res, 404, 'NOT_FOUND', 'Habit not found');
    return;
  }

  // Build where clause for entries
  const where: any = { habitId: id };

  if (startDate) {
    where.date = { ...where.date, gte: new Date(startDate as string) };
  }

  if (endDate) {
    where.date = { ...where.date, lte: new Date(endDate as string) };
  }

  const entries = await prisma.habitEntry.findMany({
    where,
    orderBy: { date: 'desc' },
  });

  sendSuccess(res, entries, 'Habit entries retrieved successfully');
}));

// Get habit statistics
router.get('/stats/overview', handleAsync(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;

  const [
    totalHabits,
    activeHabits,
    completedHabits,
    totalEntries,
    todayEntries,
  ] = await Promise.all([
    prisma.habit.count({ where: { userId } }),
    prisma.habit.count({ where: { userId, status: 'ACTIVE' } }),
    prisma.habit.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.habitEntry.count({
      where: {
        habit: { userId },
      },
    }),
    prisma.habitEntry.count({
      where: {
        habit: { userId },
        date: new Date(),
      },
    }),
  ]);

  sendSuccess(res, {
    totalHabits,
    activeHabits,
    completedHabits,
    totalEntries,
    todayEntries,
  }, 'Habit statistics retrieved successfully');
}));

export default router;
