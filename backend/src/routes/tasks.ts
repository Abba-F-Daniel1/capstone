import { Router } from 'express';
import { createTaskSchema, updateTaskSchema, paginationSchema, taskFiltersSchema } from '../utils/validation';
import { prisma } from '../utils/database';
import { sendSuccess, sendError, sendPaginated, handleAsync } from '../utils/response';
import { authenticate } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all tasks with pagination and filters
router.get('/', handleAsync(async (req: AuthenticatedRequest, res) => {
  const { page = 1, limit = 20 } = paginationSchema.parse(req.query);
  const filters = taskFiltersSchema.parse(req.query);

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    userId: req.user!.id,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // Get tasks and total count
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    }),
    prisma.task.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendPaginated(res, tasks, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}));

// Get task by ID
router.get('/:id', handleAsync(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const task = await prisma.task.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!task) {
    sendError(res, 404, 'NOT_FOUND', 'Task not found');
    return;
  }

  sendSuccess(res, task, 'Task retrieved successfully');
}));

// Create new task
router.post('/', handleAsync(async (req: AuthenticatedRequest, res) => {
  const data = createTaskSchema.parse(req.body);

  const task = await prisma.task.create({
    data: {
      ...data,
      userId: req.user!.id,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });

  sendSuccess(res, task, 'Task created successfully');
}));

// Update task
router.put('/:id', handleAsync(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const data = updateTaskSchema.parse(req.body);

  // Check if task exists and belongs to user
  const existingTask = await prisma.task.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!existingTask) {
    sendError(res, 404, 'NOT_FOUND', 'Task not found');
    return;
  }

  // Update task
  const updateData: any = { ...data };
  if (data.dueDate) {
    updateData.dueDate = new Date(data.dueDate);
  }

  // Set completedAt if status is being changed to COMPLETED
  if (data.status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
    updateData.completedAt = new Date();
  } else if (data.status !== 'COMPLETED' && existingTask.status === 'COMPLETED') {
    updateData.completedAt = null;
  }

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
  });

  sendSuccess(res, task, 'Task updated successfully');
}));

// Delete task
router.delete('/:id', handleAsync(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  // Check if task exists and belongs to user
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!task) {
    sendError(res, 404, 'NOT_FOUND', 'Task not found');
    return;
  }

  await prisma.task.delete({
    where: { id },
  });

  sendSuccess(res, null, 'Task deleted successfully');
}));

// Get task statistics
router.get('/stats/overview', handleAsync(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;

  const [
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    overdueTasks,
  ] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.task.count({ where: { userId, status: 'PENDING' } }),
    prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
    prisma.task.count({
      where: {
        userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { lt: new Date() },
      },
    }),
  ]);

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  sendSuccess(res, {
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    overdueTasks,
    completionRate: Math.round(completionRate * 100) / 100,
  }, 'Task statistics retrieved successfully');
}));

export default router;
