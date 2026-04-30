# Team Task Manager

A production-ready full-stack task management application with JWT authentication and role-based access control.

## Live Demo

[Live URL - Vercel](https://your-app.vercel.app)

## Features

- **Authentication**: JWT-based secure login with access + refresh tokens
- **Role-Based Access Control**: Admin and member roles with strict API-level enforcement
- **Project Management**: Create, update, delete projects; manage members
- **Task Management**: Create, assign, update status, track tasks
- **Dashboard**: Real-time statistics, charts, overdue tracking
- **Responsive UI**: Ant Design components with mobile support

## Tech Stack

- **Frontend**: React 18, Vite, Ant Design 5, Recharts, React Router v6
- **Backend**: Node.js, Express.js, MongoDB, Mongoose 7
- **Authentication**: JWT (access: 15m, refresh: 7d), bcryptjs
- **Deployment**: Vercel (frontend), Railway (backend), MongoDB Atlas

## Architecture Overview

```
task-manager/
├── backend/           # Express API server
│   ├── config/       # DB & JWT config
│   ├── models/       # Mongoose schemas
│   ├── middleware/   # Auth & RBAC
│   ├── controllers/  # Business logic
│   ├── routes/      # API routes
│   └── validation/   # Input validation
└── frontend/        # React SPA
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── contexts/
    └── vercel.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
# Set up .env variables (see below)
npm start
```

The server runs on port 5000.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on http://localhost:5173

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|------------|----------|
| MONGO_URI | MongoDB connection string | Yes |
| JWT_SECRET | Access token secret (32+ chars) | Yes |
| JWT_REFRESH_SECRET | Refresh token secret (32+ chars) | Yes |
| PORT | Server port (default: 5000) | No |
| FRONTEND_URL | Frontend URL for CORS | Yes |
| NODE_ENV | production or development | No |

### Frontend (.env)

| Variable | Description | Required |
|----------|------------|----------|
| VITE_API_URL | Backend API URL | Yes |

## API Documentation

### Auth Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login |
| POST | /api/auth/logout | Auth | Logout |
| POST | /api/auth/refresh | Public | Refresh token |

### Project Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/projects | Auth | Get all projects |
| POST | /api/projects | Admin | Create project |
| GET | /api/projects/:id | Member | Get project details |
| PATCH | /api/projects/:id | Admin | Update project |
| DELETE | /api/projects/:id | Admin | Delete project |
| POST | /api/projects/:id/members | Admin | Add member |
| DELETE | /api/projects/:id/members/:userId | Admin | Remove member |

### Task Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/tasks | Auth | Get tasks |
| POST | /api/tasks | Admin | Create task |
| GET | /api/tasks/:id | Member | Get task |
| PATCH | /api/tasks/:id | Admin | Update task |
| PATCH | /api/tasks/:id/status | Auth* | Update status |
| DELETE | /api/tasks/:id | Admin | Delete task |

*Admin: any task; Member: only assigned tasks

### Dashboard Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/dashboard/stats | Auth | Get stats |

## Role-Based Access Control

| Action | Admin | Member |
|--------|-------|--------|
| Create project | ✅ | ❌ |
| Update project | ✅ | ❌ |
| Delete project | ✅ | ❌ |
| Add/remove members | ✅ | ❌ |
| Create task | ✅ | ❌ |
| Update task details | ✅ | ❌ |
| Delete task | ✅ | ❌ |
| Update task status | ✅ | Own only |
| View all projects | ✅ | Own only |
| View all tasks | ✅ | Own only |
| View global dashboard | ✅ | Personal |

RBAC is enforced at the API middleware level. Frontend role checks are UI-only helpers.

## Deployment

### MongoDB Atlas

1. Create free cluster at cloud.mongodb.com
2. Create database user (username + password)
3. Whitelist IP: 0.0.0.0/0
4. Get connection string → MONGO_URI

### Railway Backend

1. Push code to GitHub
2. Connect Railway to GitHub repo
3. Set root: /backend
4. Add env vars in Railway dashboard
5. Deploy → copy Railway URL

### Vercel Frontend

1. Import project in Vercel
2. Set root: /frontend
3. Add VITE_API_URL env var
4. Deploy

## Demo Video

[Link to demo video]

## Screenshots

(Add screenshots here)