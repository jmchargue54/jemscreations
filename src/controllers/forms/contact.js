const AddContactSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
}

const contactPage = (req, res) => {
    AddContactSpecificStyles(res);
    res.render('forms/contact', {
        title: 'Contact Us'
    });
};

export { contactPage };