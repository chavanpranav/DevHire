# DevHire — Job Portal with Role-Based Authentication

A full-stack REST API assignment built with **Node.js + Express + MongoDB** on the backend and **React.js** on the frontend. The platform allows job seekers to browse listings and employers (admins) to manage job postings — all secured with JWT authentication and role-based access control.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Frontend Features](#frontend-features)
- [Security Practices](#security-practices)
- [Scalability Notes](#scalability-notes)
- [API Versioning & Error Handling](#api-versioning--error-handling)

---

## Project Overview

**DevHire** is a job portal application that demonstrates:

- Secure user registration and login with **bcrypt password hashing** and **JWT tokens**
- **Role-based access control** — `user` (job seeker) vs `admin` (employer)
- Full **CRUD operations** on a secondary entity (Job Postings)
- A protected **Admin Dashboard** for employers to create, update, and delete jobs
- A public **Jobs Board** for all authenticated users to browse listings
- Clean REST API design with proper HTTP status codes, middleware separation, and modular routing

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Runtime    | Node.js (ES Modules)              |
| Framework  | Express.js v5                     |
| Database   | MongoDB (via Mongoose ODM)        |
| Auth       | JSON Web Tokens (jsonwebtoken)    |
| Hashing    | bcryptjs                          |
| Frontend   | React.js 19, React Router DOM v7  |
| Dev Tools  | Nodemon                           |

---

## Project Structure

```
DevHire/
├── Backend/
│   ├── Config/
│   │   └── db.js                  # MongoDB connection
│   ├── Middleware/
│   │   ├── auth.js                # JWT verification middleware
│   │   └── isAdmin.js             # Role-based guard middleware
│   ├── Models/
│   │   ├── User.js                # User schema (email, password, role)
│   │   └── job.js                 # Job schema (title, company, location, description)
│   ├── Routes/
│   │   ├── authRoutes.js          # POST /api/login
│   │   ├── signUpRoutes.js        # POST /api/signup
│   │   └── jobRoutes.js           # CRUD /api/jobs
│   ├── server.js                  # Entry point — Express app setup
│   └── package.json
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx          # Navigation with logout
│       │   └── ProtectedRoute.jsx  # Route guard component
│       ├── context/
│       │   └── AuthContext.jsx     # Global auth state (token + role)
│       ├── pages/
│       │   ├── Login.jsx           # Login form
│       │   ├── Signup.jsx          # Registration form with role selection
│       │   ├── Jobs.jsx            # Public job listings (authenticated users)
│       │   └── Admin.jsx           # Admin CRUD dashboard
│       ├── App.jsx                 # Route definitions with role-based redirects
│       └── index.js
│
└── README.md
```

---

## Database Schema

### User Collection

```js
{
  email:    String   // required, unique
  password: String   // required, bcrypt-hashed (10 salt rounds)
  role:     String   // "user" (default) | "admin"
}
```

### Job Collection

```js
{
  title:       String   // required — job title
  company:     String   // required — company name
  location:    String   // required — city / remote
  description: String   // optional — job description
}
```

**Relationship:** Users do not reference Jobs directly. Admins manage the job listings; users browse them. This keeps the schema flat and efficient for the current scope.

---

## API Documentation

### Base URL

```
http://localhost:8080/api
```

> All protected routes require the header:
> `Authorization: Bearer <JWT_TOKEN>`

---

### Auth Endpoints

#### POST `/api/signup` — Register a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "role": "user"
}
```

`role` accepts `"user"` (default) or `"admin"`.

**Responses:**

| Status | Description |
|--------|-------------|
| 201    | User created successfully |
| 400    | Email/password missing, or user already exists |
| 500    | Internal server error |

**Success Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

#### POST `/api/login` — Authenticate and receive JWT

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| 200    | Login successful, returns JWT + role |
| 401    | Invalid credentials |
| 500    | Internal server error |

**Success Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user"
}
```

---

### Job Endpoints

#### GET `/api/jobs` — Fetch all jobs (Public — no auth required)

**Responses:**

| Status | Description |
|--------|-------------|
| 200    | Array of all job documents |
| 500    | Failed to fetch jobs |

**Success Response:**
```json
[
  {
    "_id": "64b1c2d...",
    "title": "Backend Developer",
    "company": "TechCorp",
    "location": "Remote",
    "description": "Node.js, MongoDB experience required."
  }
]
```

---

#### POST `/api/jobs` — Create a new job `🔒 Admin only`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Frontend Developer",
  "company": "StartupXYZ",
  "location": "Mumbai",
  "description": "React.js experience required."
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| 201    | Job created and returned |
| 401    | Missing or invalid token |
| 403    | Authenticated but not admin |
| 500    | Failed to create job |

---

#### PUT `/api/jobs/:id` — Update a job `🔒 Admin only`

**Headers:** `Authorization: Bearer <token>`

**Request Body (partial or full update):**
```json
{
  "title": "Senior Frontend Developer",
  "location": "Bangalore"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| 200    | Updated job document returned |
| 401    | Missing or invalid token |
| 403    | Not admin |
| 500    | Failed to update job |

---

#### DELETE `/api/jobs/:id` — Delete a job `🔒 Admin only`

**Headers:** `Authorization: Bearer <token>`

**Responses:**

| Status | Description |
|--------|-------------|
| 200    | `{ "message": "Job deleted" }` |
| 401    | Missing or invalid token |
| 403    | Not admin |
| 500    | Failed to delete job |

---

### Middleware Reference

| Middleware   | File                       | What it does |
|--------------|----------------------------|--------------|
| `auth`       | `Middleware/auth.js`       | Extracts and verifies the JWT from `Authorization` header. Attaches decoded payload (`id`, `role`) to `req.user`. Returns 401 if missing or invalid. |
| `isAdmin`    | `Middleware/isAdmin.js`    | Checks that `req.user.role === "admin"`. Returns 403 if not. Applied after `auth`. |

---

## Setup & Installation

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally on port `27017` (or use MongoDB Atlas)
- **npm** v9+

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/DevHire.git
cd DevHire
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

**Dependencies installed:**
- `express` — web framework
- `mongoose` — MongoDB ODM
- `bcryptjs` — password hashing
- `jsonwebtoken` — JWT generation and verification
- `cors` — cross-origin request support
- `nodemon` — hot-reloading in development

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## Environment Variables

> **Important:** The current codebase has the JWT secret and MongoDB URL hardcoded for demonstration purposes. For any real deployment, move these to environment variables.

Create a `.env` file inside the `Backend/` directory:

```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/jobPortalDB
JWT_SECRET=your_strong_secret_here
```

Then update `Backend/Config/db.js`:
```js
const mongoUrl = process.env.MONGO_URI;
```

And `Backend/Middleware/auth.js` + `Backend/Routes/authRoutes.js`:
```js
jwt.verify(token, process.env.JWT_SECRET)
jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "2h" })
```

---

## Running the Application

### Start MongoDB (if running locally)

```bash
mongod
```

### Start the Backend Server

```bash
cd Backend
npm start
# Server listening on http://localhost:8080
```

For development with auto-reload:
```bash
npx nodemon server.js
```

### Start the Frontend

```bash
cd frontend
npm start
# App running on http://localhost:3000
```

---

## Testing the API (Postman / curl)

### Register an Admin

```bash
curl -X POST http://localhost:8080/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123", "role": "admin"}'
```

### Login

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123"}'
```

Copy the `token` from the response and use it in subsequent requests:

### Create a Job (Admin)

```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title": "Backend Dev", "company": "TechCorp", "location": "Remote", "description": "Node.js required"}'
```

### Get All Jobs

```bash
curl http://localhost:8080/api/jobs
```

---

## Frontend Features

| Page / Component | Route       | Access         | Description |
|------------------|-------------|----------------|-------------|
| `Login.jsx`      | `/login`    | Public         | Email + password login, redirects based on role |
| `Signup.jsx`     | `/signup`   | Public         | Registration with role selector (User / Admin) |
| `Jobs.jsx`       | `/`         | Authenticated  | Displays all available job listings |
| `Admin.jsx`      | `/admin`    | Admin only     | Full CRUD dashboard — add, edit, delete jobs |
| `Navbar.jsx`     | All pages   | —              | Navigation bar with logout button |
| `AuthContext.jsx`| Global      | —              | Persists token and role in `localStorage`, provides global auth state |

**Auth flow:**
1. User registers via `/signup` with role selection
2. Logs in via `/login` — receives JWT + role
3. Token stored in `localStorage` via `AuthContext`
4. Protected pages check auth state — redirect to `/login` if unauthenticated
5. Admin-only `/admin` route additionally checks `role === "admin"`
6. All admin API calls include `Authorization: Bearer <token>` header

---

## Security Practices

**Password Hashing**
Passwords are hashed using `bcryptjs` with 10 salt rounds before storage. Plain-text passwords are never saved to the database.

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

**JWT Authentication**
Tokens are signed with a secret key and expire after 2 hours. The token payload contains only `{ id, role }` — no sensitive data.

**Role-Based Middleware**
Every write operation on jobs (`POST`, `PUT`, `DELETE`) is protected by two chained middleware layers: `auth` (token check) and `isAdmin` (role check). A valid token alone is not sufficient for admin actions.

**Input Validation**
Required fields are validated at the database schema level (`required: true`) and at the route level (email + password presence check in signup).

**CORS**
Cross-origin requests are enabled via the `cors` package, allowing the React frontend on port 3000 to communicate with the backend on port 8080.

**Duplicate User Prevention**
The signup route checks for existing users by email before creating a new account, returning a 400 error if the email is already registered.

---

## Scalability Notes

### Current Architecture

The application follows a clean **MVC-style separation**: Models define data structure, Routes handle HTTP, Middleware handles cross-cutting concerns. This makes it straightforward to add new entities (e.g., applications, companies) without touching existing code.

### Horizontal Scaling

Since authentication is **stateless JWT-based**, the backend can be horizontally scaled behind a load balancer (e.g., NGINX, AWS ALB) without session-sharing concerns. Any instance can verify any token independently.

### Caching

For read-heavy endpoints like `GET /api/jobs`, a **Redis** caching layer can be added:
- Cache job listings on first fetch with a TTL (e.g., 60 seconds)
- Invalidate cache on any admin `POST`, `PUT`, or `DELETE`
- This reduces MongoDB queries significantly under high read traffic

### Microservices Path

At scale, this monolith can be decomposed into:
- **Auth Service** — handles signup, login, token refresh
- **Jobs Service** — manages job CRUD
- **User Service** — profiles, applications, bookmarks

Each service would expose its own REST (or gRPC) API and communicate over an internal network or message broker (e.g., RabbitMQ, Kafka).

### Database Scaling

MongoDB supports horizontal scaling via **sharding**. For this project, adding indexes on frequently queried fields (e.g., `location`, `company`) would immediately improve query performance:

```js
jobSchema.index({ location: 1 });
jobSchema.index({ company: 1 });
```

### Logging

A production deployment should integrate a structured logging library (e.g., **Winston** or **Pino**) to replace `console.log` calls, with log levels (`info`, `warn`, `error`) and optional shipping to a log aggregation service (e.g., Datadog, Logtail).

### Docker Deployment

The project can be containerized with a `docker-compose.yml` that spins up three services:

```yaml
services:
  mongo:
    image: mongo:7
    ports: ["27017:27017"]

  backend:
    build: ./Backend
    ports: ["8080:8080"]
    depends_on: [mongo]
    environment:
      MONGO_URI: mongodb://mongo:27017/jobPortalDB
      JWT_SECRET: your_secret

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]
```

---

## API Versioning & Error Handling

### Versioning

The current API uses the base path `/api`. For versioning, routes can be prefixed under `/api/v1`:

```js
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", signUpRoutes);
```

This allows introducing `/api/v2` endpoints with breaking changes while keeping existing clients on v1 without disruption.

### Error Handling

All routes use `try/catch` blocks and return structured JSON error responses with appropriate HTTP status codes:

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request (validation failure, duplicate user) |
| 401 | Unauthenticated (missing or invalid token) |
| 403 | Forbidden (authenticated but insufficient role) |
| 500 | Internal server error |

A centralized error-handling middleware can be added as a future improvement:

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});
```

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

*Built as part of a Backend Developer Intern Assignment — demonstrating REST API design, JWT authentication, role-based access control, and full-stack integration.*