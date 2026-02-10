const pool = require('../config/db');

exports.seedDatabase = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Create Tables if not exist (Simplified version of schema.sql)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(150) NOT NULL,
                description TEXT,
                date DATETIME NOT NULL,
                location VARCHAR(200) NOT NULL,
                category VARCHAR(50),
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                stock INT DEFAULT 0,
                category VARCHAR(50),
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS registrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                event_id INT NOT NULL,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                contact_number VARCHAR(20) NOT NULL,
                registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (event_id) REFERENCES events(id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                buyer_id INT NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                status ENUM('pending', 'processed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                contact_number VARCHAR(20) NOT NULL,
                shipping_address TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (buyer_id) REFERENCES users(id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                price_at_purchase DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `);


        // 2. Clear Tables (Optional: Be careful in production, but good for "Reset")
        // await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        // await connection.query('TRUNCATE TABLE products');
        // await connection.query('TRUNCATE TABLE events');
        // await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // 3. Insert Dummy Products
        const products = [
            ['Quantum Spinach', 'Leaves that exist in multiple states of crispness simultaneously. Rich in dark matter nutrients.', 350.00, 50, 'Vegetables', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2000&auto=format&fit=crop'],
            ['Void Tomato', 'Absorbs light to create the deepest red hue. Tastes like infinite possibilities.', 450.00, 30, 'Vegetables', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop'],
            ['Nebula Berries', 'berries containing swirl of galaxies. Bursts with cosmic flavor.', 3200.00, 15, 'Fruits', 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=1000&auto=format&fit=crop'],
            ['Mist-Grown Strawberries', 'Grown in pure mountain mist for delicate texture.', 2500.00, 25, 'Fruits', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=1000&auto=format&fit=crop'],
            ['Vertical Basil', 'Optimized for vertical farming. Grows perfectly straight.', 900.00, 100, 'Herbs', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?q=80&w=1000&auto=format&fit=crop'],
            ['Crystal Lettuce', 'Transparent leaves with a glass-like crunch.', 1200.00, 40, 'Vegetables', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=1000&auto=format&fit=crop'],
            ['Sun-Kissed Peppers', 'Absorbs 99% of solar radiation for spicy heat.', 1500.00, 60, 'Vegetables', 'https://images.unsplash.com/photo-1563565375-f3fdf5d6c465?q=80&w=1000&auto=format&fit=crop'],
            ['Heritage Carrots', 'Genetic lineage tracing back to the first domesticated root.', 500.00, 80, 'Vegetables', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1000&auto=format&fit=crop'],
            ['Eco-Kale', 'Carbon-negative greens that clean the air while growing.', 1600.00, 45, 'Vegetables', 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?q=80&w=1000&auto=format&fit=crop']
        ];

        for (const p of products) {
            // Check if exists
            const [exists] = await connection.query('SELECT id FROM products WHERE name = ?', [p[0]]);
            if (exists.length === 0) {
                await connection.query('INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)', p);
            }
        }

        // 4. Insert Dummy Events
        const events = [
            ['Composting 101', 'Learn the basics of turning waste into black gold.', '2025-06-15 10:00:00', 'Community Garden A', 'Workshop', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop'],
            ['Urban Farming Workshop', 'Master the art of growing food in small spaces.', '2025-07-20 14:00:00', 'Downtown Hub', 'Workshop', 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=1000&auto=format&fit=crop'],
            ['Seed Swap Meet', 'Exchange rare seeds with fellow enthusiasts.', '2025-08-05 09:00:00', 'Central Park Pavilion', 'Community', 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000&auto=format&fit=crop'],
            ['Rooftop Garden Tour', 'Explore the citys most innovative sky gardens.', '2025-09-10 16:00:00', 'Skyline Tower', 'Tour', 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000&auto=format&fit=crop']
        ];

        for (const e of events) {
            const [exists] = await connection.query('SELECT id FROM events WHERE title = ?', [e[0]]);
            if (exists.length === 0) {
                await connection.query('INSERT INTO events (title, description, date, location, category, image_url) VALUES (?, ?, ?, ?, ?, ?)', e);
            }
        }

        await connection.commit();
        res.json({ message: 'Database seeded successfully with Tables and Data!' });

    } catch (err) {
        await connection.rollback();
        console.error("❌ SEED ERROR:", err);
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};
