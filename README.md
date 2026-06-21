# DevHire — Modern Job Portal & Hiring Platform 🚀

DevHire is a full-stack job portal and hiring management platform built using the **MERN Stack (MongoDB, Express, React, Node.js)**. It features secure JWT-based, role-based authentication (`USER` / `COMPANY` / `ADMIN`), full CRUD capability for job listings, company verification workflows, and an interactive applicant tracking system.

---

## 📱 User Roles & Features

### 1. Job Seeker (`USER`)
*   **Browse Jobs**: Access a live feed of all active job listings from various employers.
*   **Apply to Jobs**: Submit job applications with resumes (PDF or text).
*   **Track Status**: Check real-time application status updates (`PENDING`, `ACCEPTED`, `REJECTED`) from your personal applicant dashboard.

### 2. Employer (`COMPANY`)
*   **Company Onboarding**: Register an employer account with company profile details.
*   **Job Management**: Create, view, update, and delete company-specific job listings.
*   **Applicant Tracking**: View a list of candidates who applied for your jobs.
*   **Status Control**: Review resumes and update candidate application status dynamically.

### 3. Administrator (`ADMIN`)
*   **Company Verification**: View all registered companies and toggle their verification status.
*   **Platform Statistics**: View aggregate counts (Total Companies, Verified, and Unverified).
*   **User Management**: Delete companies and their associated user accounts when necessary.
*   **Pre-seeded Prototype**: Comes with a preconfigured admin account for instant system testing.

---

## 🛠️ Technology Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js (REST API development)
*   **Database**: MongoDB & Mongoose (Object Data Modeling)
*   **Security**: `bcryptjs` (Password hashing) & JSON Web Tokens (`jsonwebtoken` for stateful session tokens)
*   **CORS**: Configured for secure frontend-backend communication

### Frontend
*   **Library**: React.js
*   **Routing**: React Router DOM (Dynamic SPA Routing & Route Guards)
*   **State Management**: React Context API (Auth status & user session persistence in `localStorage`)
*   **Styling**: Custom CSS styling

---

## 🗄️ Database Models & Schema

### User Model (`User.js`)
Handles authenticating credentials and authorization roles.
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["USER", "COMPANY", "ADMIN"], default: "USER" }
}
```

### Company Model (`Company.js`)
Stores metadata about company accounts. Linked to a parent user profile.
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
}
```

### Job Model (`Job.js`)
Stores details of active listings. Linked to the creator and company.
```javascript
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}
```

### Application Model (`Application.js`)
Tracks applicant submissions for job postings.
```javascript
{
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resume: { type: String, required: true },
  status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" }
}
```

---

## 🔑 API Reference

**Base Backend URL:** `https://devhire-fm0p.onrender.com/api` (Local fallback: `http://localhost:8080/api`)

### 🔐 Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/signup` | Public | Register a new job seeker (`USER`) |
| **POST** | `/login` | Public | Log in as any role and receive a JWT token |

### 🏢 Company Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/company/register` | Public | Register an employer user and company profile |
| **POST** | `/company/login` | Public | Log in as an employer |
| **GET** | `/company/all` | Admin | Retrieve all registered company profiles |
| **GET** | `/company/stats` | Admin | Get metrics (total, verified, unverified companies) |
| **PATCH** | `/company/:id/verify` | Admin | Toggle `isVerified` status of a company |
| **DELETE** | `/company/:id` | Admin | Delete a company profile and its linked user account |

### 💼 Job Postings
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/jobs` | Company | Create a new job listing |
| **GET** | `/jobs` | Public | Retrieve all job listings |
| **GET** | `/jobs/company` | Company | Retrieve jobs posted by the logged-in company |
| **PUT** | `/jobs/:id` | Company | Edit an existing job listing |
| **DELETE** | `/jobs/:id` | Company | Delete a job listing |

### 📝 Job Applications
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/applications/:jobId` | User | Apply to a job listing with a resume |
| **GET** | `/applications/my` | User | Retrieve jobs the user has applied to |
| **GET** | `/applications/job/:jobId`| Company | Retrieve all applicants for a specific job |
| **PUT** | `/applications/:applicationId/status` | Company | Update application status (`PENDING`/`ACCEPTED`/`REJECTED`) |

---

## 📁 Folder Structure

```text
DevHire/
├── backend/
|   |     
│   ├── Config/
│   │   └── db.js                 # DB connection and admin seed logic
|   |     
│   ├── Middleware/
│   │   └── auth.js               # JWT verification & RBAC Middleware
|   |     
│   ├── Models/
│   │   ├── Application.js        # Application Schema
│   │   ├── Company.js            # Company Schema
│   │   ├── Job.js                # Job Schema
│   │   └── User.js               # User Schema
|   |     
│   ├── controllers/              # Business logic controllers
|   |     
│   ├── Routes/                   # Express routes definition
|   |     
│   ├── .env                      # Local environment configurations (ignored)
|   |     
│   └── server.js                 # Main server entrypoint
│
└── frontend/
    |     
    ├── public/
    |   
    └── src/
        ├── components/           # Shared UI components (Navbar, protected route guards)
        ├── context/              # Auth state context provider
        ├── pages/                # Pages (Admin, CompanyDashboard, UserDashboard, Login, Jobs, Signup)
        └── index.js              # React entrypoint
```

---

## ⚙️ Local Installation & Setup

Follow these steps to run DevHire on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/chavanpranav/DevHire.git
cd DevHire
```

### 2. Configure Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Start the Backend Server
```bash
cd backend
npm install
npm start   # Runs on http://localhost:8080
```
*Note: On initial database connection, the system will automatically seed a default administrator account if none exists.*

### 4. Start the Frontend Application
In a separate terminal:
```bash
cd frontend
npm install
npm start     # Runs on http://localhost:3000
```

---

## 🔑 Demo & Testing Credentials
For easy testing during development, the application pre-seeds the following prototype credentials:

*   **Role**: Admin
*   **Email**: `admin@devhire.com`
*   **Password**: `admin123`
