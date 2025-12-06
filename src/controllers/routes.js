import { Router } from 'express';
const router = Router();

import { homePage } from './home.js';
import { productsPage, productDetailPage } from './products.js';
import { loginPage } from './forms/login.js';
import { signupPage } from './forms/signup.js';
import { dashboardPage } from './userPages/dashboard.js';
import { cartPage } from './userPages/cart.js';
import { contactPage, processContactForm, showContactResponses, contactValidation } from './forms/contact.js';
import { createProductPage } from './forms/createProject.js';

// home and about page
router.get('/', homePage);

// products
router.get('/products', productsPage);
router.get('/products/:id', productDetailPage);

// create product
router.get('/createProduct', createProductPage);

// login and signup
router.get('/login', loginPage);
router.get('/signup', signupPage);

// contact
router.get('/contact', contactPage);
router.post('/contact', contactValidation, processContactForm);
router.get('/contact/responses', showContactResponses);

// dashboard
router.get('/dashboard', dashboardPage);

// shopping cart
router.get('/cart', cartPage);

export default router;
