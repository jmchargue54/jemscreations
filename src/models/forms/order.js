import db from '../db.js';

// add to cart
const addToCart = async (userId, productId) => {
    try {
        // Ensure product is in stock
        const checkProduct = await db.query(
            `SELECT availability FROM products WHERE id = $1`, [productId]
        );

        if (checkProduct.rows.length === 0 || checkProduct.rows[0].availability !== 'in stock') {
            return null;
        }

        // Only allow one per user
        const exists = await db.query(
            `SELECT id FROM cart_items WHERE user_id = $1 AND product_id = $2`,
            [userId, productId]
        );

        if (exists.rows.length > 0) {
            return exists.rows[0];;
        }

        // Insert new cart item
        const insertQuery = `
            INSERT INTO cart_items (user_id, product_id)
            VALUES ($1, $2)
            RETURNING *
        `;
        const result = await db.query(insertQuery, [userId, productId]);
        return result.rows[0];

    } catch (error) {
        console.error("DB Error in addToCart:", error);
        return null;
    }
};

// get cart items for a user
const getCartItemsByUser = async (userId) => {
    try {
        const query = `
            SELECT ci.id, ci.product_id, p.name, p.price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = $1
        `;
        const result = await db.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error("DB Error in getCartItemsByUser:", error);
        return [];
    }
};

// remove cart item
const removeCartItem = async (cartItemId) => {
    try {
        const query = `DELETE FROM cart_items WHERE id = $1`;
        const result = await db.query(query, [cartItemId]);
        return result.rowCount > 0;
    } catch (error) {
        console.error("DB Error in removeCartItem:", error);
        return false;
    }
};

// order processing
const processOrder = async (userId, orderInfo, cartItems, total, status = "pending") => {
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        // Create order
        const orderQuery = `
            INSERT INTO orders (
                user_id, 
                first_name, last_name, email, phone, 
                address, city, state, zip, country, 
                venmo_confirmed, 
                total, 
                status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id
        `;
        const orderResult = await client.query(orderQuery, [ 
            userId, 
            orderInfo.first_name, 
            orderInfo.last_name, 
            orderInfo.email, 
            orderInfo.phone, 
            orderInfo.address, 
            orderInfo.city, 
            orderInfo.state, 
            orderInfo.zip, 
            orderInfo.country, 
            orderInfo.venmo_confirmed, 
            total, 
            status
        ]);

        const orderId = orderResult.rows[0].id;

        // Insert each order item
        for (const item of cartItems) {
            const itemQuery = `
                INSERT INTO order_items (order_id, product_id, price_each)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            await client.query(itemQuery, [
                orderId,
                item.product_id,
                item.price_each
            ]);
        }
        // clear cart after order
        await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);

        await client.query(
            `UPDATE products
             SET availability = 'sold', sold_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE id = ANY($1::int[])`,
            [cartItems.map(item => item.product_id)]
        )

        await client.query("COMMIT");
        return { orderId };

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("DB Error in processOrder:", error);
        return null;
    } finally {
        client.release();
    }
};

const getOrderById = async (orderId) => {
    try {
        const query = `
            SELECT 
                o.id AS order_id,
                o.user_id,
                o.total AS order_total,
                o.status,
                o.created_at,

                o.first_name,
                o.last_name,
                o.email,
                o.phone,
                o.address,
                o.city,
                o.state,
                o.zip,
                o.country,
                o.venmo_confirmed,

                oi.product_id,
                oi.price_each,

                p.name AS product_name,
                p.image AS product_image
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = $1
            ORDER BY oi.product_id;
        `;

        const result = await db.query(query, [orderId]);

        if (result.rows.length === 0) return null;

        // Build full order
        const row0 = result.rows[0];

        const order = {
            id: row0.order_id,
            user_id: row0.user_id,
            total: parseFloat(row0.order_total),
            status: row0.status,
            created_at: row0.created_at,
            first_name: row0.first_name,
            last_name: row0.last_name,
            email: row0.email,
            phone: row0.phone,
            address: row0.address,
            city: row0.city,
            state: row0.state,
            zip: row0.zip,
            country: row0.country,
            venmo_confirmed: row0.venmo_confirmed,
            items: []
        };

        result.rows.forEach(r => {
            if (r.product_id) {
                order.items.push({
                    product_id: r.product_id,
                    name: r.product_name,
                    image: r.product_image,
                    price_each: parseFloat(r.price_each),
                    line_total: parseFloat(r.price_each)
                });
            }
        });

        return order;

    } catch (error) {
        console.error("DB Error in getOrderById:", error);
        return null;
    }
};

const getOrdersByUser = async (userId) => {
    try {
        const query = `
            SELECT 
                id, total, status, created_at, completed_at
            FROM orders
            WHERE user_id = $1
            ORDER BY 
                CASE WHEN status = 'pending' THEN 0 ELSE 1 END,
                created_at DESC;
        `;

        const result = await db.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error("DB Error in getOrdersByUser:", error);
        return [];
    }
};

const showAllOrders = async (req, res) => {
    try {
        // const db = (await import('../db.js')).default;

        // Query to get EVERYTHING (orders, user info, items, product info)
        const query = `
            SELECT 
                o.id AS order_id,
                o.user_id,
                o.total AS order_total,
                o.status,
                o.completed_at,
                o.created_at,

                -- user information
                o.first_name,
                o.last_name,
                o.email,
                o.phone,
                o.address,
                o.city,
                o.state,
                o.zip,
                o.country,
                o.venmo_confirmed,

                -- item information
                oi.product_id,
                oi.price_each,

                -- product name + image
                p.name AS product_name,
                p.image AS product_image

            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            ORDER BY o.created_at DESC;
        `;

        const result = await db.query(query);

        // Build structure: one order with multiple items
        const ordersMap = {};

        result.rows.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    id: row.order_id,
                    user_id: row.user_id,
                    total: parseFloat(row.order_total).toFixed(2),
                    status: row.status,
                    created_at: row.created_at,
                    completed_at: row.completed_at,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    phone: row.phone,
                    address: row.address,
                    city: row.city,
                    state: row.state,
                    zip: row.zip,
                    country: row.country,
                    venmo_confirmed: row.venmo_confirmed,
                    items: []
                };
            }

            // If no item (ex: order created with no items yet), skip
            if (row.product_id) {
                ordersMap[row.order_id].items.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    product_image: row.product_image,
                    price_each: row.price_each,
                    line_total: row.price_each
                });
            }
        });
        const orders = Object.values(ordersMap);

        return orders;  
    } catch (error) {
        console.error("DB Error in showAllOrders:", error);
        return [];
    }

};
    
const completeOrder = async (orderId) => {
    try {
        await db.query(
            `UPDATE orders SET status = 'completed', updated_at = NOW() WHERE id = $1`,
            [orderId]
        );

        await db.query(
            `UPDATE orders
            SET status = 'completed', 
                completed_at = CURRENT_TIMESTAMP, 
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1`,
            [orderId]
        );
        return true;
    } catch (error) {
        console.error("DB Error in completeOrder:", error);
        return false;
    }   
};
export { 
    addToCart,
    getCartItemsByUser,
    removeCartItem,
    processOrder,
    getOrderById,
    getOrdersByUser,
    showAllOrders,
    completeOrder
};
