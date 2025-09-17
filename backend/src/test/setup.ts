import { beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from '../utils/database';

// Clean up database before each test
beforeEach(async () => {
  // Clean up in order to avoid foreign key constraints
  await prisma.habitEntry.deleteMany();
  await prisma.analyticsEntry.deleteMany();
  await prisma.task.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.user.deleteMany();
});

// Close database connection after all tests
afterAll(async () => {
  await prisma.$disconnect();
});
