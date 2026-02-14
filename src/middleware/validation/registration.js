import { body } from 'express-validator';

/**
 * Comprehensive validation rules for user registration
 */
const registrationValidation = [
    body('first_name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long'),

    body('last_name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('confirmEmail')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid confirmation email')
        .normalizeEmail()
        .custom((value, { req }) => {
            if (value !== req.body.email) {
                req.flash('error', 'Email addresses do not match');
                throw new Error('Email addresses do not match');
            }
            return true;
        }),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one number and one symbol (!@#$%^&*)'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                req.flash('error', 'Passwords do not match');
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

/**
 * Validation rules for account updates
 */
const updateAccountValidation = [
    body('first_name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long'),

    body('last_name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

export { 
    registrationValidation,
    updateAccountValidation
 };