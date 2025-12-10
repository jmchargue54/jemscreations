import { getAllProductForms } from "../models/forms/newProduct.js";
const addHomeSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/home.css">');
}

const homePage = async (req, res) => {
    addHomeSpecificStyles(res);
    const products = await getAllProductForms();
    res.render('home', { 
        title: 'Welcome!', 
        getAllProducts: products 
    });
};

export { homePage };