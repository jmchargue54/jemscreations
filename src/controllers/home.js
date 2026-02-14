import { getAvailableProducts } from "../models/forms/newProduct.js";
const addHomeSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/home.css">');
}

const homePage = async (req, res) => {
    if (req.query.logout === 'success') {
        req.flash('success', 'Logged out successfully');
    }
    if (req.query.login === 'success') {
        req.flash('success', 'Login successful!');
    }
    addHomeSpecificStyles(res);
    const products = await getAvailableProducts();
    res.render('home', { 
        title: 'Welcome!', 
        getAllProducts: products 
    });
};

export { homePage };