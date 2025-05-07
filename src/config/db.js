"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var pool = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'auth_db',
    password: process.env.DB_PASSWORD || '12345',
    port: parseInt(process.env.DB_PORT || '5432'),
});
pool.on('connect', function () {
    console.log('Connected to PostgreSQL database: ' + (process.env.DB_NAME || 'auth_db'));
});
pool.on('error', function (err) {
    console.error('PostgreSQL connection error:', err);
});
exports.default = pool;
