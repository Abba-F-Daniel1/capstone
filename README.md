# 🚀 TaskFlow Pro - Personal Productivity Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 🔖 Project Title & Description

**TaskFlow Pro** is a comprehensive, full-stack personal productivity dashboard that combines intelligent task management, habit tracking, and productivity analytics. This production-ready application is designed for individuals who want to optimize their daily workflow, track progress on personal goals, and gain insights into their productivity patterns.

### Who It's For
- Busy professionals seeking better work-life balance
- Students managing multiple projects and deadlines
- Entrepreneurs tracking business and personal goals
- Anyone looking to build better habits and increase productivity

### Why It Matters
In today's fast-paced world, effective task management and habit formation are crucial for personal and professional success. TaskFlow Pro addresses the common pain points of scattered productivity tools by providing a unified platform that not only helps users organize their tasks but also provides actionable insights to improve their productivity over time.

### ✨ Key Features
- **Smart Task Management**: Complete CRUD operations with priority levels and due dates
- **Habit Tracking**: Visual progress tracking for daily, weekly, and monthly habits
- **Productivity Analytics**: Data-driven insights with interactive charts and trends
- **Real-time Dashboard**: Comprehensive overview with statistics and recent activity
- **User Authentication**: Secure JWT-based authentication with profile management
- **Responsive Design**: Mobile-first design that works on all devices
- **Data Persistence**: PostgreSQL database with Prisma ORM
- **API-First Architecture**: RESTful API with comprehensive error handling

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for lightweight state management
- **Routing**: React Router v6 with protected routes
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **UI Components**: Custom components with accessibility features

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with strict mode
- **Authentication**: JWT with bcrypt password hashing
- **API**: RESTful API with comprehensive error handling
- **Validation**: Zod for schema validation
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Morgan for request logging
- **Compression**: Gzip compression
- **Health Monitoring**: Comprehensive health check endpoint

### Database
- **Primary**: PostgreSQL with Prisma ORM
- **Schema**: Well-designed relational database with proper constraints
- **Migrations**: Prisma migrations for schema management
- **Seeding**: Sample data for development and testing

### Development & Deployment
- **Package Manager**: pnpm with workspaces
- **Build Tools**: Vite (frontend), TypeScript compiler (backend)
- **Testing**: Vitest + React Testing Library + Supertest
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier for code formatting
- **CI/CD**: GitHub Actions workflows
- **Deployment**: Vercel (frontend) + Railway (backend + database)
- **Environment**: Comprehensive environment configuration

### AI Integration Tools
- **Primary IDE**: Cursor with AI code completion
- **Code Review**: CodeRabbit for automated PR reviews
- **Documentation**: AI-generated API docs and inline comments

## 🧠 AI Integration Strategy

### 🧱 Code or Feature Generation

**Component Scaffolding with Cursor**
- Use Cursor's AI to generate React components with proper TypeScript interfaces
- Prompt: "Generate a TaskCard component with props for title, priority, dueDate, and status. Include proper TypeScript types and Tailwind styling."
- Create reusable UI components using AI-generated code with consistent design patterns

**API Route Generation**
- Generate Express.js routes with proper error handling and validation
- Prompt: "Create a REST API endpoint for updating task status with Prisma ORM, Zod validation, and proper error handling"
- Use AI to scaffold database models and relationships in Prisma schema

**Database Schema Design**
- AI-assisted Prisma schema generation based on feature requirements
- Prompt: "Design a Prisma schema for a task management system with users, tasks, habits, and analytics tables"

### 🧪 Testing Support

**Unit Test Generation**
- Generate comprehensive test suites for React components
- Prompt: "Create unit tests for the TaskForm component covering form validation, submission, and error states using React Testing Library"
- AI-generated integration tests for API endpoints
- Prompt: "Generate integration tests for the task CRUD operations using Supertest, including authentication and authorization"

**Test Data Generation**
- Use AI to create realistic test fixtures and mock data
- Generate edge case scenarios for testing error handling

### 📡 Schema-Aware or API-Aware Generation

**OpenAPI Specification Integration**
- Generate API client code from OpenAPI specs using AI
- Prompt: "Generate TypeScript client code from this OpenAPI specification for the task management API"
- Create API documentation with examples using AI
- Auto-generate request/response types from database schemas

**Database-Aware Code Generation**
- Generate Prisma queries and mutations based on schema relationships
- Prompt: "Create a Prisma query to fetch user tasks with related habits and analytics data, including proper pagination"
- AI-assisted database migration scripts

### 📚 Documentation & Context-Aware Techniques

**Inline Documentation**
- AI-generated JSDoc comments for complex functions
- Prompt: "Add comprehensive JSDoc documentation to this analytics calculation function, including parameter descriptions and return value examples"
- Auto-generate README sections for new features

**Context-Aware Development**
- Feed file trees and current codebase context to AI for better suggestions
- Use git diffs to generate meaningful commit messages
- AI-assisted code refactoring with full context understanding

## 🛠️ Plan for In-Editor/PR Review Tooling

### Primary Tool: Cursor
- **Code Completion**: Advanced AI-powered autocomplete for TypeScript, React, and Node.js
- **Code Generation**: Generate entire functions and components from natural language descriptions
- **Refactoring**: AI-assisted code improvements and optimizations
- **Debugging**: AI-powered error analysis and solution suggestions

### Code Review: CodeRabbit
- **Automated PR Reviews**: AI-generated code review comments focusing on:
  - Code quality and best practices
  - Security vulnerabilities
  - Performance optimizations
  - TypeScript type safety
- **Commit Message Generation**: AI-generated conventional commit messages
- **Documentation Updates**: Automatic detection of code changes requiring documentation updates

### Workflow Integration
- **Pre-commit Hooks**: AI-powered linting and formatting
- **PR Templates**: AI-generated PR descriptions with change summaries
- **Release Notes**: Automated changelog generation from commit history

## 📝 Sample Prompts

### Code Generation Prompt
```
Generate a React component called HabitTracker that displays a weekly calendar grid. 
Each day should show habit completion status with a checkbox. Include:
- TypeScript interfaces for habit data
- Tailwind CSS styling with hover effects
- Props for habits array and onToggle callback
- Accessibility features (ARIA labels, keyboard navigation)
- Responsive design for mobile devices
```

### Testing Prompt
```
Create a comprehensive test suite for the TaskPriorityCalculator utility function.
The function takes a task object with dueDate, importance, and urgency properties.
Tests should cover:
- Normal priority calculation scenarios
- Edge cases (past due dates, null values)
- Boundary conditions (same day, far future dates)
- Integration with the priority enum values
Use Vitest and include proper test descriptions and assertions.
```

## 🗂️ Project Structure

```
taskflow-pro/
├── frontend/                 # React TypeScript app
│   ├── src/
│   │   ├── components/      # Reusable UI components (Button, Input, Card, etc.)
│   │   ├── pages/          # Route components (Dashboard, Tasks, Habits, etc.)
│   │   ├── hooks/          # Custom React hooks (useLocalStorage, useDebounce)
│   │   ├── store/          # Zustand state management (auth, tasks, habits, analytics)
│   │   ├── services/       # API services with Axios
│   │   ├── utils/          # Utility functions (date formatting, color helpers)
│   │   ├── types/          # TypeScript type definitions
│   │   └── test/           # Test setup and configuration
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies and scripts
│   ├── vite.config.ts      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vitest.config.ts    # Test configuration
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/         # API route handlers (auth, tasks, habits, analytics)
│   │   ├── middleware/     # Express middleware (auth, error handling)
│   │   ├── utils/          # Utility functions (auth, validation, logging, health check)
│   │   ├── types/          # TypeScript type definitions
│   │   ├── scripts/        # Database scripts (seeding)
│   │   └── test/           # Test setup and configuration
│   ├── prisma/             # Database schema and migrations
│   ├── package.json        # Backend dependencies and scripts
│   ├── tsconfig.json       # TypeScript configuration
│   └── vitest.config.ts    # Test configuration
├── docs/                   # Project documentation
│   ├── API.md             # API documentation
│   └── DEVELOPMENT.md     # Development guide
├── .github/                # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml         # CI/CD pipeline
├── setup.sh               # Automated setup script
├── package.json           # Root package.json with workspaces
├── .gitignore            # Comprehensive gitignore
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- PostgreSQL 15+
- Git

### Quick Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow-pro
   ```

2. **Run the automated setup script**
   ```bash
   ./setup.sh
   ```

3. **Configure environment variables**
   - Update `backend/.env` with your PostgreSQL connection string
   - Update `frontend/.env` if needed (defaults work for local development)

4. **Set up the database**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

### Manual Setup
If you prefer manual setup:

```bash
# Install dependencies
pnpm install

# Set up backend
cd backend
cp env.example .env
# Edit .env with your database credentials
pnpm db:migrate
pnpm db:seed

# Set up frontend
cd ../frontend
cp env.example .env

# Start development
cd ..
pnpm dev
```

### Demo Account
- **Email**: `demo@taskflow.com`
- **Password**: `demo123`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get user tasks (with pagination and filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/overview` - Get task statistics

### Habits
- `GET /api/habits` - Get user habits (with pagination and filters)
- `POST /api/habits` - Create new habit
- `GET /api/habits/:id` - Get specific habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/entries` - Record habit entry
- `GET /api/habits/:id/entries` - Get habit entries
- `GET /api/habits/stats/overview` - Get habit statistics

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/analytics/productivity` - Get productivity analytics

### Health Check
- `GET /health` - System health check

## 🧪 Testing

### Run Tests
```bash
# All tests
pnpm test

# Frontend tests only
pnpm --filter frontend test

# Backend tests only
pnpm --filter backend test

# With coverage
pnpm --filter frontend test:coverage
pnpm --filter backend test:coverage
```

### Test Coverage
- Frontend: React components with React Testing Library
- Backend: API endpoints with Supertest
- Database: Integration tests with test database

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

## 📚 Documentation

- [API Documentation](./docs/API.md) - Complete API reference
- [Development Guide](./docs/DEVELOPMENT.md) - Detailed development instructions
- [Database Schema](./backend/prisma/schema.prisma) - Database structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `pnpm test`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Submit a pull request

## 🎯 Features Implemented

### ✅ Completed Features
- **User Authentication**: Complete JWT-based auth system with registration, login, and profile management
- **Task Management**: Full CRUD operations with priority levels, due dates, and status tracking
- **Habit Tracking**: Daily habit tracking with progress visualization and streak calculation
- **Analytics Dashboard**: Comprehensive productivity metrics with interactive charts
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Optimistic UI updates with proper error handling
- **Data Persistence**: PostgreSQL database with Prisma ORM
- **API Documentation**: Complete REST API with comprehensive error handling
- **Testing**: Unit and integration tests for both frontend and backend
- **Security**: Password hashing, JWT tokens, rate limiting, and CORS protection
- **Health Monitoring**: System health check endpoint with database and memory monitoring
- **Database Seeding**: Sample data for development and testing

### 🔄 Future Enhancements
- **AI-Powered Features**: Smart task prioritization and habit suggestions
- **Team Collaboration**: Share projects and tasks with team members
- **Data Export**: Export tasks and habits data
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Machine learning insights and predictions
- **Integrations**: Calendar sync, email notifications, and third-party tools

## 🏆 Project Achievements

This project demonstrates:
- **Full-Stack Development**: Complete React + Node.js application
- **Modern Architecture**: TypeScript, Prisma, Zustand, and modern tooling
- **Production Readiness**: Security, testing, monitoring, and deployment ready
- **AI-Assisted Development**: Leveraging AI tools for faster, higher-quality development
- **Best Practices**: Clean code, proper error handling, and comprehensive documentation

## 📄 License

MIT License - see LICENSE file for details

---

*This project demonstrates the power of AI-assisted development, showcasing how modern AI tools can accelerate development while maintaining code quality and best practices. Built with ❤️ using Cursor AI, TypeScript, React, and Node.js.*
