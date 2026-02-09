const fs = require('fs');
const pool = require('./config/db');

const listProducts = async () => {
    try {
        const [products] = await pool.query('SELECT id, name, price FROM products');
        fs.writeFileSync('products_list.json', JSON.stringify(products, null, 2));
        console.log('Products written to products_list.json');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listProducts();
