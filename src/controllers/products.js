import { getSortedFilteredProducts } from "../models/products/products.js";
import { getAvailableProducts } from "../models/forms/newProduct.js";

const addProductSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/products.css">');
};

const productsPage = async (req, res) => {
    addProductSpecificStyles(res);
    const sortBy = req.query.sortBy || 'default';
    let tags = req.query.tag;

    const productsArray = await getAvailableProducts();
    const products = await getSortedFilteredProducts(productsArray, sortBy, tags);
    
    res.render('products/products', { 
        title: "Products", 
        products,
        currentSort: sortBy,
        currentTags: tags || []
    });
};

const productDetailPage = async (req, res, next) => {
    const productId = parseInt(req.params.id);
    const allProducts = await getAvailableProducts();
    const product = await allProducts.find(p => p.id === productId);

    if (!product) {
        const err = new Error('Product Not Found');
        err.status = 404;
        return next(err);
    }

    // log parameter for debugging
    console.log('Product found:', product);

    // Render product detail page
    res.render('productDetail', { 
        title: product.name, 
        product: product,
        products: await getAvailableProducts()
    });
};

export { productsPage, productDetailPage };