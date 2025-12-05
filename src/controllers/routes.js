import { Router } from 'express';
import { homePage } from './index.js';
import { productsPage, productDetailPage } from './products.js';
import { loginPage } from './forms/login.js';
import { signupPage } from './forms/signup.js';
import { dashboardPage } from './userPages/dashboard.js';
import { cartPage } from './userPages/cart.js';

const router = Router();


// home and about page
router.get('/', homePage);

// products
router.get('/products', productsPage);
router.get('/products/:id', productDetailPage);

// login
router.get('/login', loginPage);

// signup page
app.get('/signup', signupPage);

// dashboard
app.get('/dashboard', dashboardPage);

// shopping cart
app.get('/cart', cartPage);

export default router;
