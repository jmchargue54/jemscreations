import { Router } from 'express';
const router = Router();

import upload from '../middleware/upload.js';
import { newProductValidation } from '../middleware/validation/newProduct.js';

import { 
    homePage 
    } from './home.js';
import { 
    productsPage, 
    productDetailPage 
    } from './products.js';
import { 
    showContactForm, 
    processContactForm, 
    showContactResponses, 
    } from './forms/contact.js';
import { 
    showNewProductForm,
    processNewProductForm,
    showAllNewProducts,
    showEditProductForm,
    processEditProduct,
    processDeleteProduct
    } from './forms/newProduct.js';
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
import {
    viewCart,
    handleAddToCart,
    handleRemoveFromCart
    } from './userPages/cart.js';
import {
    showCheckout,
    handleProcessOrder,
    showOrderConfirmation,
    showMyOrders,
    handleShowAllOrders,
    processCompleteOrder
    } from './forms/order.js';

// home and about page
router.get('/', homePage);

// products
router.get('/products', productsPage);
router.get('/products/:id', productDetailPage);

// create product
router.get('/createProduct', showNewProductForm);
router.post('/createProduct/list', upload.single("image"), newProductValidation, processNewProductForm);
router.get('/createProduct/list', showAllNewProducts);

// manage product
router.get('/createProduct/list/:id/edit', showEditProductForm);
router.post('/createProduct/list/:id/edit', upload.single("image"), newProductValidation, processEditProduct);
router.post('/createProduct/list/:id/delete', processDeleteProduct);

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

// cart
router.get('/cart', requireLogin, viewCart);
router.post('/cart/add', requireLogin, handleAddToCart);
router.post('/cart/remove', requireLogin, handleRemoveFromCart);

// order and checkout
router.get('/checkout', requireLogin, showCheckout);
router.post('/checkout', requireLogin, handleProcessOrder);
router.get('/orderConfirmation/:id', requireLogin, showOrderConfirmation);
router.get('/order/myOrders', requireLogin, showMyOrders);
router.get('/order/list', requireRole('admin'), handleShowAllOrders);
router.post('/order/list/:id/complete', requireRole('admin'), processCompleteOrder);

export default router;
