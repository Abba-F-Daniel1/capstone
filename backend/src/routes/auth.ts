import { Router } from 'express';
import { registerSchema, loginSchema } from '../utils/validation';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';
import { prisma } from '../utils/database';
import { sendSuccess, sendError, handleAsync } from '../utils/response';
import { authenticate } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', handleAsync(async (req, res) => {
  const { email, password, name } = registerSchema.parse(req.body);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    sendError(res, 409, 'CONFLICT', 'User with this email already exists');
    return;
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  sendSuccess(res, {
    user,
    token,
  }, 'User registered successfully');
}));

// Login
router.post('/login', handleAsync(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    sendError(res, 401, 'UNAUTHORIZED', 'Invalid email or password');
    return;
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    sendError(res, 401, 'UNAUTHORIZED', 'Invalid email or password');
    return;
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;

  sendSuccess(res, {
    user: userWithoutPassword,
    token,
  }, 'Login successful');
}));

// Get current user
router.get('/me', authenticate, handleAsync(async (req, res) => {
  sendSuccess(res, req.user, 'User data retrieved successfully');
}));

// Update user profile
router.put('/profile', authenticate, handleAsync(async (req, res) => {
  const { name, avatar } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...(name && { name }),
      ...(avatar && { avatar }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  sendSuccess(res, updatedUser, 'Profile updated successfully');
}));

export default router;
