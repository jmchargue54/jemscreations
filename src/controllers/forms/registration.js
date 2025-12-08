import { validationResult } from 'express-validator';
import { 
    emailExists, 
    saveUser, 
    getAllUsers, 
} from '../../models/forms/registration.js';


const addRegistrationStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
}

/**
 * Display the registration form
 */
const showRegistrationForm = (req, res) => {
    // TODO: Add registration-specific styles using res.addStyle()
    // TODO: Render the registration form view (forms/registration/form)
    addRegistrationStyles(res);

    res.render('forms/registration/form', {
        title: 'User Registration'
    });
};

/**
 * Process user registration submission
 */
const processRegistration = async (req, res) => {
    // TODO: Check for validation errors using validationResult(req)
    const errors = validationResult(req);

    // TODO: If errors exist, redirect back to registration form
    if (!errors.isEmpty()) {
        return res.redirect('/register')
    }
    
    // TODO: Extract name, email, password from req.body
    const { name, email, password } = req.body;
    
    // TODO: Check if email already exists using emailExists()
    const exists = await emailExists(email);
    // TODO: If email exists, log message and redirect back
    if (exists) {
        // req.flash('error', `Account with email ${email} already exists`);
        console.log(`Registration attempt with existing email: ${email}`);
        return res.redirect('/register');
    } 
    
    // TODO: Save the user using saveUser()
    const saved = await saveUser(name, email, password);
    // TODO: If save fails, log error and redirect back
    if (!saved) {
        // req.flash('error', 'Failed to save user during registration');
        console.log('Failed to save user during registration');
        return res.redirect('/register');
    }

    // TODO: If successful, log success and redirect (maybe to users list?)
    // req.flash('success', `User registered successfully: ${email}`);
    console.log(`User registered successfully: ${email}`);
    return res.redirect('/users');
};
    

/**
 * Display all registered users
 */
const showAllUsers = async (req, res) => {
    // TODO: Get all users using getAllUsers()
    const users = await getAllUsers();
    // TODO: Add registration-specific styles
    addRegistrationStyles(res);
    // TODO: Render the users list view (forms/registration/list) with the user data
    res.render('forms/registration/list', { 
        title: 'Registered Users',
        users
    });
};

export { 
    showRegistrationForm, 
    processRegistration, 
    showAllUsers, 
};