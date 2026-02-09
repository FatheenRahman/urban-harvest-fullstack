const pool = require('../config/db');
const { productSchema } = require('../utils/validation');

exports.getAllProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query;
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        if (sort === 'price_asc') query += ' ORDER BY price ASC';
        else if (sort === 'price_desc') query += ' ORDER BY price DESC';
        else query += ' ORDER BY created_at DESC';

        const [products] = await pool.query(query, params);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(products[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { name, description, price, stock, category, image_url } = req.body;
        const [result] = await pool.query('INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)', [name, description, price, stock, category, image_url]);

        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { name, description, price, stock, category, image_url } = req.body;
        const [result] = await pool.query('UPDATE products SET name=?, description=?, price=?, stock=?, category=?, image_url=? WHERE id=?', [name, description, price, stock, category, image_url, req.params.id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product updated' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
