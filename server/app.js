const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// ✅ DB Test Route (Top Priority)
app.get("/api/test-db", async (req, res) => {
    try {
        const pool = require('./config/db');
        const [result] = await pool.query("SELECT 1");
        res.json({ message: "DB connection OK", result });
    } catch (err) {
        console.error("❌ DB TEST FAILED:", err);
        res.status(500).json({ error: err.message });
    }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Urban Harvest Hub API' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ UNHANDLED ERROR:", err.stack);
    res.status(500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

// Process-level error handling
process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION:', err);
});

process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION:', err);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
