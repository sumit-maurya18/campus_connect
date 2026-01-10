# Campus Connect — College Opportunity Portal

Campus Connect is a centralized discovery platform that aggregates, normalizes, and presents internships, jobs, hackathons, scholarships, and learning opportunities for college students through a unified and structured interface.

The platform addresses systemic inefficiencies in opportunity discovery by consolidating fragmented sources, standardizing information, and enabling efficient search and filtering. This repository represents an actively developed, production-oriented system with a roadmap focused on scalability, automation, and intelligent personalization.


## Problem Statement

College students face significant friction when discovering relevant opportunities due to information being scattered across job portals, social media, institutional notices, mailing lists, and informal communities. This fragmentation leads to:

- **Low visibility** of high-quality opportunities  
- **Inconsistent information**, including missing deadlines and eligibility criteria  
- **High cognitive overhead** from monitoring multiple platforms  
- **Poor prioritization** due to lack of structured filtering  

Campus Connect mitigates these issues by acting as a **single source of truth** for opportunity discovery—reducing discovery latency and improving information quality.


## Core Objectives 🎯

Campus Connect is designed to achieve the following:

**Aggregation at scale**  
  Ingest opportunities from heterogeneous sources via modular pipelines.

**Data normalization**  
  Convert unstructured or semi-structured inputs into a consistent, queryable schema.

**Intelligent discoverability**  
  Enable search, filtering, and sorting across multiple attributes such as type, location, deadline, and eligibility.

**Extensibility**  
  Establish architectural foundations for automation, analytics, and ML-driven personalization.

**Operational reliability**  
  Ensure robustness through validation, deduplication, and automated data lifecycle management.


## System Architecture

Campus Connect follows a **monorepo architecture** with clear separation of concerns and well-defined module boundaries.

### Frontend
**Stack:** Next.js (App Router), React, TypeScript  
**Responsibilities:** UI rendering, client-side routing, state management, API consumption  
**Design:** Stateless, component-driven architecture with reusable UI primitives  

### Backend
**Stack:** Node.js, Express.js, PostgreSQL  
**Responsibilities:** REST APIs, business logic, data persistence, validation, error handling  
**Design:** Service-oriented architecture with controller–service–model separation  

### Shared
**Purpose:** Shared types and constants across frontend and backend  
**Benefit:** Strong type safety and consistency across system boundaries  

Infrastructure concerns such as CI/CD, monitoring, and scheduling are planned and documented separately.


## Repository Structure 📁
```text

campus-connect/
│
├── frontend/                     # Next.js Application (TypeScript)
│   ├── src/
│   │   ├── app/                  # App Router pages and layouts
│   │   ├── components/           # Reusable UI components
│   │   │   ├── common/           # Atomic components (Button, Card, Input)
│   │   │   ├── layout/           # Structural components (Navbar, Footer)
│   │   │   ├── opportunities/    # Domain-specific components
│   │   │   └── sections/         # Page-level sections
│   │   ├── lib/                  # Utilities and API clients
│   │   ├── hooks/                # Custom React hooks
│   │   ├── types/                # TypeScript type definitions
│   │   └── styles/               # Global styles and design tokens
│   ├── public/                   # Static assets
│   ├── package.json
│   └── README.md
│
├── backend/                       # Express.js REST API
│   ├── src/
│   │   ├── config/                # Environment and database configuration
│   │   ├── controllers/           # HTTP request handlers
│   │   ├── models/                # Data access layer
│   │   ├── routes/                # API route definitions
│   │   ├── services/              # Business logic layer
│   │   ├── middleware/            # Cross-cutting concerns (validation, auth, errors)
│   │   ├── utils/                 # Utility functions
│   │   ├── jobs/                  # Scheduled background jobs
│   │   ├── app.js                 # Express application configuration
│   │   └── server.js              # Application entry point
│   ├── tests/                     # Unit and integration tests
│   ├── package.json
│   └── README.md
│
├── shared/                        # Cross-layer shared code
│   ├── types/                     # Shared TypeScript definitions
│   ├── constants/                 # Application constants
│   └── package.json
│
├── scripts/                       # Automation and utility scripts
│   ├── setup.sh                   # Environment initialization
│   ├── migrate.js                 # Database migration runner
│   └── seed.js                    # Development data seeding
│
├── docs/                          # Technical documentation
│   ├── API.md                     # API endpoint specifications
│   ├── DATABASE.md                # Database schema and migration guide
│   ├── ARCHITECTURE.md            # System design and decision records
│   ├── DEPLOYMENT.md              # Deployment procedures
│   └── CONTRIBUTING.md            # Contribution guidelines
│
├── .github/
│   └── workflows/                 # CI/CD pipeline definitions
│       ├── frontend-ci.yml
│       └── backend-ci.yml
│
├── .gitignore                     # Version control exclusions
├── .prettierrc                    # Code formatting configuration
├── .eslintrc.json                 # Linting rules
├── package.json                   # Workspace configuration (npm workspaces)
├── README.md                      # Project overview and setup guide
└── LICENSE                        # Open source license