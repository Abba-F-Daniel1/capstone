import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const hashedPassword = await hashPassword('demo123');
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@taskflow.com' },
    update: {},
    create: {
      email: 'demo@taskflow.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create sample tasks
  const tasks = [
    {
      title: 'Complete project proposal',
      description: 'Write and submit the Q1 project proposal for the new feature',
      priority: 'HIGH' as const,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      category: 'Work',
      tags: ['work', 'proposal', 'deadline'],
    },
    {
      title: 'Review team performance',
      description: 'Analyze Q4 performance metrics and prepare feedback',
      priority: 'MEDIUM' as const,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      category: 'Work',
      tags: ['work', 'review', 'team'],
    },
    {
      title: 'Plan weekend trip',
      description: 'Research destinations and book accommodations',
      priority: 'LOW' as const,
      category: 'Personal',
      tags: ['personal', 'travel', 'planning'],
    },
    {
      title: 'Update resume',
      description: 'Add recent projects and achievements to resume',
      priority: 'MEDIUM' as const,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      category: 'Career',
      tags: ['career', 'resume', 'update'],
    },
    {
      title: 'Learn TypeScript',
      description: 'Complete online TypeScript course and practice exercises',
      priority: 'HIGH' as const,
      category: 'Learning',
      tags: ['learning', 'typescript', 'programming'],
    },
  ];

  for (const taskData of tasks) {
    const task = await prisma.task.create({
      data: {
        ...taskData,
        userId: user.id,
      },
    });
    console.log('✅ Created task:', task.title);
  }

  // Create sample habits
  const habits = [
    {
      name: 'Daily Exercise',
      description: '30 minutes of physical activity',
      frequency: 'DAILY' as const,
      targetValue: 30,
      unit: 'minutes',
    },
    {
      name: 'Read Books',
      description: 'Read at least 20 pages daily',
      frequency: 'DAILY' as const,
      targetValue: 20,
      unit: 'pages',
    },
    {
      name: 'Meditation',
      description: '10 minutes of mindfulness practice',
      frequency: 'DAILY' as const,
      targetValue: 10,
      unit: 'minutes',
    },
    {
      name: 'Weekly Review',
      description: 'Review goals and plan for next week',
      frequency: 'WEEKLY' as const,
      targetValue: 1,
      unit: 'session',
    },
  ];

  for (const habitData of habits) {
    const habit = await prisma.habit.create({
      data: {
        ...habitData,
        userId: user.id,
      },
    });
    console.log('✅ Created habit:', habit.name);
  }

  // Create sample habit entries for the last 7 days
  const habitsList = await prisma.habit.findMany({
    where: { userId: user.id },
  });

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    for (const habit of habitsList) {
      // Randomly create entries (70% chance)
      if (Math.random() > 0.3) {
        await prisma.habitEntry.create({
          data: {
            habitId: habit.id,
            date,
            value: habit.targetValue || 1,
            notes: i === 0 ? 'Great session today!' : undefined,
          },
        });
      }
    }
  }

  console.log('✅ Created habit entries for the last 7 days');

  // Create sample analytics entries
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const tasksCompleted = Math.floor(Math.random() * 5);
    const habitsCompleted = Math.floor(Math.random() * 4);
    const productivityScore = Math.min(100, (tasksCompleted * 20) + (habitsCompleted * 15) + Math.random() * 20);

    await prisma.analyticsEntry.create({
      data: {
        userId: user.id,
        date,
        tasksCompleted,
        habitsCompleted,
        productivityScore,
        timeSpent: Math.floor(Math.random() * 480) + 120, // 2-10 hours
      },
    });
  }

  console.log('✅ Created analytics entries for the last 30 days');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Demo Account:');
  console.log('Email: demo@taskflow.com');
  console.log('Password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
