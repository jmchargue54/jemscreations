import { validationResult } from 'express-validator';
import { saveContactForm, deleteContactForm, getAllContactForms } from '../../models/forms/contact.js';

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

// process delete contact form 
const processDeleteContactForm = async (req, res) => {
    const formId = req.params.id;

    const deletedForm = await deleteContactForm(formId);
    if (!deletedForm) {
        req.flash('error', 'Failed to delete contact form.');
        console.log('Failed to delete contact form with id:', formId);
        return res.redirect('/contact/responses');
    }

    req.flash('success', 'Contact form deleted successfully!');
    console.log('Contact form deleted with id:', formId);
    res.redirect('/contact/responses');
}

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

export { showContactForm, processContactForm, processDeleteContactForm, showContactResponses };