import { Router } from 'express';
const router = Router();

import { 
    homePage 
    } from './home.js';
import { 
    productsPage, 
    productDetailPage 
    } from './products.js';
import { 
    cartPage 
    } from './userPages/cart.js';
import { 
    showContactForm, 
    processContactForm, 
    showContactResponses,  
    } from './forms/contact.js';
import { 
    createProductPage 
    } from './forms/createProduct.js';
import { 
    showRegistrationForm, 
    processRegistration, 
    showAllUsers,
    showEditAccountForm,
    processEditAccount, 
    processDeleteAccount
    } from './forms/registration.js';
import { 
    requireLogin,
    requireRole
    } from '../middleware/auth.js';
import {
    contactValidation
    } from '../middleware/validation/contact.js';
import { 
    showLoginForm, 
    processLogin, 
    processLogout, 
    showDashboard 
    } from './forms/login.js';
import { 
    registrationValidation, 
    updateAccountValidation 
    } from '../middleware/validation/registration.js';
import { 
    loginValidation 
    } from '../middleware/validation/login.js';

// home and about page
router.get('/', homePage);

// products
router.get('/products', productsPage);
router.get('/products/:id', productDetailPage);

// create product
router.get('/createProduct', createProductPage);

// User registration routes
router.get('/register', showRegistrationForm);
router.post('/register', registrationValidation, processRegistration);
router.get('/users', showAllUsers);

// login and logout
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLogin);
router.get('/logout', processLogout);

// dashboard
router.get('/dashboard', requireLogin, showDashboard);

// Account management routes
router.get('/users/:id/edit', requireLogin, showEditAccountForm);
router.post('/users/:id/update', requireLogin, updateAccountValidation, processEditAccount);
router.post('/users/:id/delete', requireRole('admin'), processDeleteAccount);

// contact
router.get('/contact', showContactForm);
router.post('/contact', contactValidation, processContactForm);
router.get('/contact/responses', showContactResponses);

// shopping cart
router.get('/cart', requireLogin, cartPage);

export default router;
