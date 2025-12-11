import db from '../db.js';

const saveNewProduct = async (imageFilename, name, description, price, tag, availability, soldAt) => {
    const query = `
        INSERT INTO products (image, name, description, price, tag, availability, sold_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, image, name, description, price, tag, availability, sold_at, created_at, updated_at
    `;

    try {
        const result = await db.query(query, [
            imageFilename,
            name,
            description,
            price,
            tag,
            availability,
            soldAt
        ]);
        return result.rows[0] || null;
    } catch (error) {
        console.error("DB Error:", error);
        return null;
    }
};

const getAllProductForms = async () => {
    const query = `
        SELECT id, image, name, description, price, tag, created_at, updated_at
        FROM products
        ORDER BY created_at DESC
    `;

    const result = await db.query(query);
    return result.rows;
};

// Retrieve a single product by ID
const getProductById = async (id) => {
    try {
        const query = `
            SELECT 
                id,
                image,
                name,
                description,
                price,
                tag,
                created_at
            FROM products
            WHERE id = $1
        `;

        const result = await db.query(query, [id]);
        return result.rows[0] || null;

    } catch (error) {
        console.error("DB Error in getProductById:", error);
        return null;
    }
};

const getAvailableProducts = async () => {
    const query = `
        SELECT id, image, name, description, price, tag, created_at, updated_at
        FROM products
        WHERE availability = 'in stock'
    `;
    const result = await db.query(query);
    return result.rows;
};

// update a product by ID
const updateProduct = async (id, { image, name, description, price, tag }) => {
    try {
        const query = `
            UPDATE products
            SET
                image = $1,
                name = $2,
                description = $3,
                price = $4,
                tag = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `;

        const values = [image, name, description, price, tag, id];
        const result = await db.query(query, values);

        return result.rows[0] || null;
    } catch (error) {
        console.error("DB Error in updateProduct:", error);
        return null;
    }
};

const markProductAsSold = async (id) => {
    try {
        const query = `
            UPDATE products
            SET
                availability = 'sold',
                sold_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
        const result = await db.query(query, [id]);

        return result.rows[0] || null;
    } catch (error) {
        console.error("DB Error in markProductAsSold:", error);
        return null;
    }
};

// delete a product by ID
const deleteProduct = async (id) => {
    try {
        const query = `DELETE FROM products WHERE id = $1`;
        const result = await db.query(query, [id]);

        return result.rowCount > 0;
    } catch (error) {
        console.error("DB Error in deleteProduct:", error);
        return false;
    }
};

const productCheck = async (id) => {
    try {
        const query = `
            SELECT availability FROM products WHERE id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows.length > 0;
    } catch (error) {
        console.error("DB Error in productCheck:", error);
        return false;
    }
};

export { 
    saveNewProduct, 
    getAllProductForms, 
    getProductById, 
    getAvailableProducts,
    updateProduct, 
    markProductAsSold,
    deleteProduct,
    productCheck
};
