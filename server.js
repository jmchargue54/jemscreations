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
    res.locals.env = NODE_ENV.toLocaleLowerCase() || 'production';
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



/*
Start the server and listen on the specified port
 */
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});