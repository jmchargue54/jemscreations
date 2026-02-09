import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load CA certificate required by hosting provider
const caCert = fs.readFileSync(
    path.join(__dirname, '../../byuicse-psql-cert.pem')
);

/**
 * Base PostgreSQL connection pool (SSL REQUIRED)
 */
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        ca: caCert,
        rejectUnauthorized: true,
        checkServerIdentity: () => undefined
    }
});

// Force all DB connections to Pacific Time
pool.on('connect', (client) => {
    client.query("SET TIME ZONE 'America/Los_Angeles';");
});

/**
 * Optional query logging in development
 */
let db;

if (process.env.NODE_ENV?.includes('dev') && process.env.ENABLE_SQL_LOGGING === 'true') {
    db = {
        async query(text, params) {
            const start = Date.now();
            try {
                const res = await pool.query(text, params);
                const duration = Date.now() - start;
                console.log('Executed query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    duration: `${duration}ms`,
                    rows: res.rowCount
                });
                return res;
            } catch (error) {
                console.error('Query error:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    error: error.message
                });
                throw error;
            }
        },
        async close() {
            await pool.end();
        }
    };
} else {
    db = pool;
}

export { pool };
export default db;
