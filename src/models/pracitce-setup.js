import db from './db.js';
import { hashPassword } from './forms/registration.js';

// SQL to create a contact_form table
const createContactTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS contact_form (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// SQL to create roles table
const createRolesTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        role_name VARCHAR(50) UNIQUE NOT NULL,
        role_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;


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

// SQL to add role_id column to users table if it doesn't exist
const addRoleIdToUsersIfNotExists = `
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'role_id'
        ) THEN
            ALTER TABLE users 
            ADD COLUMN role_id INTEGER REFERENCES roles(id);
        END IF;
    END $$;
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

// Create the roles table
const createRolesTable = async (verbose = true) => {
    try {
        await db.query(createRolesTableIfNotExists);
        if (verbose) {
            console.log('roles table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify roles table:', error);
        }
    }
};

// Add role_id column to users table
const addRoleIdColumnToUsers = async (verbose = true) => {
    try {
        await db.query(addRoleIdToUsersIfNotExists);
        if (verbose) {
            console.log('role_id column added to users table/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to add role_id column to users:', error);
        }
    }
};

// Seed roles and test users
const seedRolesAndUsers = async (verbose = true) => {
    try {
        // Check if roles exist
        const roleCheck = await db.query('SELECT COUNT(*) FROM roles');
        const roleCount = parseInt(roleCheck.rows[0].count);

        if (roleCount === 0) {
            // No roles exist, insert them
            await db.query(`
                INSERT INTO roles (role_name, role_description) VALUES 
                ('user', 'Standard user with basic access'),
                ('admin', 'Administrator with full system access')
            `);
            if (verbose) {
                console.log('Roles seeded: user and admin');
            }
        }

        // Get role IDs for seeding users
        const userRoleResult = await db.query(
            "SELECT id FROM roles WHERE role_name = 'user'"
        );
        const adminRoleResult = await db.query(
            "SELECT id FROM roles WHERE role_name = 'admin'"
        );

        const userRoleId = userRoleResult.rows[0].id;
        const adminRoleId = adminRoleResult.rows[0].id;

        // Update any existing users without a role_id to default user role
        const updateResult = await db.query(`
            UPDATE users 
            SET role_id = $1 
            WHERE role_id IS NULL
        `, [userRoleId]);

        if (verbose && updateResult.rowCount > 0) {
            console.log(`Updated ${updateResult.rowCount} existing user(s) to default role`);
        }

        // Check if admin user exists
        const adminCheck = await db.query(
            'SELECT COUNT(*) FROM users WHERE role_id = $1',
            [adminRoleId]
        );
        const adminCount = parseInt(adminCheck.rows[0].count);

        if (adminCount === 0) {
            // No admin exists, create one
            const hashedPassword = await hashPassword('Test1234!');
            await db.query(`
                INSERT INTO users (name, email, password, role_id) 
                VALUES ($1, $2, $3, $4)
            `, ['Admin User', 'admin@example.com', hashedPassword, adminRoleId]);
            if (verbose) {
                console.log('Admin user created: admin@example.com / Test1234!');
            }
        }

        // Check how many standard users exist
        const userCheck = await db.query(
            'SELECT COUNT(*) FROM users WHERE role_id = $1',
            [userRoleId]
        );
        const userCount = parseInt(userCheck.rows[0].count);

        if (userCount < 2) {
            // Create test users if fewer than 2 exist
            const hashedPassword = await hashPassword('Test1234!');
            const usersToCreate = 2 - userCount;

            for (let i = 0; i < usersToCreate; i++) {
                const userName = `Test User ${userCount + i + 1}`;
                const userEmail = `user${userCount + i + 1}@example.com`;

                await db.query(`
                    INSERT INTO users (name, email, password, role_id) 
                    VALUES ($1, $2, $3, $4)
                `, [userName, userEmail, hashedPassword, userRoleId]);
            }

            if (verbose) {
                console.log(`Created ${usersToCreate} test user(s) with password: Test1234!`);
            }
        }

    } catch (error) {
        if (verbose) {
            console.error('Failed to seed roles and users:', error);
        }
    }
};

/**
 * Runs SQL against your project database to setup anything you might need for your practice site.
 */
const setupUserTables = async (verbose = true) => {
    // Ensure contact_form table exists
    await insertContactForm(verbose);

    // Ensure roles table exists
    await createRolesTable(verbose);

    // Ensure users table exists
    await insertUsersTable(verbose);

    // Add role_id column to users table
    await addRoleIdColumnToUsers(verbose);

    // Seed roles and test users
    await seedRolesAndUsers(verbose);
};

export default setupUserTables;