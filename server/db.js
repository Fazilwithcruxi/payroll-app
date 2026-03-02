const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Gof2lJHo8RNue2Ya@db.hwumsbvzyqxonkeuuzfs.supabase.co:5432/postgres?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
