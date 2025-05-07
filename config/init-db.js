"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function initDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.default.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
            yield db_1.default.query(`
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
        maternal_capital_amount NUMERIC DEFAULT 10000, 
        housing_type VARCHAR(50),
        living_area NUMERIC,
        ownership_status VARCHAR(50)
      );
    `);
            yield db_1.default.query(`
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
            yield db_1.default.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        document_type VARCHAR(50) NOT NULL,
        document_number VARCHAR(100) NOT NULL,
        issue_date DATE NOT NULL,
        file_path TEXT
      );
    `);
            const adminCheckResult = yield db_1.default.query('SELECT * FROM users WHERE email = $1 AND role = $2', ['admin@example.com', 'admin']);
            if (adminCheckResult.rows.length === 0) {
                const saltRounds = 10;
                const hashedPassword = yield bcrypt_1.default.hash('admin123', saltRounds);
                yield db_1.default.query('INSERT INTO users (email, password, role) VALUES ($1, $2, $3)', ['admin@example.com', hashedPassword, 'admin']);
                console.log('Администратор создан: admin@example.com / admin123');
            }
            console.log('База данных инициализирована успешно');
        }
        catch (error) {
            console.error('Ошибка инициализации базы данных:', error);
            throw error;
        }
    });
}
exports.default = initDb;
