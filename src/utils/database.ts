import * as mysql from 'mysql2';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

//Path to read .env at root of project
dotenv.config({path: resolve(__dirname, "../../.env")});

const { DB_CONNECTION_LIMIT, DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

const db = mysql.createPool({
    connectionLimit: DB_CONNECTION_LIMIT,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true
}).promise();

export default db;