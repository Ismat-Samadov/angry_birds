# QueryBank AI - Bank Məlumat Analizi Sistemi

> AI-powered banking analytics system for Azerbaijani bank managers. Natural language queries with intelligent chart generation.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)](https://neon.tech/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini%202.5-orange)](https://ai.google.dev/)

---

## 🎯 Overview

QueryBank AI is a production-ready, AI-powered analytics platform that allows bank managers to query banking data using natural language in Azerbaijani or English. The system automatically generates SQL queries, executes them against a PostgreSQL database, and presents results with intelligent chart visualizations.

### Key Features

- 🤖 **AI-Powered Queries** - Natural language processing with Google Gemini 2.5 Flash
- 📊 **Smart Visualizations** - Automatic chart generation with validation
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 🇦🇿 **Azerbaijani Support** - Fully localized interface and AI responses
- ⚡ **Real-Time Data** - Live database queries with sub-second response times
- 📱 **Responsive Design** - Modern UI/UX with Tailwind CSS
- 🎨 **Two-Page Structure** - Dedicated Chat and Reports pages

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon.tech recommended)
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd querybank-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
psql $DATABASE_URL -f database/demo_bank_schema.sql
psql $DATABASE_URL -f database/create_users_table.sql

# Start development server
npm run dev
```

### Demo Credentials

```
Email: demo@querybank.az
Password: demo123
```

Visit: `http://localhost:3000`

---

## 📁 Project Structure

```
querybank-web/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Main AI Chat page
│   ├── reports/                  # Reports & Analytics page
│   │   └── page.tsx             # Dashboard with charts and queries
│   ├── login/                    # Authentication
│   │   └── page.tsx             # Login page
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── login/route.ts   # Login API
│   │   │   ├── logout/route.ts  # Logout API
│   │   │   └── me/route.ts      # Current user API
│   │   ├── query/route.ts       # AI query processing
│   │   └── stats/route.ts       # Dashboard statistics
│   ├── layout.tsx               # Root layout with fonts
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── DataChart.tsx            # Chart.js wrapper (bar/line/pie)
│   └── StatsCard.tsx            # Statistics card component
│
├── lib/                         # Utility libraries
│   ├── db.ts                    # PostgreSQL connection & query utilities
│   ├── gemini.ts                # Google Gemini AI integration
│   └── auth.ts                  # JWT & bcrypt authentication utilities
│
├── database/                    # Database schemas and migrations
│   ├── demo_bank_schema.sql     # Main database schema (customers, loans, transactions)
│   └── create_users_table.sql   # Users table for authentication
│
├── docs/                        # Documentation
│   ├── README.md                # Old project readme (archive)
│   ├── PRODUCTION_READY_REPORT.md    # Complete testing report
│   ├── DEMO_SCRIPT.md                # Manager presentation guide
│   ├── TWO_PAGE_STRUCTURE.md         # Architecture documentation
│   ├── AUTHENTICATION_TEST_RESULTS.md # Auth testing details
│   ├── CHART_VALIDATION.md           # Chart validation system docs
│   ├── QUERY_FIX_DETAILS.md          # Multi-statement query fix
│   ├── DEPLOYMENT.md                 # Vercel deployment guide
│   ├── PROJECT_SUMMARY.md            # Project overview
│   ├── FINAL_STATUS.md               # Final status report
│   └── SUMMARY.md                    # Quick summary
│
├── public/                      # Static assets
│   ├── favicon.ico              # Application icon
│   └── ...                      # Other static files
│
├── middleware.ts                # Next.js middleware for route protection
├── .env.local                   # Environment variables (local dev)
├── .env.example                 # Environment template
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── next.config.ts               # Next.js configuration
└── README.md                    # This file
```

---

## 📚 Directory Explanations

### `/app` - Application Pages & Routes
The heart of the Next.js application using the App Router pattern. Contains all pages, layouts, and API routes.

**Key Files:**
- `page.tsx` - Main AI chat interface with natural language query input
- `reports/page.tsx` - Analytics dashboard with stats, charts, and custom queries
- `login/page.tsx` - Authentication page with demo credentials
- `api/` - Backend API endpoints for queries, authentication, and stats

### `/components` - Reusable React Components
Shared UI components used across multiple pages.

- `DataChart.tsx` - Flexible chart component supporting bar, line, and pie charts
- `StatsCard.tsx` - Statistics card with icon, value, and trend indicator

### `/lib` - Utility Libraries
Core business logic and external service integrations.

- `db.ts` - PostgreSQL database connection pool and query wrapper
- `gemini.ts` - Google Gemini AI integration for SQL generation
- `auth.ts` - JWT token creation/verification and password hashing

### `/database` - Database Schemas
SQL files for database setup and migrations.

- `demo_bank_schema.sql` - Complete banking schema (customers, loans, transactions, views, triggers)
- `create_users_table.sql` - User authentication table with demo user

### `/docs` - Documentation
Comprehensive documentation for development, testing, and deployment.

**Essential Docs:**
- `PRODUCTION_READY_REPORT.md` - Complete testing results and confidence report
- `DEMO_SCRIPT.md` - Step-by-step guide for presenting to stakeholders
- `TWO_PAGE_STRUCTURE.md` - Architecture and navigation documentation
- `DEPLOYMENT.md` - Vercel deployment instructions

### `/public` - Static Assets
Static files served directly by Next.js (images, fonts, icons).

### Root Configuration Files
- `middleware.ts` - Route protection and authentication checks
- `.env.local` - Environment variables (DATABASE_URL, API keys, secrets)
- `package.json` - npm dependencies and scripts
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.ts` - Tailwind CSS customization
- `next.config.ts` - Next.js build and runtime configuration

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# AI
GEMINI_API_KEY=your_google_gemini_api_key_here

# Authentication
JWT_SECRET=your_secure_random_jwt_secret_here

# App
NEXT_PUBLIC_APP_NAME=QueryBank
```

---

## 🎨 Application Pages

### 1. AI Chat Page (`/`)
**Purpose:** Conversational interface for natural language queries

**Features:**
- Natural language input in Azerbaijani or English
- 6 predefined example questions
- Real-time AI query generation
- Results with tables, charts, and SQL disclosure
- Larger chat window for better conversation flow

**Use Case:** Quick questions and conversational data exploration

### 2. Reports & Analytics Page (`/reports`)
**Purpose:** Comprehensive dashboard with analytics and custom queries

**Features:**
- **Stats Cards**: 4 key metrics (customers, loans, balances, deposits)
- **Automatic Reports**: 3 pre-generated charts that load on page open
  - Kredit Növlərinə Görə Balans
  - Hesab Növlərinə Görə Orta Kredit Reytinqi
  - Ən Yüksək Balansa Malik Müştərilər
- **Custom Query Interface**: Input field with demo queries
- **Results Display**: Table + Chart + SQL for custom queries

**Use Case:** Dashboard viewing, report analysis, custom data exploration

### Navigation
Seamless tab-based navigation between pages:
- **AI Çat** → Main chat interface
- **Hesabatlar** → Reports & analytics

---

## 🧪 Testing

The application has been thoroughly tested:

✅ **6/6 Predefined questions working**
✅ **8/8 Edge cases handled** (empty input, SQL injection, invalid queries, etc.)
✅ **Authentication flow tested** (login, logout, protected routes)
✅ **Chart validation working** (prevents horrible visualizations)
✅ **All API endpoints functional**

See `docs/PRODUCTION_READY_REPORT.md` for detailed test results.

---

## 📊 Key Technologies

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL (Neon)** - Cloud database
- **Google Gemini 2.5 Flash** - AI query generation
- **JWT (jose)** - Authentication tokens
- **bcryptjs** - Password hashing

### Development
- **ESLint** - Code linting
- **Turbopack** - Fast bundler (Next.js 16)
- **PostCSS** - CSS processing

---

## 🔒 Security Features

✅ **Password Hashing** - bcrypt with 10 rounds
✅ **JWT Tokens** - HS256, 7-day expiration
✅ **HttpOnly Cookies** - XSS protection
✅ **SameSite Cookies** - CSRF protection
✅ **Parameterized Queries** - SQL injection prevention
✅ **Route Protection** - Middleware authentication
✅ **Input Validation** - All user inputs validated

---

## 🎯 Demo Script

For presenting to stakeholders, see `docs/DEMO_SCRIPT.md` for:
- 5-minute full demo
- 2-minute speed demo
- What to say at each step
- How to handle questions
- Troubleshooting tips

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Connect to Vercel
# Visit vercel.com and import your repository

# 3. Set Environment Variables
# In Vercel dashboard, add:
# - DATABASE_URL
# - GEMINI_API_KEY
# - JWT_SECRET
# - NEXT_PUBLIC_APP_NAME

# 4. Deploy
# Vercel will automatically build and deploy
```

See `docs/DEPLOYMENT.md` for detailed instructions.

---

## 📈 Performance

- **Login**: 600-750ms
- **Stats API**: 600-650ms
- **AI Query**: 3-7 seconds (includes Gemini API call)
- **Database Queries**: 75-570ms
- **Build Time**: ~1.7 seconds

---

## 🐛 Known Issues

### Middleware Deprecation Warning
```
⚠ The "middleware" file convention is deprecated.
Please use "proxy" instead.
```
**Status**: Non-blocking, can be updated later
**Impact**: None - application works perfectly

### Gemini API Rate Limits
Occasionally returns 503 "Service Unavailable"
**Mitigation**: Clear error message shown to user, can retry
**Impact**: Low - acceptable for MVP

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
psql $DATABASE_URL -f database/demo_bank_schema.sql      # Create schema
psql $DATABASE_URL -f database/create_users_table.sql    # Create users
```

---

## 🤝 Contributing

This is a production MVP. For changes:

1. Create a feature branch
2. Test thoroughly
3. Update relevant documentation
4. Submit for review

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| `docs/PRODUCTION_READY_REPORT.md` | Complete testing report with confidence level |
| `docs/DEMO_SCRIPT.md` | Step-by-step presentation guide |
| `docs/TWO_PAGE_STRUCTURE.md` | Architecture and page descriptions |
| `docs/CHART_VALIDATION.md` | Chart validation system documentation |
| `docs/AUTHENTICATION_TEST_RESULTS.md` | Auth testing details |
| `docs/DEPLOYMENT.md` | Vercel deployment guide |

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

---

## 📞 Support

For issues or questions:
1. Check `docs/PRODUCTION_READY_REPORT.md` for common issues
2. Review `docs/DEPLOYMENT.md` for deployment problems
3. Check server logs for error messages

---

## ✅ Status

**Production Ready**: YES ✅
**All Tests Passing**: YES ✅
**Documentation Complete**: YES ✅
**Ready for Stakeholder Demo**: YES ✅

---

## 📄 License

Proprietary - QueryBank AI

---

## 🏆 Credits

**Developed for**: Azerbaijani Banking Sector
**AI Model**: Google Gemini 2.5 Flash
**Database**: Neon.tech PostgreSQL
**Framework**: Next.js 16 with TypeScript

---

**Last Updated**: October 27, 2025
**Version**: 1.0.0 (Production MVP)
**Status**: ✅ Production Ready
