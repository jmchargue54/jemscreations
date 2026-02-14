import db from '../db.js';
import bcrypt from 'bcrypt';

/**
 * Hash a plain text password using bcrypt
 * @param {string} plainPassword - The password to hash
 * @returns {Promise<string|null>} The hashed password or null if failed
 */
const hashPassword = async (plainPassword) => {
    try {
        // TODO: Use bcrypt.hash() with the password and salt rounds of 10
        // Return the hashed password
        const hashedPasswork = await bcrypt.hash(plainPassword, 10);
        return hashedPasswork;
    } catch (error) {
        console.error('Error hashing password:', error);
        return null;
    }
};

/**
 * Check if an email address is already registered
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email exists, false otherwise
 */
const emailExists = async (email) => {
    try {
        const query = 'SELECT COUNT(*) FROM users WHERE email = $1';
        const result = await db.query(query, [email]);

        // TODO: Return true if count > 0, false otherwise
        // HINT: result.rows[0].count will be a string, convert to number
        const count = parseInt(result.rows[0].count);
        if (count > 0) {
            return true;
        } 
        if ( count === 0 || null ) {
            return false;
        }

    } catch (error) {
        console.error('DB Error in emailExists:', error);
        return false; // Safe fallback - assume email doesn't exist
    }
};

/**
 * Save a new user registration to the database
 * @param {string} first_name - User's first name
 * @param {string} last_name - User's last name
 * @param {string} email - User's email address
 * @param {string} password - User's plain text password (will be hashed)
 * @returns {Promise<Object|null>} The saved user (without password) or null if failed
 */
const saveUser = async (first_name, last_name, email, password) => {
    try {
        // TODO: Hash the password using hashPassword function
        const hashedPassword = await hashPassword(password);
        if (!hashedPassword) {
            throw new Error('Failed to hash password');
            return null;
        }

        const query = `
            INSERT INTO users (first_name, last_name, email, password, role_id)
            VALUES ($1, $2, $3, $4, 1)
            RETURNING id, first_name, last_name, email, created_at, updated_at
        `;

        // TODO: Execute the query with the parameters and return the user data
        // HINT: Use the hashed password, not the plain text password
        const result = await db.query(query, [first_name, last_name, email, hashedPassword]);
        return result.rows[0];

    } catch (error) {
        console.error('DB Error in saveUser:', error);
        return null;
    }
};

/**
 * Retrieve all registered users (without passwords)
 * @returns {Promise<Array>} Array of user objects without passwords
 */
const getAllUsers = async () => {
    try {
        const query = `
            SELECT id, first_name, last_name, email, created_at, updated_at
            FROM users
            ORDER BY created_at DESC
        `;

        // TODO: Execute the query and return the rows
        const result = await db.query(query);
        return result.rows;

    } catch (error) {
        console.error('DB Error in getAllUsers:', error);
        return []; // Safe fallback
    }
};

/**
 * Retrieve a single user by ID with role information
 * @param {number} id - User ID to retrieve
 * @returns {Promise<Object|null>} User object with role or null if not found
 */
const getUserById = async (id) => {
    try {
        const query = `
            SELECT 
                users.id,
                users.first_name,
                users.last_name,
                users.email,
                users.created_at,
                roles.role_name
            FROM users
            INNER JOIN roles ON users.role_id = roles.id
            WHERE users.id = $1
        `;

        const result = await db.query(query, [id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('DB Error in getUserById:', error);
        return null;
    }
};

/**
 * Update a user's name and email
 * @param {number} id - User ID to update
 * @param {string} first_name - New first name
 * @param {string} last_name - New last name
 * @param {string} email - New email address
 * @returns {Promise<Object|null>} Updated user object or null if failed
 */
const updateUser = async (id, first_name, last_name, email) => {
    try {
        const query = `
            UPDATE users 
            SET first_name = $1, last_name = $2, email = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING id, first_name, last_name, email, updated_at
        `;

        const result = await db.query(query, [first_name, last_name, email, id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('DB Error in updateUser:', error);
        return null;
    }
};

/**
 * Delete a user account
 * @param {number} id - User ID to delete
 * @returns {Promise<boolean>} True if deleted, false if failed
 */
const deleteUser = async (id) => {
    try {
        const query = 'DELETE FROM users WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('DB Error in deleteUser:', error);
        return false;
    }
};


export { 
    hashPassword, 
    emailExists, 
    saveUser, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser 
};