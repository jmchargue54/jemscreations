import { validationResult } from 'express-validator';
import { 
    emailExists, 
    saveUser, 
    getAllUsers, 
    getUserById,
    updateUser,
    deleteUser
} from '../../models/forms/registration.js';
// import session from 'express-session';


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
    console.log("processing registration")

    // TODO: If errors exist, redirect back to registration form
    if (!errors.isEmpty()) {
        console.log('Validation errors during registration:', errors.array());
        req.flash('error', 'Please correct the errors in the form.');
        return res.redirect('/register')
    }
    
    // TODO: Extract first_name, last_name, email, password from req.body
    const { first_name, last_name, email, password } = req.body;
    
    // TODO: Check if email already exists using emailExists()
    const exists = await emailExists(email);
    // TODO: If email exists, log message and redirect back
    if (exists) {
        req.flash('error', `Account with email ${email} already exists`);
        console.log(`Registration attempt with existing email: ${email}`);
        return res.redirect('/register');
    } 
    
    // TODO: Save the user using saveUser()
    const saved = await saveUser(first_name, last_name, email, password);
    // TODO: If save fails, log error and redirect back
    if (!saved) {
        req.flash('error', 'Failed to save user during registration');
        console.log('Failed to save user during registration');
        return res.redirect('/register');
    }

    // TODO: If successful, log success and redirect (maybe to users list?)
    req.flash('success', `User registered successfully: ${email}`);
    console.log(`User registered successfully: ${email}`);
    return res.redirect('/login');
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
        users,
        session: req.session
    });
};

/**
 * Display the edit account form
 * Users can edit their own account, admins can edit any account
 */
const showEditAccountForm = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // TODO: Retrieve the target user from the database using getUserById
    const targetUser = await getUserById(targetUserId);

    // TODO: Check if the target user exists
    // If not, set flash message and redirect to /users
    // Flash message example:
    // req.session.flash = {
    //     type: 'error',
    //     message: 'User not found.'
    // };
    if (!targetUser) {
        req.flash('error', 'User could not be found.');
        return res.redirect('/users');
    }
    // TODO: Determine if current user can edit this account
    // Users can edit their own (currentUser.id === targetUserId)
    // Admins can edit anyone (currentUser.role_name === 'admin')
    const canEdit = (currentUser.id === targetUserId) || (currentUser.role_name === 'admin');

    // TODO: If current user cannot edit, set flash message and redirect
    // Flash message example:
    // req.session.flash = {
    //     type: 'error',
    //     message: 'You do not have permission to edit this account.'
    // };
    if (!canEdit) {
        req.flash('error', 'You do not have permission to edit this account.');
        console.log(`Unauthorized edit attempt by user ${currentUser.id} on user ${targetUserId}`);
        return res.redirect('/users');
    }

    // TODO: Render the edit form, passing the target user data
    addRegistrationStyles(res);
    res.render('forms/registration/edit', {
        title: 'Edit Account',
        user: targetUser
    });
};

/**
 * Process account edit form submission
 */
const processEditAccount = async (req, res) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        // req.flash('error', 'Please correct the errors in the form.');
        return req.session.save((err) => {
            if (err) { console.error('Session save error:', err); }
            return res.redirect(`/users/${req.params.id}/edit`);
        });
    }

    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;
    const { first_name, last_name, email } = req.body;

    // TODO: Retrieve the target user to verify they exist
    // If not found, set flash message and redirect to /users
    const targetUser = await getUserById(targetUserId);
    if (!targetUser) {
        req.flash('error', 'User not found.');
        return req.session.save((err) => {
            if (err) { console.error('Session save error:', err); }
            return res.redirect('/users');
        });
    }

    // TODO: Check edit permissions (same as showEditAccountForm)
    // If cannot edit, set flash message and redirect
    const canEdit = (currentUser.id === targetUserId) || (currentUser.role_name === 'admin');
    if (!canEdit) {
        req.flash('error', 'You do not have permission to edit this account.');
        return req.session.save((err) => {
            if (err) { console.error('Session save error:', err); }
            return res.redirect('/users');
        });
    }

    // TODO: Check if the new email already exists for a DIFFERENT user
    // Hint: You need to verify the email isn't taken by someone else,
    // but it's okay if it matches the target user's current email
    // If email is taken, set flash message and redirect back to edit form
    const emailTaken = await emailExists(email);
    if (emailTaken && email !== targetUser.email) {
        req.flash ('error', 'The provided email is already in use by another account.');
        return req.session.save((err) => {
            if (err) { console.error('Session save error:', err); }
            return res.redirect(`/users/${targetUserId}/edit`);
        });
    }
    // TODO: Update the user in the database using updateUser
    // If update fails, set flash message and redirect back to edit form
    const updatedUser = await updateUser(targetUserId, first_name, last_name, email);
    if (!updatedUser) {
        req.flash ('error', 'Failed to update the account. Please try again.');
        return req.session.save((err) => {
            if (err) { console.error('Session save error:', err); }
            return res.redirect(`/users/${targetUserId}/edit`);
        });
    }

    // TODO: If the current user edited their own account, update their session
    // Hint: Update req.session.user with the new name and email
    if (currentUser.id === targetUserId) {
        req.session.user.first_name = updatedUser.first_name;
        req.session.user.last_name = updatedUser.last_name;
        req.session.user.email = updatedUser.email;
    }

    // Success! Set flash message and redirect
    req.flash('success', 'Account updated successfully.');
    return req.session.save((err) => {
        if (err) { console.error('Session save error:', err); }
        // setTimeout(() => {
        //     res.redirect('/dashboard');
        // }, 100);
        return res.redirect('/dashboard');
    });
};

/**
 * Delete a user account (admin only)
 */
const processDeleteAccount = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // TODO: Verify current user is an admin
    // Only admins should be able to delete accounts
    // If not admin, set flash message and redirect
    if (currentUser.role_name !== 'admin') {
        req.flash('error', 'You do not have permission to delete accounts.');
        return res.redirect('/dashboard');
    }

    // TODO: Prevent admins from deleting their own account
    // If targetUserId === currentUser.id, set flash message and redirect
    // Flash message example:
    // req.session.flash = {
    //     type: 'error',
    //     message: 'You cannot delete your own account.'
    // };
    if (targetUserId === currentUser.id) {
        req.flash('error', 'You cannot delete your own account.');
        return res.redirect('/dashboard');
    }

    // TODO: Delete the user using deleteUser function
    // If delete fails, set flash message and redirect
    const deleted = await deleteUser(targetUserId);
    if (!deleted) {
        req.flash('error', 'Failed to delete the account. Please try again.');
        return res.redirect('/dashboard');
    }


    // Success! Set flash message and redirect
    req.flash('success', 'Account deleted successfully.');
    res.redirect('/users');
};

export { 
    showRegistrationForm, 
    processRegistration, 
    showAllUsers, 
    showEditAccountForm,
    processEditAccount,
    processDeleteAccount,
};