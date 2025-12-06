import { getAllProducts } from "../models/products/products.js";

const addHomeSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/home.css">');
}

const homePage = (req, res) => {
    addHomeSpecificStyles(res);
    res.render('home', { 
        title: 'Welcome!', 
        getAllProducts: getAllProducts() 
    });
};

export { homePage };