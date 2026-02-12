/* eslint-disable max-len */
import db from './db.js';
import setupStoreTables from './setupProducts.js';
import setupUserTables from './pracitce-setup.js';

// Check if all four tables are present in the current schema
const allTablesExist = async() => {
    const tables = ['departments', 'catalog', 'courses', 'faculty', 'orders', 'cart-items'];
    const res = await db.query(
        `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = ANY($1)
        `,
        [tables]
    );
    return res.rowCount === tables.length;
};


// Check if the database has been initialized already
const isAlreadyInitialized = async(verbose = true) => {
    if (verbose) {
        console.log('Checking existing schema & seed…');
    }

    const tablesOk = await allTablesExist();
    if (!tablesOk) {
        return false;
    }

    const rowsOk = await lastSeedRowsExist();
    return rowsOk;
};

/**
 * Sets up the database by creating tables and inserting initial data.
 * This function should be called when the server starts.
 */
const setupDatabase = async() => {
    const verbose = process.env.ENABLE_SQL_LOGGING === 'true';

    try {
        // Skip everything if schema + last seed rows are present
        if (await isAlreadyInitialized(verbose)) {
            if (verbose) console.log('DB already initialized — skipping setup.');
            return true;
        }

        if (verbose) console.log('Setting up database…');

        // setup Store tables
        await setupStoreTables(verbose);

        // setup User tables
        await setupUserTables(verbose);

        if (verbose) {
            console.log('Database setup complete');
        }
        return true;
    } catch (error) {
        console.error('Error setting up database:', error.message);
        throw error;
    }
};

/**
 * Tests the database connection by executing a simple query.
 */
const testConnection = async() => {
    try {
        const result = await db.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

export { setupDatabase, testConnection };
