import {
    addToCart,
    getCartItemsByUser,
    updateCartItemQuantity,
    removeCartItem
    } from '../../models/forms/order.js';

// display the cart page
const viewCart = async (req, res) => {
    const userId = req.session?.userId;

    const cartItems = await getCartItemsByUser(userId);
    // console.log("Cart Items:", cartItems);
    // calculate totals
    let subtotal = 0;
    cartItems.forEach(ci => {
        subtotal += parseFloat(ci.price) * ci.quantity;
    });

    res.render('forms/order/cart', {
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

    const { productId, quantity } = req.body;
    const qty = parseInt(quantity, 10) || 1;

    const added = await addToCart(userId, productId, qty);
    if (!added) {
        return res.status(500).json({ error: 'Failed to add to cart' });
    }

    // If this was a fetch/ajax call you might return JSON; here we'll redirect back
    res.redirect('/cart');
};

// update item quantity in cart
const handleUpdateCart = async (req, res) => {
    const { cartItemId, quantity } = req.body;
    const qty = parseInt(quantity, 10);

    const updated = await updateCartItemQuantity(cartItemId, qty);
    if (!updated) {
        // if update failed, redirect with error (you can flash a message)
        return res.redirect('/cart');
    }
    res.redirect('/cart');
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
    handleUpdateCart,
    handleRemoveFromCart
};
