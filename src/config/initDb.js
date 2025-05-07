import pkg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const { Pool } = pkg;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'auth_db',
  password: '12345',
  port: 5432,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database: auth_db');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        birth_date DATE NOT NULL,
        passport_series VARCHAR(10) NOT NULL,
        passport_number VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        has_maternal_capital BOOLEAN DEFAULT FALSE,
        maternal_capital_amount NUMERIC DEFAULT 10000
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS family_members (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        relation_type VARCHAR(50) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        middle_name VARCHAR(100),
        birth_date DATE NOT NULL,
        document_type VARCHAR(50) NOT NULL,
        document_number VARCHAR(100) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        document_type VARCHAR(50) NOT NULL,
        document_number VARCHAR(100) NOT NULL,
        issue_date DATE NOT NULL,
        file_path TEXT
      );
    `);

    const adminCheckResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
      ['admin@example.com', 'admin']
    );

    if (adminCheckResult.rows.length === 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);
      
      await pool.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
        ['admin@example.com', hashedPassword, 'admin']
      );
      
      console.log('Администратор создан: admin@example.com / admin123');
    }

    console.log('База данных инициализирована успешно');
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
  } finally {
    pool.end();
  }
}

initDb();