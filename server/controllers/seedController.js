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


        // 2. Clear Tables (Requested "Replace" functionality)
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE products');
        await connection.query('TRUNCATE TABLE events');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // 3. Insert Dummy Products
        const products = [
            ['Quantum Spinach', 'Spinach grown in absolute zero gravity with enhanced iron content.', 45.00, 20, 'Zero-G', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80'],
            ['Void Tomato', 'Perfectly spherical tomatoes grown in magnetic suspension fields.', 28.00, 15, 'Zero-G', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
            ['Nebula Berries', 'Blueberries that absorbed cosmic radiation for extra antioxidants.', 50.00, 10, 'Zero-G', 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80'],
            ['Mist-Grown Strawberries', 'Sweet aeroponic strawberries grown without a single grain of soil.', 15.00, 100, 'Hydroponic', 'https://images.unsplash.com/photo-1543158181-e6f9f6712055?auto=format&fit=crop&w=800&q=80'],
            ['Vertical Basil', 'Genovese basil stacked 50 layers high for maximum efficiency.', 5.00, 200, 'Hydroponic', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80'],
            ['Crystal Lettuce', 'Crunchy iceberg lettuce grown in purified mineral water.', 4.50, 150, 'Hydroponic', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80'],
            ['Sun-Kissed Peppers', 'Organic bell peppers grown in natural sunlight on Colombo rooftops.', 8.00, 60, 'Standard', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'],
            ['Heritage Carrots', 'Purple and orange carrots from heirloom seeds.', 6.00, 80, 'Standard', 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?auto=format&fit=crop&w=800&q=80'],
            ['Eco-Kale', 'Kale grown using composted organic waste.', 7.50, 55, 'Standard', 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=800&q=80']
        ];

        for (const p of products) {
            await connection.query('INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)', p);
        }

        // 4. Insert Dummy Events
        const events = [
            ['Anti-Gravity Farming Workshop', 'Learn the basics of farming in zero gravity environments.', '2026-03-15 10:00:00', 'Viharamahadevi Park, Colombo 07', 'Workshop', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'],
            ['Zero-G Taste Testing', 'Experience the unique flavors of space-grown produce.', '2026-03-20 18:00:00', 'Colombo Lotus Tower', 'Social', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80'],
            ['Future of Food Seminar', 'Experts discuss the next 50 years of agricultural technology.', '2026-04-01 09:00:00', 'BMICH, Colombo 07', 'Seminar', 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=800&q=80'],
            ['Hydroponics for Beginners', 'Start your own water-based garden at home.', '2026-03-10 14:00:00', 'Independence Square, Colombo 07', 'Workshop', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80'],
            ['Vertical Farm Tour', 'Guided tour of the citys largest vertical farming complex.', '2026-03-25 10:00:00', 'World Trade Center, Colombo 01', 'Tour', 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'],
            ['Nutrient Solution Masterclass', 'Perfecting your hydroponic nutrient mixes.', '2026-04-05 13:00:00', 'University of Colombo, Colombo 03', 'Workshop', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'],
            ['Rooftop Harvest Festival', 'Celebrate the season\'s bounty with music and food.', '2026-04-10 16:00:00', 'Cinnamon Grand Rooftop, Colombo 03', 'Festival', 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=800&q=80'],
            ['Composting Workshop', 'Turn organic waste into rich soil for your garden.', '2026-03-12 11:00:00', 'Diyatha Uyana, Battaramulla', 'Workshop', 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80'],
            ['Urban Beekeeping', 'The vital role of bees in urban agriculture.', '2026-03-18 09:00:00', 'Beddagana Wetland Park, Kotte', 'Workshop', 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=800&q=80']
        ];

        for (const e of events) {
            await connection.query('INSERT INTO events (title, description, date, location, category, image_url) VALUES (?, ?, ?, ?, ?, ?)', e);
        }

        await connection.commit();
        res.json({ message: 'Database RE-SEEDED with 9 NEW items! 🚀' });

    } catch (err) {
        await connection.rollback();
        console.error("❌ SEED ERROR:", err);
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};
