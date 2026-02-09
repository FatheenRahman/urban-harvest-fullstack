const mysql = require('mysql2/promise');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
    try {
        // Create a connection without selecting a database specifically to create it if it doesn't exist
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        console.log('Connected to MySQL server.');

        // Read schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = await fs.readFile(schemaPath, 'utf8');

        // Split queries by semicolon to execute them one by one
        // Note: Simple split might fail on semicolons inside strings, but for this schema it should be fine.
        // A better approach for robust production scripts handles comments and strings, 
        // but for this specific schema.sql, standard splitting is effective enough if removing empty ones.
        const queries = schemaSql
            .split(';')
            .map(query => query.trim())
            .filter(query => query.length > 0);

        for (const query of queries) {
            if (query) {
                await connection.query(query);
            }
        }

        console.log('Database initialized successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDatabase();
