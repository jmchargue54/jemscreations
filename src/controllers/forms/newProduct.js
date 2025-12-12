import { validationResult } from "express-validator";
import { 
    saveNewProduct, 
    getAllProductForms,
    getProductById,
    updateProduct,
    deleteProduct 
    } from "../../models/forms/newProduct.js";
import { getSortedFilteredProducts } from "../../models/products/products.js";

const addNewProductSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/newProduct.css">');
};

const addcreateProductSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/createProduct.css">');
}

/**
 * Display the new product form
 */
const showNewProductForm = (req, res) => {
    addcreateProductSpecificStyles(res);
    res.render("forms/newProducts/createProduct", {
        title: "Add New Product",
    });
};

/**
 * Process new product form submission
 */
const processNewProductForm = async (req, res) => {
    console.log("processNewProductForm called");
    // Validate input
    const results = validationResult(req);
    
    if (!results.isEmpty()) {
        console.log("Validation errors:", results.array());
        return res.redirect("/createProduct");
    }

    const { name, description, price, tag, availability, soldAt } = req.body;
    console.log('file: ', req.file);
    const imageFilename = req.file ? `/uploads/${req.file.filename}` : null;

    // Save to DB
    const savedProductForm = await saveNewProduct(
        imageFilename,
        name,
        description,
        price,
        tag,
        availability,
        soldAt
    );

    if (!savedProductForm) {
        req.flash("error", "Failed to save new product.");
        console.log("Failed to save new product.");
        return res.redirect("/createProduct/list");
    }

    req.flash("success", "New product added successfully!");
    console.log("New product saved:", savedProductForm);
    res.redirect("/createProduct/list");
};

/**
 * Display all new product form submissions
 */
const showAllNewProducts = async (req, res) => {
    addNewProductSpecificStyles(res);
    const sortBy = req.query.sortBy || 'default';
    let tags = req.query.tag || [];
    if (!Array.isArray(tags)) {
        tags = [tags];
    }
    
    const productsArray = await getAllProductForms();
    const products = await getSortedFilteredProducts(productsArray, sortBy, tags);


    res.render("forms/newProducts/list", {
        title: "New Product Submissions",
        products,
        currentSort: sortBy,
        currentTags: tags || []
    });
}

const showEditProductForm = async (req, res) => {
    addcreateProductSpecificStyles(res);
    const productId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // Retrieve the product to edit
    const product = await getProductById(productId);

    // Check if the product exists
    if (!product) {
        req.flash('error', 'Product not found');
        console.log(`Product with ID ${productId} not found for editing`);
        return res.redirect('/createProduct/list');
    }

    // Only admins can edit products
    if (currentUser.role_name !== 'admin') {
        req.flash('error', 'Unauthorized to edit product');
        console.log(`Unauthorized edit attempt by user ID ${currentUser.id} on product ID ${productId}`);
        return res.redirect('/createProduct/list');
    }

    res.render(`forms/newProducts/edit`, {
        title: 'Edit Product',
        product
    });
};

const processEditProduct = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.redirect(`/createProduct/list/${req.params.id}/edit`);
    }

    const productId = parseInt(req.params.id);
    const currentUser = req.session.user;
    const product = await getProductById(productId);

    // Ensure product exists
    if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect('/createProduct/list');
    }

    // Only admins can edit products
    if (currentUser.role_name !== 'admin') {
        req.flash('error', 'Unauthorized to edit product');
        return res.redirect('/createProduct/list');
    }

    // Extract updated fields
    const { name, description, price, tag, availability } = req.body;
            
    // if new image was uploaded; otherwise keep the old one
    // let image;
    // if (req.file) {
    //     image = `/uploads/${req.file.filename}`;
    // } else {
    //     image = product.image;
    // }
    const image = req.file
        ? `/uploads/${req.file.filename}`
        : product.image;
    
    // Update the product
    const updatedProduct = await updateProduct(productId, {
        image,
        name,
        description,
        price,
        tag,
        availability
    });

    if (!updatedProduct) {
        req.flash('error', 'Failed to update product');
        return res.redirect(`/createProduct/list/${productId}/edit`);
    }

    req.flash('success', 'Product updated successfully');;
    res.redirect('/createProduct/list');
};

const processDeleteProduct = async (req, res) => {
    const productId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // Only admins can delete products
    if (currentUser.role_name !== 'admin') {
        req.flash('error', 'Unauthorized to delete product');
        console.log(`Unauthorized delete attempt by user ID ${currentUser.id} on product ID ${productId}`);
        return res.redirect('/createProduct/list');
    }

    // Extract product to delete
    const product = await getProductById(productId);
    if (!product) {
        req.flash('error', 'Product not found');
        console.log(`Product with ID ${productId} not found for deletion`);
        return res.redirect('/createProduct/list');
    }

    // Delete the product
    const deleted = await deleteProduct(productId);

    if (!deleted) {
        req.flash('error', 'Failed to delete product');
        console.log(`Failed to delete product ID ${productId}`);
        return res.redirect('/createProduct/list');
    }

    req.flash('success', 'Product deleted successfully');;
    console.log(`Product ID ${productId} deleted successfully`);
    res.redirect('/createProduct/list');
};

export { 
    showNewProductForm, 
    processNewProductForm, 
    showAllNewProducts, 
    showEditProductForm, 
    processEditProduct, 
    processDeleteProduct 
};

