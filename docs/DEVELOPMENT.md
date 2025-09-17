# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- PostgreSQL 15+
- Redis (optional, for caching)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskflow-pro
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

5. Start development servers:
```bash
pnpm dev
```

## Project Structure

```
taskflow-pro/
├── frontend/          # React TypeScript application
├── backend/           # Node.js Express API
├── docs/             # Documentation
├── .github/          # GitHub Actions workflows
└── README.md
```

## Development Workflow

### Code Style
- Use Prettier for code formatting
- Follow ESLint rules
- Use TypeScript strict mode
- Write meaningful commit messages

### Testing
- Write unit tests for utilities and components
- Write integration tests for API endpoints
- Maintain >80% code coverage

### Git Workflow
- Use feature branches for new features
- Create pull requests for code review
- Use conventional commit messages

## AI Integration Guidelines

### Code Generation
- Use Cursor for component scaffolding
- Generate TypeScript interfaces with AI
- Create API routes with proper validation

### Testing
- Generate test suites with AI assistance
- Create mock data and fixtures
- Write edge case scenarios

### Documentation
- Use AI for JSDoc comments
- Generate API documentation
- Create user guides and tutorials

## Deployment

### Frontend (Vercel)
- Automatic deployment from main branch
- Environment variables configured in Vercel dashboard

### Backend (Railway)
- Automatic deployment from main branch
- Database and Redis services managed by Railway

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Support

For questions or issues, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
