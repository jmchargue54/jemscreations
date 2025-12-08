const createProductPage = (req, res) => {
    res.render('forms/createProduct', { 
        title: "Create New Product" 
    });
};  

export { createProductPage };