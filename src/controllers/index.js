import { getAllProducts } from "../models/products/products.js";

const homePage = (req, res) => {
    res.render('home', { 
        title: 'Welcome!', 
        getAllProducts: getAllProducts() 
    });
};

export { homePage };