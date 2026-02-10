const pool = require('../config/db');
const { eventSchema } = require('../utils/validation');

exports.getAllEvents = async (req, res) => {
    try {
        console.log("DB object (Event):", pool); // Verify DB object
        const { search, category, sort } = req.query;
        let query = 'SELECT * FROM events WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (title LIKE ? OR location LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        if (sort === 'date_asc') query += ' ORDER BY date ASC';
        else if (sort === 'date_desc') query += ' ORDER BY date DESC';
        else query += ' ORDER BY created_at DESC';

        const [events] = await pool.query(query, params);
        res.json(events);
    } catch (err) {
        console.error("❌ GET ALL EVENTS ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
        if (events.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json(events[0]);
    } catch (err) {
        console.error("❌ GET EVENT BY ID ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { error } = eventSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { title, description, date, location, category, image_url } = req.body;
        const [result] = await pool.query('INSERT INTO events (title, description, date, location, category, image_url) VALUES (?, ?, ?, ?, ?, ?)', [title, description, date, location, category, image_url]);

        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error("❌ CREATE EVENT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { error } = eventSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { title, description, date, location, category, image_url } = req.body;
        const [result] = await pool.query('UPDATE events SET title=?, description=?, date=?, location=?, category=?, image_url=? WHERE id=?', [title, description, date, location, category, image_url, req.params.id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Event not found' });
        res.json({ message: 'Event updated' });
    } catch (err) {
        console.error("❌ UPDATE EVENT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error("❌ DELETE EVENT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.registerForEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;

        const { fullName, email, contactNumber } = req.body;

        // Check if event exists
        const [event] = await pool.query('SELECT * FROM events WHERE id = ?', [eventId]);
        if (event.length === 0) return res.status(404).json({ error: 'Event not found' });

        // Check if already registered
        const [existing] = await pool.query('SELECT * FROM registrations WHERE user_id = ? AND event_id = ?', [userId, eventId]);
        if (existing.length > 0) return res.status(400).json({ error: 'Already registered for this event' });

        await pool.query('INSERT INTO registrations (user_id, event_id, full_name, email, contact_number) VALUES (?, ?, ?, ?, ?)', [userId, eventId, fullName, email, contactNumber]);
        res.status(201).json({ message: 'Registered successfully' });
    } catch (err) {
        console.error("❌ REGISTER EVENT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};
