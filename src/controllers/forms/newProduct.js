import { validationResult } from "express-validator";
import { saveNewProduct, getAllProductForms } from "../../models/forms/newProduct.js";
import { getSortedFilteredProducts } from "../../models/products/products.js";

const addNewProductSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/newProduct.css">');
};

/**
 * Display the new product form
 */
const showNewProductForm = (req, res) => {
    addNewProductSpecificStyles(res);
    res.render("forms/newProduct/createProduct", {
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

    const { name, description, price, tag } = req.body;
    console.log('file: ', req.file);
    const imageFilename = req.file ? `/uploads/${req.file.filename}` : null;

    // Save to DB
    const savedProductForm = await saveNewProduct(
        imageFilename,
        name,
        description,
        price,
        tag
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
    // const productForms = await getAllProductForms();
    const sortBy = req.query.sortBy || 'default';
    let tags = req.query.tag;
    
    const productsArray = await getAllProductForms();
    const products = await getSortedFilteredProducts(productsArray, sortBy, tags);


    res.render("forms/newProduct/list", {
        title: "New Product Submissions",
        products,
        currentSort: sortBy,
        currentTags: tags || []
    });
}

export { showNewProductForm, processNewProductForm, showAllNewProducts };

