import db from './db.js';

// SQL to create a contact_form table
const createContactTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS contact_form (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Execute the SQL to create a contact_form table
const insertContactForm = async (verbose = true) => {
    try {
        await db.query(createContactTableIfNotExists);
        if (verbose) {
            console.log('contact_form table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify contact_form table:', error);
        }
    }
};

// SQL to create a users table for registration system
const createUsersTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Execute the SQL to create users table
const insertUsersTable = async (verbose = true) => {
    try {
        await db.query(createUsersTableIfNotExists);
        if (verbose) {
            console.log('users table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify users table:', error);
        }
    }
};

/**
 * Runs SQL against your project database to setup anything you might need for your practice site.
 */
const setupPracticeDatabase = async (verbose = true) => {
    // Ensure contact_form table exists
    await insertContactForm(verbose);

    // Ensure users table exists
    await insertUsersTable(verbose);
};
export default setupPracticeDatabase;