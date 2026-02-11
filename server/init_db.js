const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const initDb = async () => {
    // 1. Connect to default 'postgres' database to create 'payroll_app' if it doesn't exist
    const rootPool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: 'postgres',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        console.log("Connecting to postgres database to check existence of payroll_app...");
        // Check if database exists
        const res = await rootPool.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);
        if (res.rowCount === 0) {
            console.log(`Database ${process.env.DB_NAME} not found. Creating...`);
            await rootPool.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
            console.log(`Database ${process.env.DB_NAME} created.`);
        } else {
            console.log(`Database ${process.env.DB_NAME} already exists.`);
        }
    } catch (err) {
        console.error("Error checking/creating database:", err.message);
        // If we can't create it, maybe it's because we ARE using 'postgres' as the target.
        // If DB_NAME is 'postgres', the create command would fail, which is fine.
    } finally {
        await rootPool.end();
    }

    // 2. Connect to the target database and run schema
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        console.log(`Connecting to ${process.env.DB_NAME} to initialize schema...`);
        const sql = fs.readFileSync(path.join(__dirname, 'database.sql')).toString();
        await pool.query(sql);
        console.log("Database schema initialized successfully.");
    } catch (err) {
        console.error("Error initializing schema:", err.message);
    } finally {
        await pool.end();
    }
};

initDb();
