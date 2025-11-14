import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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

/* 
Routes
 */
app.get('/', (req, res) => {
    const title = 'Jems Creations Home';
    res.render('home', { title });
});

app.get('/products', (req, res) => {
    const title = 'Our Products';
    res.render('products', { title });
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