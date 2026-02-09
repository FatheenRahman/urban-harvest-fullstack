require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function resetDatabase() {
    console.log("🚀 Starting Urban Harvest Hub Database Reset...");

    try {
        // 1. Generate the Secure Hash (Password: password123)
        const plainPassword = 'password123';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        console.log(`🔒 Password '${plainPassword}' encrypted successfully.`);

        // 2. Connect to MySQL
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        // 3. The Master SQL Query
        const sql = `
            DROP DATABASE IF EXISTS urban_harvest_hub;
            CREATE DATABASE urban_harvest_hub;
            USE urban_harvest_hub;

            -- ==========================
            -- 1. CREATE TABLES
            -- ==========================

            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('scientist', 'grower', 'buyer') DEFAULT 'buyer',
                lab_location VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                grower_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                category ENUM('standard', 'hydroponic', 'zero_g', 'low_g') DEFAULT 'standard',
                gravity_level DECIMAL(5, 4) DEFAULT 1.0, 
                magnetic_field_tesla DECIMAL(5, 2) DEFAULT 0.0,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                stock_quantity INT NOT NULL DEFAULT 0,
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (grower_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                organizer_id INT NOT NULL,
                title VARCHAR(150) NOT NULL,
                description TEXT,
                event_date DATETIME NOT NULL,
                location VARCHAR(255),
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                buyer_id INT NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                status ENUM('pending', 'processed', 'shipped') DEFAULT 'pending',
                full_name VARCHAR(100),
                email VARCHAR(100),
                contact_number VARCHAR(20),
                shipping_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                price_at_purchase DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );

            CREATE TABLE registrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                event_id INT NOT NULL,
                full_name VARCHAR(100),
                email VARCHAR(100),
                contact_number VARCHAR(20),
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
                UNIQUE(user_id, event_id)
            );

            -- ==========================
            -- 2. SEED USERS
            -- ==========================
            INSERT INTO users (username, email, password_hash, role, lab_location) VALUES 
            ('Fatheen', 'fatheen@urbanharvest.com', '${hashedPassword}', 'scientist', 'Colombo Port City Lab'),
            ('Haseeb', 'haseeb@skynet.com', '${hashedPassword}', 'grower', 'Trace Expert City, Maradana'),
            ('Munsif', 'munsif@invest.com', '${hashedPassword}', 'buyer', 'Havelock City, Colombo 05'),
            ('Zainab', 'zainab@bio.com', '${hashedPassword}', 'scientist', 'Lotus Tower Research Wing'),
            ('Shahani', 'shahani@eco.com', '${hashedPassword}', 'grower', 'Crescat Boulevard Rooftop');

            -- ==========================
            -- 3. SEED PRODUCTS (9 Items)
            -- ==========================
            INSERT INTO products (grower_id, name, category, gravity_level, magnetic_field_tesla, price, stock_quantity, description, image_url) VALUES 
            -- Fatheen's Zero-G Lab
            (1, 'Quantum Spinach', 'zero_g', 0.0000, 8.50, 45.00, 20, 'Spinach grown in absolute zero gravity with enhanced iron content.', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80'),
            (1, 'Void Tomato', 'zero_g', 0.0000, 5.50, 28.00, 15, 'Perfectly spherical tomatoes grown in magnetic suspension fields.', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'),
            (1, 'Nebula Berries', 'zero_g', 0.0000, 6.20, 50.00, 10, 'Blueberries that absorbed cosmic radiation for extra antioxidants.', 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80'),

            -- Haseeb's Hydroponics
            (2, 'Mist-Grown Strawberries', 'hydroponic', 1.0000, 0.00, 15.00, 100, 'Sweet aeroponic strawberries grown without a single grain of soil.', 'https://images.unsplash.com/photo-1543158181-e6f9f6712055?auto=format&fit=crop&w=800&q=80'),
            (2, 'Vertical Basil', 'hydroponic', 1.0000, 0.00, 5.00, 200, 'Genovese basil stacked 50 layers high for maximum efficiency.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80'),
            (2, 'Crystal Lettuce', 'hydroponic', 1.0000, 0.00, 4.50, 150, 'Crunchy iceberg lettuce grown in purified mineral water.', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80'),

            -- Shahani's Sustainable/Standard
            (5, 'Sun-Kissed Peppers', 'standard', 1.0000, 0.00, 8.00, 60, 'Organic bell peppers grown in natural sunlight on Colombo rooftops.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'),
            (5, 'Heritage Carrots', 'standard', 1.0000, 0.00, 6.00, 80, 'Purple and orange carrots from heirloom seeds.', 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?auto=format&fit=crop&w=800&q=80'),
            (5, 'Eco-Kale', 'standard', 1.0000, 0.00, 7.50, 55, 'Kale grown using composted organic waste.', 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=800&q=80');

            -- ==========================
            -- 4. SEED EVENTS (9 Items)
            -- ==========================
            INSERT INTO events (organizer_id, title, description, event_date, location, image_url) VALUES
            -- Fatheen's Events
            (1, 'Anti-Gravity Farming Workshop', 'Learn how to grow spinach in zero-g environments.', '2026-03-15 10:00:00', 'Viharamahadevi Park, Colombo 07', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'),
            (1, 'Zero-G Taste Testing', 'Experience the unique texture of space-grown produce.', '2026-03-20 18:00:00', 'Colombo Lotus Tower, Colombo 10', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80'),
            (1, 'Future of Food Seminar', 'Dr. Fatheen discusses food security in space colonies.', '2026-04-01 09:00:00', 'BMICH, Colombo 07', 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=800&q=80'),

            -- Haseeb's Events
            (2, 'Hydroponics for Beginners', 'Master the art of soil-less gardening.', '2026-03-10 14:00:00', 'Independence Square, Colombo 07', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80'),
            (2, 'Vertical Farm Tour', 'Walk through our 50-story vertical farm towers.', '2026-03-25 10:00:00', 'World Trade Center, Colombo 01', 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'),
            (2, 'Nutrient Solution Masterclass', 'Learn to mix the perfect chemical balance for crops.', '2026-04-05 13:00:00', 'University of Colombo, Colombo 03', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'),

            -- Shahani's Events
            (5, 'Rooftop Harvest Festival', 'Celebrate the season with fresh rooftop vegetables.', '2026-04-10 16:00:00', 'Cinnamon Grand Rooftop, Colombo 03', 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=800&q=80'),
            (5, 'Composting Workshop', 'Turn your kitchen scraps into black gold.', '2026-03-12 11:00:00', 'Diyatha Uyana, Battaramulla', 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80'),
            (5, 'Urban Beekeeping', 'Learn how to keep bees in a city environment.', '2026-03-18 09:00:00', 'Beddagana Wetland Park, Kotte', 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=800&q=80');

            -- ==========================
            -- 5. SEED ORDERS
            -- ==========================
            INSERT INTO orders (buyer_id, total_amount, status) VALUES (3, 90.00, 'processed');
            INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (1, 1, 2, 45.00);
        `;

        // 4. Execute Query
        await connection.query(sql);
        console.log("✅ Database Reset Successfully!");
        console.log("✅ Added: 9 Products and 9 Events with Images.");

        await connection.end();
        process.exit();

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

resetDatabase();