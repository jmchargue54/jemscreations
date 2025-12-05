import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './src/controllers/routes.js';

/* 
Variables
 */
const name = process.env.NAME || 'World';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

/* 
Configure Middleware
 */

// static files
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set ('views', path.join(__dirname, 'src/views'));

/* 
Global middleware
 */
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLocaleLowerCase() || 'production';
    next();
});

// Add current year for copyright
app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    next();
});

// share query parameters with templates
app.use((req, res, next) => {
    res.locals.queryParams = req.query;

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
    // Log error details for debugging
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
});

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
Start the server and listen on the specified port
 */
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});