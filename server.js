import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import flash from './src/middleware/flash.js';
import globalMiddleware from './src/middleware/global.js';
import routes from './src/controllers/routes.js';
import { formatDateTime } from './utils/dateFormat.js';

import { setupDatabase, testConnection } from './src/models/setup.js';
import { pool } from './src/models/db.js';

/*
Server setup
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const isDev = NODE_ENV.includes('dev');

const app = express();

/*
Sessions (PostgreSQL-backed, SSL-safe)
*/
const PgSession = connectPgSimple(session);

app.set('trust proxy', 1);

app.use(session({
    store: new PgSession({
        pool,                      // ✅ USE SSL POOL
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: !isDev,
        httpOnly: true,
        sameSite: isDev ? 'lax' : 'none',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

/*
Express config
*/
app.locals.formatDateTime = formatDateTime;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));

/*
Middleware
*/
app.use(flash);
app.use(globalMiddleware);

app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.user;
    res.locals.user = req.session.user || null;
    next();
});

/*
Routes
*/
app.use('/', routes);

/*
Errors
*/
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    console.error(err.message);
    if (err.stack) console.error(err.stack);

    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: isDev ? err.stack : null
    });
});

/*
Start server
*/
app.listen(PORT, async () => {
    try {
        await testConnection();
        await setupDatabase();
        console.log(`Server running at http://127.0.0.1:${PORT}`);
    } catch (error) {
        console.error('Database setup failed:', error.message);
        process.exit(1);
    }
});
