const fs = require('fs');
const pool = require('./config/db');

const runSql = async () => {
    try {
        const sql = fs.readFileSync('update_prices.sql', 'utf8');
        const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

        for (const statement of statements) {
            await pool.query(statement);
        }
        console.log('Prices updated successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runSql();
