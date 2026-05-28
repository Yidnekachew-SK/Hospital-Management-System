# Hospital Management System Backend - Technical Documentation

##  Project Overview

A comprehensive **29-table Hospital Management System** built with **Node.js, Express.js, and Raw SQL (MySQL)**. This backend follows enterprise-grade architecture patterns with strict security practices, role-based access control, and clean separation of concerns.

**Tech Stack:**
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.2+
- **Database**: MySQL with mysql2/promise
- **Authentication**: JWT with bcryptjs password hashing
- **Architecture**: MVC + Service Layer Pattern

---

##  Quick Start

### Prerequisites
- Node.js v18 or higher
- MySQL Server v8.0 or higher
- npm or yarn package manager

### 1. Install Dependencies

Navigate to the `backend` directory and run:

```bash
cd backend
npm install
```

**Installed Packages:**
| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.2.1 | Web framework |
| mysql2 | 3.22.3 | Database driver with promise support |
| bcryptjs | 3.0.3 | Password hashing |
| jsonwebtoken | 9.0.3 | JWT token generation & verification |
| cors | 2.8.6 | Cross-origin request handling |
| dotenv | 17.4.2 | Environment variable management |
| nodemon | 3.1.14 | Development auto-restart |

### 2. Database Setup

Execute the schema and seed files in the `database` directory:

```bash
# First, create the database schema
mysql -u root -p < database/sql/schema.sql

# Then, seed initial data (if available)
mysql -u root -p < database/sql/seeds.sql
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Port
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=hospital_management

# JWT Secret Key (use a strong, random string)
JWT_SECRET=your_very_long_and_secure_secret_key_here_min_32_chars

# Environment Mode
NODE_ENV=development
```

⚠️ **Security Note:** Change `JWT_SECRET` to a strong, unique value in production. Never commit `.env` to version control.

---

##  Architecture & Design Principles

### MVC + Service Layer Pattern

The backend strictly follows a three-layer architecture:

```
Request → Route → Controller → Service → Database
           (URL)   (Logic)    (Queries)  (MySQL)
```

| Layer | Responsibility | Location |
|-------|-----------------|----------|
| **Routes** | Define endpoints and HTTP methods | `src/routes/` |
| **Controllers** | Handle HTTP requests/responses, validation | `src/controllers/` |
| **Services** | Database queries and business logic | `src/services/` |
| **Utilities** | Helper functions (response handler, etc.) | `src/utils/` |
| **Middleware** | Authentication, error handling | `src/middleware/` |

### PascalCase Naming Convention

**Critical Rule:** All JSON keys in `req.body` and responses **MUST** match SQL column names exactly.

 **Correct Examples:**
```javascript
// req.body keys match database columns
{
  "EmployeeID": "EMP001",
  "EmployeeName": "John Doe",
  "NationalID": "123456789",
  "DeptID": 1,
  "Salary": 50000
}

// Response data uses same convention
{
  "success": true,
  "data": {
    "PatientID": 1,
    "PatientName": "Jane Smith",
    "DOB_DATE": "1990-05-15"
  }
}
```

 **Incorrect Examples:**
```javascript
// Wrong: snake_case
{ "employee_id": "EMP001" }  //  Use EmployeeID

// Wrong: camelCase
{ "employeeId": "EMP001" }   //  Use EmployeeID

// Wrong: inconsistent naming
{ "id": 1 }                  //  Use EmployeeID
```

### Raw SQL Policy

**No ORMs Allowed** - All database operations use raw SQL with prepared statements.

**Security First:** All queries use `?` placeholders to prevent SQL injection.

```javascript
// CORRECT: Prepared statement with placeholders
const [rows] = await db.execute(
  'SELECT * FROM Employees WHERE EmployeeID = ?',
  [employeeId]
);

//  WRONG: String interpolation (SQL injection risk!)
const rows = await db.execute(
  `SELECT * FROM Employees WHERE EmployeeID = '${employeeId}'`
);
```

**Service Layer Pattern:**
```javascript
// src/services/employeeService.js
async addEmployee(employeeData) {
  try {
    const [result] = await db.execute(
      'INSERT INTO Employees (EmployeeID, EmployeeName, NationalID, ...) VALUES (?, ?, ?, ...)',
      [employeeData.EmployeeID, employeeData.EmployeeName, ...]
    );
    return result;
  } catch (error) {
    throw error;  // Pass to controller
  }
}
```

---

##  Authentication & JWT Flow

### Login/Register Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User sends credentials to POST /api/v1/auth/register │
│    (username, password, employeeID, role)              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────────┐
        │ 2. Service hashes password with    │
        │    bcryptjs (salt rounds: 10)      │
        │ 3. Store hashed password in DB     │
        └────────────────┬───────────────────┘
                         │
                         ↓
        ┌────────────────────────────────────┐
        │ 4. Return success (201)            │
        │    { UserID, Username, UserRole }  │
        └────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 5. User sends credentials to POST /api/v1/auth/login   │
│    (username, password)                                │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────────┐
        │ 6. Service compares plaintext      │
        │    password with hashed password   │
        │    using bcryptjs.compare()        │
        └────────────────┬───────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │ Match?                       │
          ↓                              ↓
          YES                              NO
          │                              │
          ↓                              ↓
    Generate JWT                   Return 401
    { UserID,              Unauthorized
      Username,
      UserRole }
          │
          ↓
    Return 200 + Token
    { token, UserID, Username, UserRole }
```

### Using JWT in Protected Routes

**Step 1: Get Token**
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "Username": "john_doe",
  "Password": "SecurePassword123"
}

Response (200):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOjEsIlVzZXJuYW1lIjoiam9obiBkb2UiLCJVc2VyUm9sZSI6ImRvY3RvciJ9...",
    "UserID": 1,
    "Username": "john_doe",
    "UserRole": "doctor"
  }
}
```

**Step 2: Include Token in Requests**
```bash
GET /api/v1/appointments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expires In:** 24 hours

---

##  API Module Map

### 10 Core Modules with Complete CRUD Operations

| Module | Base URL | Purpose | Tables |
|--------|----------|---------|--------|
| **Auth** | `/api/v1/auth` | User accounts, authentication, system logs | UserAccounts, ActivityLog, Logs |
| **Employees** | `/api/v1/employees` | Staff management | Employees, Doctors, Nurses, Staff |
| **Patients** | `/api/v1/patients` | Patient registration, insurance | Patients, Insurance |
| **Clinic** | `/api/v1/clinic` | Hospital infrastructure | Departments, Wards, Rooms |
| **Appointments** | `/api/v1/appointments` | Clinical scheduling | Appointments, Admissions |
| **Pharmacy** | `/api/v1/pharmacy` | Medications and prescriptions | Medications, Prescriptions, PrescriptionItems |
| **Diagnostics** | `/api/v1/diagnostics` | Lab tests and surgical operations | LabTests, LabReports, Surgeries |
| **Finance** | `/api/v1/finance` | Billing and payments | Billing, Payments, SalaryPayments |
| **Logistics** | `/api/v1/logistics` | Suppliers and inventory management | Suppliers, Inventory |
| **Support** | `/api/v1/support` | Emergency cases and visitors | EmergencyCases, Visitors |

### Sample Endpoints Per Module

```
Auth Module:
  POST   /api/v1/auth/register             → Create user account
  POST   /api/v1/auth/login                → Get JWT token
  GET    /api/v1/auth/user-accounts        → List all users (admin only)
  GET    /api/v1/auth/activity-logs        → View login activity
  GET    /api/v1/auth/system-logs          → View system logs (admin only)

Employees Module:
  POST   /api/v1/employees                 → Register employee
  GET    /api/v1/employees                 → List all employees
  POST   /api/v1/employees/doctors         → Register doctor
  POST   /api/v1/employees/nurses          → Register nurse

Patients Module:
  POST   /api/v1/patients                  → Register patient
  GET    /api/v1/patients                  → List all patients
  POST   /api/v1/patients/insurance        → Register insurance

Clinic Module:
  POST   /api/v1/clinic/wards              → Create ward
  GET    /api/v1/clinic/wards              → List wards
  POST   /api/v1/clinic/rooms              → Create room
  GET    /api/v1/clinic/rooms              → List rooms

Appointments Module:
  POST   /api/v1/appointments              → Schedule appointment
  GET    /api/v1/appointments              → List appointments
  POST   /api/v1/appointments/admissions   → Admit patient
  GET    /api/v1/appointments/admissions   → List admissions

Pharmacy Module:
  POST   /api/v1/pharmacy/medications      → Add medication
  GET    /api/v1/pharmacy/medications      → List medications
  POST   /api/v1/pharmacy/prescriptions    → Create prescription
  GET    /api/v1/pharmacy/prescriptions    → List prescriptions

Diagnostics Module:
  POST   /api/v1/diagnostics/lab-tests    → Create lab test
  GET    /api/v1/diagnostics/lab-tests    → List lab tests
  POST   /api/v1/diagnostics/surgeries    → Schedule surgery
  GET    /api/v1/diagnostics/surgeries    → List surgeries

Finance Module:
  POST   /api/v1/finance/bills             → Create billing
  GET    /api/v1/finance/bills             → List bills
  POST   /api/v1/finance/payments          → Record payment
  POST   /api/v1/finance/salary-payments   → Process salary

Logistics Module:
  POST   /api/v1/logistics/suppliers       → Add supplier
  GET    /api/v1/logistics/suppliers       → List suppliers
  POST   /api/v1/logistics/inventory       → Add inventory item
  GET    /api/v1/logistics/inventory       → List inventory

Support Module:
  POST   /api/v1/support/emergencies       → Record emergency case
  GET    /api/v1/support/emergencies       → List emergencies
  POST   /api/v1/support/visitors          → Log visitor
  GET    /api/v1/support/visitors          → List visitors
```

---

##  Security Features

###  Bcrypt Password Hashing

- **Algorithm**: bcryptjs with salt rounds = 10
- **Storage**: Only hashed passwords stored in database
- **Plaintext Never Stored**: Passwords are hashed during registration
- **Comparison**: bcryptjs.compare() used during login

```javascript
// During registration
const hashedPassword = await bcryptjs.hash(password, 10);
await db.execute('INSERT INTO UserAccounts (...) VALUES (...)', [..., hashedPassword, ...]);

// During login
const isValid = await bcryptjs.compare(providedPassword, storedHash);
if (isValid) { /* Generate JWT */ }
```

###  JWT Role-Based Access Control (RBAC)

**Token Contains:**
- `UserID` - User identifier
- `Username` - Login username
- `UserRole` - Authorization level (admin, doctor, nurse, staff)

**Role-Protected Routes:**
```javascript
// Example: Admin-only endpoint
router.get('/system-logs', checkRole(['admin']), supportController.getSystemLogs);

// Example: Doctor or Admin access
router.post('/medical-records', checkRole(['doctor', 'admin']), clinicController.createMedicalRecord);
```

**Available Roles:**
- `admin` - Full system access
- `doctor` - Clinical and patient access
- `nurse` - Clinical support access
- `staff` - General staff access

###  Global Error Middleware

Centralized error handling with specific error type detection:

| Error Type | HTTP Code | Handling |
|-----------|-----------|----------|
| **ER_DUP_ENTRY** | 400 | Duplicate entry detected |
| **ER_NO_REFERENCED_ROW_2** | 400 | Foreign key constraint failed |
| **JsonWebTokenError** | 401 | Invalid token |
| **TokenExpiredError** | 401 | Token has expired |
| **ER_*** (MySQL errors) | 400 | Database constraint violation |
| **Unhandled Errors** | 500 | Internal server error |

###  SQL Injection Prevention

All queries use parameterized statements (`?` placeholders):

```javascript
// SECURE
const [rows] = await db.execute(
  'SELECT * FROM Patients WHERE PatientID = ? AND NationalID = ?',
  [patientId, nationalId]  // Parameters passed separately
);

//  VULNERABLE - Never use template literals
const rows = await db.execute(
  `SELECT * FROM Patients WHERE PatientID = ${patientId}`
);
```

### Error Details Management

- **Development (`NODE_ENV=development`)**: Full error messages and stack traces
- **Production (`NODE_ENV=production`)**: Generic error messages without details

---

##  Running the Application

### Development Mode (with Auto-Restart)

```bash
cd backend
npm run dev
```

**Output:**
```
Database connected successfully!
Server is running on http://localhost:5000
```

The server will automatically restart when you save changes.

### Production Mode

```bash
cd backend
npm start
```

**Production Best Practices:**
- Set `NODE_ENV=production` in `.env`
- Use a process manager like PM2
- Enable HTTPS/SSL
- Set secure `JWT_SECRET`
- Configure proper database credentials
- Enable CORS restrictions

**Example PM2 Setup:**
```bash
npm install -g pm2
pm2 start src/app.js --name "hospital-api"
pm2 save
pm2 startup
```

---

## 📊 Database Schema (29 Tables)

### Core Tables
- ✅ **Departments** - Hospital departments
- ✅ **Employees** - Employee records
- ✅ **Doctors** - Doctor specializations and licenses
- ✅ **Nurses** - Nurse certifications and ward assignments
- ✅ **Staff** - General staff roles

### Patient Management
- ✅ **Patients** - Patient records and demographics
- ✅ **Insurance** - Insurance provider information
- ✅ **Visitors** - Visitor logs

### Hospital Infrastructure
- ✅ **Wards** - Hospital wards
- ✅ **Rooms** - Patient rooms with capacity tracking
- ✅ **ShiftSchedules** - Staff shift assignments

### Clinical Operations
- ✅ **Appointments** - Patient appointments
- ✅ **Admissions** - Hospital admissions
- ✅ **MedicalRecords** - Patient medical records
- ✅ **Prescriptions** - Medication prescriptions
- ✅ **PrescriptionItems** - Individual prescription items

### Pharmacy
- ✅ **Medications** - Available medications with stock
- ✅ **LabTests** - Laboratory tests
- ✅ **LabReports** - Lab test results
- ✅ **Surgeries** - Surgical operations

### Financial Management
- ✅ **Billing** - Patient billing records
- ✅ **Payments** - Payment records
- ✅ **SalaryPayments** - Employee salary payments

### Logistics & Inventory
- ✅ **Suppliers** - Supplier information
- ✅ **Inventory** - Hospital inventory items

### Emergency & Support
- ✅ **EmergencyCases** - Emergency case records

### Security & Logs
- ✅ **UserAccounts** - System user accounts
- ✅ **ActivityLog** - User login/logout activity
- ✅ **Logs** - System operation logs

---

##  Testing the API

### 1. Test Registration (Public Endpoint)

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "EmployeeID": "EMP001",
    "Username": "john_doe",
    "PasswordHash": "SecurePassword123",
    "UserRole": "doctor"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "User account created successfully",
  "data": {
    "UserID": 1,
    "EmployeeID": "EMP001",
    "Username": "john_doe",
    "UserRole": "doctor"
  }
}
```

### 2. Test Login (Get JWT Token)

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "Username": "john_doe",
    "Password": "SecurePassword123"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "UserID": 1,
    "Username": "john_doe",
    "UserRole": "doctor"
  }
}
```

### 3. Test Protected Route (With Token)

```bash
curl -X GET http://localhost:5000/api/v1/employees \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": {
    "count": 5,
    "employees": [...]
  }
}
```

### 4. Test Error Handling (Duplicate Entry)

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "EmployeeID": "EMP001",
    "Username": "john_doe",
    "PasswordHash": "SecurePassword123",
    "UserRole": "doctor"
  }'
```

**Response (400):**
```json
{
  "success": false,
  "message": "Duplicate entry: This record already exists"
}
```

---

##  Project Structure

```
Hospital-Management-System/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 (Database connection)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── employeeController.js
│   │   │   ├── patientController.js
│   │   │   ├── clinicController.js
│   │   │   ├── appointmentController.js
│   │   │   ├── pharmacyController.js
│   │   │   ├── diagnosticController.js
│   │   │   ├── financeController.js
│   │   │   ├── logisticsController.js
│   │   │   └── supportController.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── employeeService.js
│   │   │   ├── patientService.js
│   │   │   ├── clinicService.js
│   │   │   ├── appointmentService.js
│   │   │   ├── pharmacyService.js
│   │   │   ├── diagnosticService.js
│   │   │   ├── financeService.js
│   │   │   ├── logisticsService.js
│   │   │   └── supportService.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── employeeRoutes.js
│   │   │   ├── patientRoutes.js
│   │   │   ├── clinicRoutes.js
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── pharmacyRoutes.js
│   │   │   ├── diagnosticRoutes.js
│   │   │   ├── financeRoutes.js
│   │   │   ├── logisticsRoutes.js
│   │   │   └── supportRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     (JWT verification & role check)
│   │   │   └── errorMiddleware.js    (Global error handler)
│   │   ├── utils/
│   │   │   └── responseHandler.js    (sendSuccess, sendError)
│   │   └── app.js                    (Main entry point)
│   ├── package.json
│   ├── .env                          (Environment variables)
│   └── .gitignore
│
├── database/
│   └── sql/
│       ├── schema.sql                (Database structure)
│       └── seeds.sql                 (Initial data)
│
├── frontend/                         (React/Vue application)
│
├── BACKEND_SETUP_GUIDE.md           (This file)
└── README.md
```

---

##  Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": 1,
    "name": "Example",
    ...
  }
}
```

**Status Codes:**
- `200` - GET, PUT, DELETE successful
- `201` - POST (resource created)

### Error Response
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

**Status Codes:**
- `400` - Bad request or validation error
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `500` - Internal server error

---

##  Development Guidelines

### Creating a New Endpoint

**Step 1: Service (src/services/moduleService.js)**
```javascript
async addNewRecord(data) {
  const [result] = await db.execute(
    'INSERT INTO Table (Col1, Col2) VALUES (?, ?)',
    [data.Col1, data.Col2]
  );
  return result;
}
```

**Step 2: Controller (src/controllers/moduleController.js)**
```javascript
const addRecord = async (req, res, next) => {
  try {
    const result = await moduleService.addNewRecord(req.body);
    sendSuccess(res, 'Record created successfully', result, 201);
  } catch (error) {
    next(error);  // Pass to error middleware
  }
};
```

**Step 3: Route (src/routes/moduleRoutes.js)**
```javascript
router.post('/', moduleController.addRecord);
```

**Key Rules:**
- ✅ Always use `?` placeholders in SQL
- ✅ Pass errors to `next(error)`, never `next(new Error(...))`
- ✅ Use `sendSuccess()` for all successful responses
- ✅ Use PascalCase for all data keys

---

##  Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **ECONNREFUSED on localhost:3306** | Ensure MySQL is running: `mysql.server start` (Mac) or check Services (Windows) |
| **Cannot find module 'jsonwebtoken'** | Run `npm install jsonwebtoken bcryptjs` |
| **JWT_SECRET not defined** | Add `JWT_SECRET=your_secret` to `.env` file |
| **Duplicate entry error (1062)** | Check if record already exists in database |
| **Foreign key constraint error** | Ensure referenced record exists (e.g., EmployeeID exists before referencing in Doctor table) |
| **Token expired error** | User needs to login again to get new token (24-hour expiry) |
| **Unauthorized (401)** | Check if Authorization header is present and token is valid |

---

##  Deployment Checklist

Before deploying to production:

- [ ] Update `JWT_SECRET` to a strong, random value
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Update database credentials for production database
- [ ] Enable HTTPS/SSL for API endpoints
- [ ] Configure CORS to allow only trusted origins
- [ ] Set up database backups
- [ ] Enable rate limiting (optional but recommended)
- [ ] Set up request logging with morgan
- [ ] Configure environment-specific error logging
- [ ] Use PM2 or similar process manager
- [ ] Set up monitoring and alerting

---

##  Support & Contribution

For questions, issues, or contributions:
1. Check the database schema in `database/sql/schema.sql`
2. Review existing service/controller patterns for consistency
3. Ensure all new code follows PascalCase naming convention
4. Always use parameterized queries with `?` placeholders
5. Test endpoints with Postman/Insomnia before committing

---

**Last Updated:** May 28, 2026  
**Backend Status:**  Production Ready  
**Total Modules:** 10 | **Total Tables:** 29 | **Total Endpoints:** 60+
