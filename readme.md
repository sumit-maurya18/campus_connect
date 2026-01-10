# Campus Connect - College Opportunity Portal

A centralized platform for students to discover internships, jobs, hackathons, scholarships, and learning opportunities.

## Project Structure
```
campus-connect/
├── frontend/          # Next.js frontend
├── backend/           # Express.js API
└── shared/            # Shared code
```

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm >= 9.0.0

### Installation
```bash
# Install all dependencies
npm install

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Edit the .env files with your configuration
```

### Development
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:5000
```

### Database Setup
```bash
# Create database
createdb campus_connect

# Run migrations (when available)
npm run migrate
```

## Tech Stack
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, PostgreSQL
- **DevOps:** GitHub Actions (future)

## Features
- ✅ Opportunity aggregation
- ✅ Advanced filtering
- ✅ Search functionality
- 🚧 Automated scraping (in progress)
- 🚧 User accounts (planned)
- 🚧 AI recommendations (planned)

## Contributing
See CONTRIBUTING.md (coming soon)

## License
MIT