const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const runMigration = async () => {
    try {
        console.log("Adding annual_package column to employees...");
        await pool.query("ALTER TABLE employees ADD COLUMN IF NOT EXISTS annual_package NUMERIC(15, 2) DEFAULT 0");

        console.log("Adding income_tax column to payslips...");
        await pool.query("ALTER TABLE payslips ADD COLUMN IF NOT EXISTS income_tax NUMERIC(10, 2) DEFAULT 0");

        console.log("Migration successful.");
    } catch (err) {
        console.error("Migration failed:", err.message);
    } finally {
        await pool.end();
    }
};

runMigration();
