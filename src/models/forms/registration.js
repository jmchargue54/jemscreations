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
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's plain text password (will be hashed)
 * @returns {Promise<Object|null>} The saved user (without password) or null if failed
 */
const saveUser = async (name, email, password) => {
    try {
        // TODO: Hash the password using hashPassword function
        const hashedPassword = await hashPassword(password);

        const query = `
            INSERT INTO users (name, email, password, role_id)
            VALUES ($1, $2, $3, 1)
            RETURNING id, name, email, created_at, updated_at
        `;

        // TODO: Execute the query with the parameters and return the user data
        // HINT: Use the hashed password, not the plain text password
        const result = await db.query(query, [name, email, hashedPassword]);
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
            SELECT id, name, email, created_at, updated_at
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
                users.name,
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
 * @param {string} name - New name
 * @param {string} email - New email address
 * @returns {Promise<Object|null>} Updated user object or null if failed
 */
const updateUser = async (id, name, email) => {
    try {
        const query = `
            UPDATE users 
            SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING id, name, email, updated_at
        `;

        const result = await db.query(query, [name, email, id]);
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