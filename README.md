# Payroll Management System

A modern Payroll Management System built with React, Node.js, and PostgreSQL. Features include HR authentication, employee management, automated salary breakdown based on industry standards, and payslip generation with automatic tax calculations according to the New Tax Regime (FY 2025-26).

## 🚀 Features

- **HR Authentication**: Secure login and registration for HR personnel using JWT and bcrypt.
- **Employee Management**: Add, view, and manage employee records including personal, bank, and salary details.
- **Automated Salary Breakdown**: Enter an Annual Package (LPA) and the system automatically calculates:
  - **Basic Salary**: 40% of Monthly CTC.
  - **HRA**: 50% of Basic Salary.
  - **Allowances**: Fixed internet and meal allowances.
  - **Special Allowance**: Balancing figure to match the CTC.
- **Payslip Generation**: Generate professional payslips with automatic **Income Tax** deduction based on the New Tax Regime (FY 2025-26).
- **Theme Support**: Seamless switching between Light and Dark modes with a persistent floating toggle.
- **Modern UI**: Clean, responsive design with rounded buttons, consistent spacing, and a subtle background pattern.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Axios, Lucide-React, React Router 7.
- **Backend**: Node.js (Express), PostgreSQL (pg), JWT, bcryptjs.
- **Database**: PostgreSQL.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Fazilwithcruxi/payroll-app.git
cd payroll-app
```

### 2. Database Setup
Create a PostgreSQL database and execute the schema provided in `server/database.sql`.

### 3. Server Configuration
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder:
```env
PORT=5000
DB_USER=your_user
DB_HOST=localhost
DB_NAME=payroll_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

### 4. Client Configuration
Navigate to the `client` directory and install dependencies:
```bash
cd ../client
npm install
```

## 🏃 Running the Application

### Start the Backend
```bash
cd server
node index.js
```

### Start the Frontend
```bash
cd client
npm run dev
```

## 📄 License
This project is licensed under the ISC License.
