import db from './db.js';

// SQL to create the products table if it doesn't exist
const createProductsTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        image VARCHAR(300) NOT NULL,
        name VARCHAR(200) NOT NULL,
        description VARCHAR(500) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        tag VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

// SQL to create cart items table if it doesn't exist
const createCartItemsTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        product_id INTEGER NOT NULL REFERENCES products(id),
        quantity INTEGER DEFAULT 1
    )
`;

// SQL to create orders table if it doesn't exist
const createOrdersTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

// SQL to create order items table if it doesn't exist
const createOrderItemsTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id),
        product_id INTEGER NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        price_each DECIMAL(10, 2) NOT NULL
    )
`;

const insertProductTable = async (verbose = true) => {
    try {
        await db.query(createProductsTableIfNotExists);
        if (verbose) {
            console.log('contact_form table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify contact_form table:', error);
        }
    }
};

const insertCartItemsTable = async (verbose = true) => {
    try {
        await db.query(createCartItemsTableIfNotExists);
        if (verbose) {
            console.log('contact_form table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify contact_form table:', error);
        }
    }
};

const insertOrdersTable = async (verbose = true) => {
    try {
        await db.query(createOrdersTableIfNotExists);
        if (verbose) {
            console.log('contact_form table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify contact_form table:', error);
        }
    }
};

const insertOrderItemsTable = async (verbose = true) => {
    try {
        await db.query(createOrderItemsTableIfNotExists);
        if (verbose) {
            console.log('contact_form table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify contact_form table:', error);
        }
    }
};


const setupStoreTables = async (verbose = true) => {
    await insertProductTable(verbose);
    await insertCartItemsTable(verbose);
    await insertOrdersTable(verbose);
    await insertOrderItemsTable(verbose);
};

export default setupStoreTables;