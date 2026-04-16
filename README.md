# DevHire — Job Portal with Role-Based Authentication

A full-stack application built with **Node.js + Express + MongoDB** (backend) and **React.js** (frontend).  
This project demonstrates secure authentication, role-based access control, and CRUD operations for job postings.

---

## 📌 Project Overview

**DevHire** is a job portal where:
- Users can register and log in securely.
- Admins can create, update, and delete job listings.
- Authenticated users can browse available jobs.
- APIs are protected using JWT-based authentication.

This project focuses on **clean backend structure and core functionality**, making it highly suitable for demonstrating backend development fundamentals.

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- bcryptjs

### Frontend
- React.js
- React Router DOM

---

## 📁 Project Structure

```text
DevHire/
├── Backend/
│   ├── Config/
│   ├── Middleware/
│   ├── Models/
│   ├── Routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│
└── README.md
```

---

## 🗄️ Database Schema

### User
```javascript
{
  email: String,        // required, unique
  password: String,     // hashed using bcrypt
  role: String          // "user" or "admin"
}
```

### Job
```javascript
{
  title: String,
  company: String,
  location: String,
  description: String
}
```

---

## 🔑 API Endpoints

**Base URL:** `http://localhost:8080/api`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/signup` | Public | Register a new user |
| **POST** | `/login` | Public | Login and receive JWT token |
| **GET** | `/jobs` | Public | Fetch all jobs |
| **POST** | `/jobs` | Admin | Create a job |
| **PUT** | `/jobs/:id` | Admin | Update a job |
| **DELETE** | `/jobs/:id` | Admin | Delete a job |

---

## 🔐 Authentication & Authorization

- Passwords are hashed using **bcrypt**.
- **JWT tokens** are issued on login.
- Protected routes require: `Authorization: Bearer <token>`
- Role-based middleware ensures only admins can modify jobs.

---

## 🖥️ Frontend Features

- User Signup & Login
- JWT-based authentication handling
- Protected routes
- Job listing page
- Admin dashboard for job CRUD operations

---

## ⚙️ Setup & Installation

**1. Clone Repository**
```bash
git clone https://github.com/chavanpranav/DevHire.git
cd DevHire
```

**2. Backend Setup**
```bash
cd Backend
npm install
npm start
```

**3. Frontend Setup**
```bash
cd frontend
npm install
npm start
```

---

## 🔧 Environment Variables (Recommended Improvement)

Currently, the MongoDB URL and JWT secret may be hardcoded. For better practice, use a `.env` file in your Backend directory:

```env
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

---

## 🔒 Security Practices Implemented

- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- Basic input validation (presence checks)
- CORS enabled for frontend-backend communication

---

## ⚠️ Current Limitations

- No API versioning (`/api/v1` not implemented).
- No centralized error-handling middleware.
- Input validation is basic (no dedicated validation library like Joi or Zod).
- No pagination or filtering in job APIs.
- No applicant tracking (users cannot apply to jobs directly).
- No Swagger/Postman documentation included.

---

## 📈 Scalability Considerations (Future Scope)

The current system can be extended with:
- API versioning (`/api/v1`)
- Pagination and filtering for job listings
- A complete job application system
- Redis caching for frequently accessed data
- Microservices architecture
- Docker-based deployment

---

## ✅ Key Highlights

- Clean backend architecture
- JWT authentication with role-based access
- Functional full-stack integration
- Simple and maintainable code structure

---

## 📌 Conclusion

This project demonstrates the fundamentals of:
- Backend API development
- Authentication & authorization
- CRUD operations
- Full-stack integration

It is designed as a learning-focused and extendable foundation project.

---
