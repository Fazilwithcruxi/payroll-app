CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    doj DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    payment_mode VARCHAR(50) DEFAULT 'Online',
    bank_account_no VARCHAR(50),
    ifsc_code VARCHAR(20),
    pan VARCHAR(20),
    basic_salary NUMERIC(10, 2) NOT NULL,
    hra NUMERIC(10, 2) NOT NULL DEFAULT 0,
    internet_allowance NUMERIC(10, 2) NOT NULL DEFAULT 0,
    meal_card NUMERIC(10, 2) NOT NULL DEFAULT 0,
    special_allowance NUMERIC(10, 2) NOT NULL DEFAULT 0,
    professional_tax NUMERIC(10, 2) DEFAULT 200.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payslips (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    lop_days INTEGER DEFAULT 0,
    net_paid_days INTEGER NOT NULL,
    gross_earnings NUMERIC(10, 2) NOT NULL,
    total_deductions NUMERIC(10, 2) NOT NULL,
    net_pay NUMERIC(10, 2) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, month, year)
);
