import { body, validationResult } from 'express-validator';
import { saveContactForm, getAllContactForms } from '../../models/forms/contact.js';

/**
 * Validation rules for contact form submission
 */
const contactValidation = [
    body('subject')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Subject must be at least 2 characters long'),

    body('message')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Message must be at least 10 characters long')
];

/**
 * Display the contact form
 */
const showContactForm = (req, res) => {
    res.render('forms/contact/form', {
        title: 'Contact Us'
    });
};

/**
 * Process contact form submission
 */
const processContactForm = async (req, res) => {
    // Validate input
    const results = validationResult(req);

    if (!results.isEmpty()) {
        console.log('Validation errors:', results.array());
        return res.redirect('/contact');
    }

    const { subject, message } = req.body;

    // Save to DB
    const savedForm = await saveContactForm(subject, message);

    if (!savedForm) {
        console.log('Failed to save contact form.');
        return res.redirect('/contact');
    }

    console.log('Contact form saved:', savedForm);
    res.redirect('/contact');
};

/**
 * Display all contact form submissions
 */
const showContactResponses = async (req, res) => {
    const contactForms = await getAllContactForms();

    res.render('forms/contact/responses', {
        title: 'Contact Form Submissions',
        contactForms: contactForms
    });
};

export { showContactForm, processContactForm, showContactResponses, contactValidation };