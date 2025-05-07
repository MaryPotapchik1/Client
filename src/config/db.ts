import { Pool } from 'pg';
import dotenv from 'dotenv';

 
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'auth_db',
  password: process.env.DB_PASSWORD || '12345',
  port: parseInt(process.env.DB_PORT || '5432'),
});

 
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database: ' + (process.env.DB_NAME || 'auth_db'));
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

export default pool; 