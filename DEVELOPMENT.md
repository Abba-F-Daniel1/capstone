# TaskFlow Pro - Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- PostgreSQL 15+
- Git

### Setup
1. Clone the repository
2. Run the setup script: `./setup.sh`
3. Update environment variables in `backend/.env` and `frontend/.env`
4. Set up the database: `pnpm db:migrate`
5. Seed the database: `pnpm db:seed`
6. Start development: `pnpm dev`

## 📁 Project Structure

```
taskflow-pro/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript types
│   │   └── scripts/        # Database scripts
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── frontend/               # React TypeScript app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Zustand state management
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
├── docs/                   # Documentation
├── .github/                # GitHub Actions workflows
└── README.md
```

## 🛠️ Development Commands

### Root Level
- `pnpm dev` - Start both frontend and backend
- `pnpm build` - Build both applications
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm format` - Format all code

### Backend
- `pnpm --filter backend dev` - Start backend only
- `pnpm --filter backend build` - Build backend
- `pnpm --filter backend test` - Run backend tests
- `pnpm --filter backend db:migrate` - Run database migrations
- `pnpm --filter backend db:seed` - Seed database with sample data
- `pnpm --filter backend db:studio` - Open Prisma Studio

### Frontend
- `pnpm --filter frontend dev` - Start frontend only
- `pnpm --filter frontend build` - Build frontend
- `pnpm --filter frontend test` - Run frontend tests
- `pnpm --filter frontend preview` - Preview production build

## 🗄️ Database

### Schema
The database schema is defined in `backend/prisma/schema.prisma` using Prisma ORM.

### Key Models
- **User**: User accounts and authentication
- **Task**: Task management with status, priority, and due dates
- **Habit**: Habit tracking with frequency and target values
- **HabitEntry**: Daily habit completion records
- **AnalyticsEntry**: Productivity analytics and metrics

### Migrations
- Create migration: `pnpm --filter backend db:migrate`
- Reset database: `pnpm --filter backend db:reset`
- Generate Prisma client: `pnpm --filter backend db:generate`

## 🔧 API Development

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create habit
- `POST /api/habits/:id/entries` - Record habit entry
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/analytics/productivity` - Get productivity analytics

### Error Handling
All API responses follow a consistent format:
```json
{
  "success": true,
  "data": { ... },
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { ... }
  }
}
```

## 🎨 Frontend Development

### State Management
Uses Zustand for state management with separate stores:
- `authStore` - Authentication state
- `taskStore` - Task management
- `habitStore` - Habit tracking
- `analyticsStore` - Analytics data

### Styling
- Tailwind CSS for utility-first styling
- Custom component classes in `src/index.css`
- Responsive design with mobile-first approach

### Components
- Reusable UI components in `src/components/`
- Page components in `src/pages/`
- Custom hooks in `src/hooks/`

## 🧪 Testing

### Backend Tests
- Unit tests for utilities and middleware
- Integration tests for API endpoints
- Uses Vitest and Supertest

### Frontend Tests
- Component tests with React Testing Library
- Store tests for state management
- Uses Vitest and jsdom

### Running Tests
```bash
# All tests
pnpm test

# Backend tests only
pnpm --filter backend test

# Frontend tests only
pnpm --filter frontend test

# With coverage
pnpm --filter backend test:coverage
pnpm --filter frontend test:coverage
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Railway)
1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CORS_ORIGIN` - Allowed CORS origins
- `NODE_ENV` - Environment (development/production)

## 🔍 AI Integration

### Code Generation
- Use Cursor for component scaffolding
- Generate API routes with proper validation
- Create database models with Prisma

### Testing
- Generate test suites with AI assistance
- Create mock data and fixtures
- Write edge case scenarios

### Documentation
- AI-generated JSDoc comments
- API documentation with examples
- README and setup guides

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `pnpm test`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

**Database connection errors**
- Check PostgreSQL is running
- Verify DATABASE_URL in backend/.env
- Run `pnpm --filter backend db:migrate`

**Frontend build errors**
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Check TypeScript errors: `pnpm --filter frontend build`

**API authentication errors**
- Check JWT_SECRET is set in backend/.env
- Verify token is being sent in Authorization header

**Port conflicts**
- Backend runs on port 3001
- Frontend runs on port 3000
- Change ports in respective package.json files if needed

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
