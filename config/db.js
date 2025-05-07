"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
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
exports.default = pool;
