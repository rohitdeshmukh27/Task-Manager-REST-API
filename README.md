# 🚀 Task Manager REST API - Complete Learning Project

A **production-ready Task Manager REST API** built with Node.js, TypeScript, Express.js, and Supabase. This project includes comprehensive learning materials from basics to advanced concepts, making it perfect for mastering modern backend development.

---

## 📚 What's Included

This repository contains both a **complete API implementation** and **structured learning materials**:

### 🎯 Main Project
- **Task Manager API** - Full-featured REST API with CRUD operations
- **Supabase Authentication** - JWT-based auth with signup, login, password reset
- **Production patterns** - Middleware, validation, error handling, services

### 📖 Learning Materials
- **[NODEJS_TYPESCRIPT_BASICS.md](NODEJS_TYPESCRIPT_BASICS.md)** - Fundamentals (2-3 hours)
- **[NODEJS_TYPESCRIPT_INTERMEDIATE.md](NODEJS_TYPESCRIPT_INTERMEDIATE.md)** - Real applications (3-4 hours)
- **[NODEJS_TYPESCRIPT_ADVANCED.md](NODEJS_TYPESCRIPT_ADVANCED.md)** - Production patterns (4-5 hours)

### 🗺️ Implementation Roadmaps
- **[TASK_MANAGER_API_ROADMAP.md](TASK_MANAGER_API_ROADMAP.md)** - Step-by-step API guide
- **[SUPABASE_AUTH_ROADMAP.md](SUPABASE_AUTH_ROADMAP.md)** - Authentication integration

---

## ⚡ Quick Start

### Prerequisites
- Node.js 16+ and npm
- VS Code (recommended)
- Supabase account (free tier)

### Setup in 5 Minutes

```bash
# 1. Clone/navigate to project
cd task-manager-api

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env
# Then add your Supabase credentials

# 4. Start development server
npm run dev

# 5. Test the API
curl http://localhost:3000
```

---

## 🎓 Learning Path

Follow this structured path to master Node.js and TypeScript:

```
┌─────────────────────────────────────────────────────────┐
│                   START HERE                            │
│          NODEJS_TYPESCRIPT_BASICS.md                    │
│                                                         │
│  • TypeScript types & interfaces                        │
│  • Functions & async/await                              │
│  • Modules & file system                                │
│  • Node.js fundamentals                                 │
│                                                         │
│  Time: 2-3 hours                                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                INTERMEDIATE LEVEL                       │
│       NODEJS_TYPESCRIPT_INTERMEDIATE.md                 │
│                                                         │
│  • Generics & advanced types                            │
│  • Express.js fundamentals                              │
│  • Middleware & routing                                 │
│  • Request/response handling                            │
│                                                         │
│  Time: 3-4 hours                                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                 ADVANCED LEVEL                          │
│        NODEJS_TYPESCRIPT_ADVANCED.md                    │
│                                                         │
│  • Mapped types & decorators                            │
│  • Dependency injection                                 │
│  • Repository pattern                                   │
│  • Caching & rate limiting                              │
│  • Testing strategies                                   │
│                                                         │
│  Time: 4-5 hours                                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              BUILD THE PROJECT                          │
│        TASK_MANAGER_API_ROADMAP.md                      │
│                                                         │
│  • Complete API implementation                          │
│  • Supabase integration                                 │
│  • Full CRUD operations                                 │
│  • Production structure                                 │
│                                                         │
│  Time: 3-4 hours                                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│             ADD AUTHENTICATION                          │
│         SUPABASE_AUTH_ROADMAP.md                        │
│                                                         │
│  • JWT authentication                                   │
│  • Signup & login                                       │
│  • Password reset                                       │
│  • Protected routes                                     │
│                                                         │
│  Time: 4-5 hours                                        │
└─────────────────────────────────────────────────────────┘
```

**Total Learning Time:** 16-21 hours (2-3 days)

---

## 🏗️ Project Structure

```
task-manager-api/
│
├── 📁 src/
│   ├── 📁 config/
│   │   └── supabase.ts           # Database configuration
│   │
│   ├── 📁 interfaces/
│   │   ├── auth.interface.ts     # Auth type definitions
│   │   └── task.interface.ts     # Task type definitions
│   │
│   ├── 📁 services/
│   │   ├── authService.ts        # Authentication logic
│   │   └── taskService.ts        # Task business logic
│   │
│   ├── 📁 controllers/
│   │   ├── authController.ts     # Auth request handlers
│   │   └── taskController.ts     # Task request handlers
│   │
│   ├── 📁 middleware/
│   │   ├── authMiddleware.ts     # JWT verification
│   │   ├── errorHandler.ts       # Global error handling
│   │   ├── validateAuth.ts       # Auth validation
│   │   └── validateTask.ts       # Task validation
│   │
│   ├── 📁 routes/
│   │   ├── authRoutes.ts         # Auth endpoints
│   │   └── taskRoutes.ts         # Task endpoints
│   │
│   └── app.ts                    # Express app entry point
│
├── 📚 Learning Materials/
│   ├── NODEJS_TYPESCRIPT_BASICS.md
│   ├── NODEJS_TYPESCRIPT_INTERMEDIATE.md
│   └── NODEJS_TYPESCRIPT_ADVANCED.md
│
├── 📋 Implementation Guides/
│   ├── TASK_MANAGER_API_ROADMAP.md
│   └── SUPABASE_AUTH_ROADMAP.md
│
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## ✨ Features

### Task Management
- ✅ Create, read, update, delete tasks
- ✅ Filter by status (pending, in-progress, completed)
- ✅ Filter by priority (low, medium, high)
- ✅ Search tasks by keyword
- ✅ Sort and paginate results
- ✅ Task statistics endpoint

### Authentication
- 🔐 User signup with email verification
- 🔐 Login with JWT tokens
- 🔐 Password reset via email
- 🔐 Protected routes with authentication
- 🔐 Token refresh mechanism
- 🔐 Email verification resend

### Production Features
- ⚡ TypeScript for type safety
- ⚡ Structured error handling
- ⚡ Input validation middleware
- ⚡ Request logging
- ⚡ CORS support
- ⚡ Environment-based configuration

---

## 🛠️ Technologies

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js | JavaScript runtime |
| **Language** | TypeScript | Type-safe JavaScript |
| **Framework** | Express.js | Web framework |
| **Database** | Supabase (PostgreSQL) | Cloud database |
| **Authentication** | Supabase Auth | JWT-based auth |
| **Dev Tools** | ts-node-dev | Hot reload development |

---

## 📡 API Endpoints

### Authentication Endpoints

```http
POST   /api/auth/signup              # Register new user
POST   /api/auth/login               # Login user
POST   /api/auth/logout              # Logout (protected)
GET    /api/auth/me                  # Get current user (protected)
POST   /api/auth/forgot-password     # Request password reset
POST   /api/auth/reset-password      # Reset password (protected)
POST   /api/auth/refresh             # Refresh access token
POST   /api/auth/resend-verification # Resend verification email
```

### Task Endpoints

```http
GET    /api/tasks                    # Get all tasks
GET    /api/tasks/:id                # Get task by ID
POST   /api/tasks                    # Create new task
PUT    /api/tasks/:id                # Update task
DELETE /api/tasks/:id                # Delete task
GET    /api/tasks/stats              # Get task statistics
```

### Query Parameters (GET /api/tasks)

```
?status=pending              # Filter by status
?priority=high               # Filter by priority
?search=typescript           # Search in title/description
?sort_by=created_at          # Sort by field
?order=desc                  # Sort order (asc/desc)
?limit=10                    # Results per page
?offset=0                    # Pagination offset
```

---

## 🔧 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (for auth)
JWT_SECRET=your-jwt-secret-here

# Frontend URLs (for auth)
FRONTEND_URL=http://localhost:3000
PASSWORD_RESET_URL=http://localhost:3000/reset-password
```

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm start            # Run compiled code

# Code Quality
npm run lint         # Run ESLint (if configured)
npm test             # Run tests (if configured)
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:3000

# Get all tasks
curl http://localhost:3000/api/tasks

# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn TypeScript","priority":"high","status":"pending"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Protected route with token
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Import collection from roadmap files
3. Test all endpoints interactively

---

## 📖 Learning Topics Covered

### Basics
- TypeScript primitive types, interfaces, functions
- Arrays, tuples, and objects
- Union and literal types
- Node.js modules and file system
- Promises and async/await

### Intermediate
- Generics and type guards
- Utility types (Partial, Pick, Omit)
- Express routing and middleware
- Request/response handling
- Environment variables
- Database service patterns

### Advanced
- Mapped and conditional types
- Decorators (experimental)
- Dependency injection
- Repository pattern
- Error handling strategies
- Caching and rate limiting
- Unit and integration testing

---

## 🎯 Practice Exercises

Each learning file includes hands-on exercises:

- **Basics**: Create interfaces, write typed functions, file operations
- **Intermediate**: Build generic repository, validation middleware, rate limiting
- **Advanced**: Event emitter, API client with retry, migration system

---

## 🤝 Contributing

This is a learning project. Feel free to:

1. Fork the repository
2. Create feature branches
3. Add new endpoints or features
4. Improve error handling
5. Add tests
6. Enhance documentation

---

## 📚 Additional Resources

### Official Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Supabase Documentation](https://supabase.com/docs)
- [Node.js API Reference](https://nodejs.org/docs/latest/api/)

### Recommended Reading
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Tools & Extensions
- **Thunder Client** - API testing in VS Code
- **Postman** - API development platform
- **DBeaver** - Database management
- **Supabase Studio** - Visual database editor

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** `Module not found` errors
```bash
# Solution: Install dependencies
npm install
```

**Issue:** Supabase connection errors
```bash
# Solution: Check .env file has correct credentials
# Verify SUPABASE_URL and SUPABASE_ANON_KEY
```

**Issue:** Port already in use
```bash
# Solution: Change PORT in .env or kill process
# Windows: netstat -ano | findstr :3000
# Then: taskkill /PID <PID> /F
```

**Issue:** TypeScript compilation errors
```bash
# Solution: Check tsconfig.json and file imports
npm run build
```

---

## ⚖️ License

This project is created for educational purposes. Feel free to use it for learning and personal projects.

---

## 🎉 Acknowledgments

- Built following industry best practices
- Inspired by production API architectures
- Designed for hands-on learning
- Community-driven improvements welcome

---

## 📧 Support

If you have questions or suggestions:

1. Review the roadmap files for detailed explanations
2. Check the learning materials for concept coverage
3. Refer to official documentation links
4. Open an issue for bugs or improvements

---

## 🚀 Next Steps

After completing this project:

1. ✅ **Add more features**: Comments, attachments, user roles
2. ✅ **Implement testing**: Jest unit tests, integration tests
3. ✅ **Add real-time**: WebSocket notifications with Supabase
4. ✅ **Deploy**: Vercel, Railway, or Render
5. ✅ **Build frontend**: React/Next.js client
6. ✅ **Add monitoring**: Logging, metrics, error tracking
7. ✅ **Optimize**: Caching, rate limiting, compression

---

**Happy Learning! 🎓**

Start with [NODEJS_TYPESCRIPT_BASICS.md](NODEJS_TYPESCRIPT_BASICS.md) and work your way up!
