const pool = require('./config/db');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('admin123', salt);
        const userHash = await bcrypt.hash('user123', salt);

        await pool.query('DELETE FROM users');
        await pool.query('ALTER TABLE users AUTO_INCREMENT = 1');

        await pool.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', ['admin', 'admin@urbanharvest.com', adminHash, 'admin']);
        await pool.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', ['johndoe', 'john@example.com', userHash, 'user']);

        console.log('Users seeded');
    } catch (err) {
        console.error('Error seeding users:', err);
    }
};

const seedEvents = async () => {
    try {
        await pool.query('DELETE FROM events');
        await pool.query('ALTER TABLE events AUTO_INCREMENT = 1');

        const events = [
            {
                title: 'Urban Gardening Workshop',
                description: 'Learn how to grow your own food in limited space. Join us for a hands-on workshop on container gardening.',
                date: '2024-04-15 10:00:00',
                location: 'Community Center, 123 Main St',
                category: 'Workshop',
                image_url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Sustainable Living Fair',
                description: 'Explore eco-friendly products and learn about sustainable living practices from local experts.',
                date: '2024-05-20 09:00:00',
                location: 'City Park',
                category: 'Fair',
                image_url: 'https://images.unsplash.com/photo-1542601906990-24d4c16419d4?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Composting Masterclass',
                description: 'Turn your kitchen scraps into black gold! We will cover different composting methods suitable for apartments.',
                date: '2024-06-10 14:00:00',
                location: 'Green Hub',
                category: 'Workshop',
                image_url: 'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?auto=format&fit=crop&q=80&w=1000'
            }
        ];

        for (const event of events) {
            await pool.query('INSERT INTO events (title, description, date, location, category, image_url) VALUES (?, ?, ?, ?, ?, ?)', [event.title, event.description, event.date, event.location, event.category, event.image_url]);
        }
        console.log('Events seeded');
    } catch (err) {
        console.error('Error seeding events:', err);
    }
};

const runSeed = async () => {
    await seedUsers();
    await seedEvents();
    process.exit();
};

runSeed();
