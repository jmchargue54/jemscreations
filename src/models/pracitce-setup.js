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

/**
 * Runs SQL against your project database to setup anything you might need for your practice site.
 */
const setupPracticeDatabase = async (verbose = true) => {
    // Ensure contact_form table exists
    await insertContactForm(verbose);
};

export default setupPracticeDatabase;