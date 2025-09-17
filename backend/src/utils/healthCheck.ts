import { prisma } from './database';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  environment: string;
  database: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: number;
}

export const performHealthCheck = async (): Promise<HealthCheckResult> => {
  const startTime = Date.now();
  
  // Check database connection
  let dbStatus: 'connected' | 'disconnected' = 'disconnected';
  let dbResponseTime: number | undefined;
  
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbResponseTime = Date.now() - dbStart;
    dbStatus = 'connected';
  } catch (error) {
    console.error('Database health check failed:', error);
  }
  
  // Get memory usage
  const memUsage = process.memoryUsage();
  const totalMemory = memUsage.heapTotal + memUsage.external;
  const usedMemory = memUsage.heapUsed;
  const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);
  
  const isHealthy = dbStatus === 'connected';
  
  return {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      responseTime: dbResponseTime,
    },
    memory: {
      used: Math.round(usedMemory / 1024 / 1024), // MB
      total: Math.round(totalMemory / 1024 / 1024), // MB
      percentage: memoryPercentage,
    },
    uptime: Math.round(process.uptime()),
  };
};
