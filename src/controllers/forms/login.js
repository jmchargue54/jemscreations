import { validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { getUserById } from '../../models/forms/registration.js';

const addLoginSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
}

/**
 * Display the login form
 */
const showLoginForm = (req, res) => {
    addLoginSpecificStyles(res);

    res.render('forms/login/login', {
        title: 'User Login'
    });
};

/**
 * Process login form submission
 */
const processLogin = async (req, res) => {
    // Check for validation errors using validationResult(req)
    const errors = validationResult(req);
    // If errors exist, redirect back to login form
    if (!errors.isEmpty()) {
        return res.redirect('/login');
    }

    // Extract email and password from req.body
    const { email, password } = req.body;

    // Find user by email using findUserByEmail()
    const user = await findUserByEmail(email);
    // If user not found, log "User not found" and redirect back
    if (!user) {
        req.flash('error', 'User not found');
        console.log('User not found');
        return res.redirect('/login');
    }

    const userPassword = user.password;
    // Verify password using verifyPassword()
    const passwordMatch = await verifyPassword(password, userPassword);
    // const passwordValid = await verifyPassword(password, user.password);

    // If password incorrect, log "Invalid password" and redirect back
    if (!passwordMatch) {
        req.flash('error', 'Invalid password');
        console.log('Invalid password');
        return res.redirect('/login');
    }

    // SECURITY: Remove the password from the user object first!
    user.password = null;
    delete user.password;

    // Store user information in session: req.session.user = user object (without password)
    req.session.user = user;
    req.session.userId = user.id;
    
    console.log("SESSION USER AFTER LOGIN:", req.session.user);

    res.redirect('/?login=success');
};

/**
 * Handle user logout
 */
const processLogout = (req, res) => {
    // First, check if there is a session object on the request
    if (!req.session) {
        return res.redirect('/');
    }


    // Call destroy() to remove this session from the store (Postgres in our case)
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
            res.clearCookie('connect.sid');
            return res.redirect('/');
        }

        // If session destruction succeeded, clear the session cookie from the browser
        res.clearCookie('connect.sid');

        // Redirect the user to the home page
        res.redirect('/?logout=success');
    });
};

/**
 * Display protected dashboard (requires login)
 */
const showDashboard = async (req, res) => {
    const sessionUser = req.session.user;

    if (!sessionUser) {
        req.flash('error', 'You must be logged in to access the dashboard');
        return req.session.save((err) => {
            if (err) { console.error('Session save error:', err); }
            res.redirect('/login');
        });
    }

    const freshUser = await getUserById(sessionUser.id);

    if (!freshUser.password) {
        delete freshUser.password;
    }

    addLoginSpecificStyles(res);
    console.log("SESSION USER:", req.session.user);

    res.render('forms/login/dashboard', {
        title: 'User Dashboard',
        user: freshUser,
        sessionData: req.session,
    });
};

export { 
    showLoginForm, 
    processLogin, 
    processLogout, 
    showDashboard, 
};