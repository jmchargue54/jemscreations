import { getAllProducts, getSortedFilteredProducts } from "../models/products/products.js";

const productsPage = async (req, res) => {
    const sortBy = req.query.sortBy || 'default';
    let tags = req.query.tag;
    const products = await getSortedFilteredProducts(getAllProducts(), sortBy, tags);
    
    res.render('products/products', { 
        title: "Products", 
        products,
        currentSort: sortBy,
        currentTags: tags || []
    });
};

const productDetailPage = (req, res, next) => {
    const productId = parseInt(req.params.id);
    const product = getAllProducts.find(p => p.id === productId);

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
        products: getAllProducts()
    });
};

export { productsPage, productDetailPage };