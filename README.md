# CODSOFT_TASK3: To-Do List Backend REST API

![Node.js](https://img.shields.io/badge/Node.js-v24-green.svg)
![Express](https://img.shields.io/badge/Express-4.21-blue.svg)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-yellow.svg)
![Swagger](https://img.shields.io/badge/Docs-Swagger%2FOpenAPI-brightgreen.svg)
![Status](https://img.shields.io/badge/CodSoft-Backend%20Internship-orange.svg)

A complete, secure, and feature-rich Task Management RESTful backend API built for **CodSoft Backend Development Internship (Task 3)**. Features database storage, full task lifecycle management, status toggling, categories, priority levels, due dates, Swagger/OpenAPI documentation, and user authentication with JWT & bcrypt password hashing.

---

## 👨‍💻 Developer Information
- **Intern Name**: Bheemereddi Yaswanth Durga Bose
- **Domain**: Backend Development
- **Batch**: SEPT BATCH C24
- **Organization**: [CodSoft](https://www.codsoft.in)

---

## 🌟 Key Features
- **Task Management Lifecycle**: Create, retrieve, update, delete, and instant single-click completion toggling (`/toggle`).
- **Bonus Feature - User Authentication**:
  - Secure registration and login using `bcryptjs` salted password hashing.
  - Stateless JSON Web Token (`JWT`) authentication with Bearer token header verification.
- **Task Organization & Categorization**:
  - Priority levels: `low`, `medium`, `high`, `urgent`.
  - Categories: `work`, `study`, `personal`, `other`.
  - Due date tracking.
- **Search, Filtering, and Pagination**: Filter by completion status (`pending` / `completed`), priority, category, and title search terms.
- **Task Statistics Summary**: Real-time counters for Total, Completed, Pending, and Urgent tasks.
- **Interactive Swagger Documentation**: Integrated OpenAPI 3.0 UI at `http://localhost:3003/docs.html`.
- **Live Interactive Dashboard**: Embedded web application at `http://localhost:3003` for testing and video presentations.
- **Postman Collection**: `postman_collection.json` included for API testing.

---

## 📂 Project Architecture

```
CODSOFT_TASK3/
├── package.json               # Dependencies (express, bcryptjs, jsonwebtoken, cors)
├── .env.example               # Environment configuration template
├── .gitignore                 # Ignored files
├── postman_collection.json    # Ready-to-import Postman collection
├── README.md                  # Comprehensive documentation & video demo script
└── src/
    ├── app.js                 # Express application & Swagger routes
    ├── server.js              # Server bootstrapper & listener
    ├── config/
    │   └── database.js        # SQLite database connection & seed data
    ├── middleware/
    │   ├── auth.js            # JWT verification & optional fallback middleware
    │   ├── errorHandler.js    # Global error response formatting
    │   └── validator.js       # Payload schema validation
    ├── models/
    │   ├── userModel.js       # User database queries & password hashing
    │   └── taskModel.js       # Task database queries, search & aggregations
    ├── controllers/
    │   ├── authController.js  # Register, login, profile logic
    │   └── taskController.js  # CRUD & toggle controller
    ├── routes/
    │   ├── authRoutes.js      # /api/auth endpoints
    │   └── taskRoutes.js      # /api/tasks endpoints
    └── public/                # Live UI dashboard & OpenAPI docs
        ├── index.html         # Live task management dashboard
        ├── docs.html          # Interactive Swagger UI
        ├── openapi.json       # OpenAPI 3.0 specification
        ├── style.css
        └── app.js
```

---

## 🛠️ Technology Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: SQLite (Node.js Native `node:sqlite`)
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS
- **API Documentation**: OpenAPI 3.0 & Swagger UI
- **Logging**: Morgan

---

## 🚀 Getting Started

### 1. Installation
```bash
# Navigate to project directory
cd CODSOFT_TASK3

# Install dependencies
npm install
```

### 2. Run the Server
```bash
npm start
```

The server will start at:
- **API Base URL**: `http://localhost:3003`
- **Live Interactive Dashboard**: `http://localhost:3003`
- **Swagger Documentation**: `http://localhost:3003/docs.html`
- **Health Check**: `http://localhost:3003/api/health`

---

## 📡 REST API Reference

### 1. Authentication Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Login and obtain JWT token |
| `GET` | `/api/auth/me` | Get profile of logged-in user |

### 2. Task Management Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get tasks (supports `?search=`, `?is_completed=`, `?priority=`, `?category=`, `?page=`) |
| `GET` | `/api/tasks/summary` | Get aggregated task statistics (total, pending, completed, urgent) |
| `GET` | `/api/tasks/:id` | Get specific task details |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update task details |
| `PATCH`| `/api/tasks/:id/toggle` | Toggle task between pending and completed |
| `DELETE`| `/api/tasks/:id` | Delete a task |

#### Sample Create Task Request (`POST /api/tasks`):
```json
{
  "title": "Complete CodSoft Backend Internship Submission",
  "description": "Upload tasks to GitHub and post demo video on LinkedIn",
  "priority": "urgent",
  "category": "work",
  "due_date": "2026-10-15"
}
```

---

## 🎥 LinkedIn Video Presentation Script

> *"Hello connections! I am pleased to present **Task 3: To-Do List Backend API** developed as part of my Backend Development Internship at CodSoft.*
>
> *This backend is built using **Node.js, Express.js, and SQLite**, fortified with **JWT authentication** and documented with **Swagger/OpenAPI**.*
>
> *Key Highlights of this implementation:*
> 1. *Comprehensive task CRUD with single-click completion toggling and status tracking.*
> 2. *Implemented Bonus Features: Priority levels (urgent, high, medium, low), task categories (work, study, personal), and due dates.*
> 3. *Secure user authentication with salted bcrypt password hashing and JWT token issuance.*
> 4. *Search, multi-attribute filtering, and real-time dashboard statistics.*
> 5. *Standardized documentation accessible via Swagger UI.*
>
> *Check out the live demo on my screen and the source code on GitHub. Thanks to @CodSoft for this learning journey!"*

### LinkedIn Post Template:
```text
🎯 Proud to present Task 3 of my Backend Development Internship at CodSoft!

📌 Project: To-Do List Backend REST API with JWT Auth & Swagger Documentation
🛠️ Tech Stack: Node.js, Express.js, SQLite, JWT, Bcrypt, Swagger UI

Features Implemented:
✅ Complete task lifecycle & status toggle (completed/pending)
✅ Bonus: JWT Authentication & bcrypt password encryption
✅ Bonus: Priority ranking, categorization, and due dates
✅ Bonus: Swagger/OpenAPI documentation
✅ Filter, search, and aggregated statistics engine

GitHub Repository: <YOUR_GITHUB_REPO_URL>

Thank you @CodSoft for this rewarding experience!

#codsoft #cip #internship #backenddevelopment #nodejs #expressjs #webdevelopment #jwt #swagger
```

---
Licensed under [MIT](LICENSE).
