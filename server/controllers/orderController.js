const pool = require('../config/db');

exports.createOrder = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const buyerId = req.user.id;
        const { items, fullName, email, contactNumber, address } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in order' });
        }

        let totalAmount = 0;
        const orderItems = [];

        // Validate stock and calculate total
        for (const item of items) {
            const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [item.productId]);
            if (products.length === 0) {
                await connection.rollback();
                connection.release();
                return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
            }
            const product = products[0];

            if (product.stock_quantity < item.quantity) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }

            totalAmount += product.price * item.quantity;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Create Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (buyer_id, total_amount, status, full_name, email, contact_number, shipping_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [buyerId, totalAmount, 'processed', fullName, email, contactNumber, address]
        );
        const orderId = orderResult.insertId;

        // Create Order Items and Update Stock
        for (const item of orderItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [orderId, item.productId, item.quantity, item.price]
            );
            await connection.query(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, item.productId]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order placed successfully', orderId });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error("❌ CREATE ORDER ERROR:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
};
