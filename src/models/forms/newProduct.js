import db from '../db.js';

const saveNewProduct = async (imageFilename, name, description, price, tag) => {
    const query = `
        INSERT INTO products (image, name, description, price, tag)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, image, name, description, price, tag, created_at, updated_at
    `;

    try {
        const result = await db.query(query, [
            imageFilename,
            name,
            description,
            price,
            tag
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

export { saveNewProduct, getAllProductForms };
