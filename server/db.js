const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres.hwumsbvzyqxonkeuuzfs:Gof2lJHo8RNue2Ya@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true",
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
