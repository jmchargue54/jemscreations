import { validationResult } from 'express-validator';
import { saveContactForm, getAllContactForms } from '../../models/forms/contact.js';

const addContactSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
}

/**
 * Display the contact form
 */
const showContactForm = (req, res) => {
    addContactSpecificStyles(res);
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
        req.flash('error', 'Failed to save contact form.');
        console.log('Failed to save contact form.');
        return res.redirect('/contact');
    }

    req.flash('success', 'Contact form submitted successfully!');
    console.log('Contact form saved:', savedForm);
    res.redirect('/contact');
};

/**
 * Display all contact form submissions
 */
const showContactResponses = async (req, res) => {
    addContactSpecificStyles(res);
    const contactForms = await getAllContactForms();

    res.render('forms/contact/responses', {
        title: 'Contact Form Submissions',
        contactForms: contactForms
    });
};

export { showContactForm, processContactForm, showContactResponses };