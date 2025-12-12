import {
    addToCart,
    getCartItemsByUser,
    removeCartItem
    } from '../../models/forms/order.js';

const addCartSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/order.css">');
}

// display the cart page
const viewCart = async (req, res) => {
    addCartSpecificStyles(res);
    const userId = req.session?.userId;

    const cartItems = await getCartItemsByUser(userId);
    // console.log("Cart Items:", cartItems);
    // calculate totals
    let subtotal = 0;
    cartItems.forEach(ci => {
        subtotal += parseFloat(ci.price);
    });

    res.render('forms/orders/cart', {
        title: 'Your Cart',
        cartItems,
        //product
        subtotal: subtotal.toFixed(2)
    });
};

// add item to cart
const handleAddToCart = async (req, res) => {
    const userId = req.session?.userId;
    // if (!userId) {
    //     return res.status(401).json({ error: 'Not authenticated' });
    // }

    const { productId } = req.body;

    const added = await addToCart(userId, productId);
    if (!added) {
        return res.status(500).json({ error: 'Failed to add to cart' });
    }
    req.flash('success', 'Item added to cart successfully <a href="/cart">View Cart</a>');
    // If this was a fetch/ajax call you might return JSON; here we'll redirect back
    res.redirect('/products');
};

// remove item from cart
const handleRemoveFromCart = async (req, res) => {
    const cartItemId = req.body.cartItemId;

    const removed = await removeCartItem(cartItemId);
    res.redirect('/cart');
};

export {
    viewCart,
    handleAddToCart,
    handleRemoveFromCart
};
