import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import flash from './src/middleware/flash.js';
import { formatDateTime } from './utils/dateFormat.js';

// MVC components
import routes from './src/controllers/routes.js';
import globalMiddleware from './src/middleware/global.js';
import { setupDatabase, testConnection } from './src/models/setup.js';

/*
Server Configuration
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;
// setup express server
const app = express();

/* 
Configure Express
 */
// Initialize PostgreSQL session store
    const pgSession = connectPgSimple(session);

    // Trust first proxy
    app.set('trust proxy', 1); 


    // Configure session middleware
    const isDev = NODE_ENV.includes('dev');

    app.use(session({
    store: new pgSession({
        conString: process.env.DB_URL,
        tableName: 'session', // The name for our "sessions" table in the db
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: !isDev, // true in production (HTTPS), false in development (HTTP)
        httpOnly: true,
        sameSite: isDev ? 'lax' : 'none', // lax in dev, none in production
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// make date formatter available in EJS templates
app.locals.formatDateTime = formatDateTime;

// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src','views'));

console.log("CWD:", process.cwd());
console.log("DIRNAME:", __dirname);
console.log("VIEWS:", path.join(process.cwd(), "src", "views"));

/* 
Global Middleware
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
app.use('/', routes)

/* 
Error Handling
 */

// 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    // Log error details for debugging
    if (status === 404) {
        console.error('Error occurred:', err.message);
        console.error('Stack trace:', err.stack);
    }

    if (status === 500) {
        console.error('Server error:', err.message);
        console.error('Stack trace:', err.stack);
    }

    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
});

/* 
Development Tools
 */

// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

/*
Start Server
 */
import fs from 'fs';
console.log("FILES IN views/forms/orders:");
console.log(fs.readdirSync(path.join(process.cwd(), "src", "views", "forms", "order")));


app.listen(PORT, async () => {
    try {
        await testConnection();
        await setupDatabase();
        console.log(`Server is running on http://127.0.0.1:${PORT}`);
    } catch (error) {
        console.error('Database setup failed:', error.message);
        process.exit(1);
    }
});