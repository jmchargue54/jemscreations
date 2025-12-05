// render cart page
const cartPage = (req, res) => {
    res.render('cart', { 
        title: "Shopping Cart",
    });
};

export { cartPage };