import { 
    getCartItemsByUser, 
    processOrder,
    getOrderById,
    getOrdersByUser, 
    showAllOrders 
    } from '../../models/forms/order.js';
import db from '../../models/db.js';

// show checkout page (optional) or directly process on POST /checkout
const showCheckout = async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) return res.redirect('/login');

    const cartItems = await getCartItemsByUser(userId);
    let subtotal = 0;
    const items = cartItems.map(ci => {
        const line = {
            cart_item_id: ci.cart_item_id,
            product_id: ci.product_id,
            name: ci.name,
            image: ci.image,
            quantity: ci.quantity,
            price: parseFloat(ci.price)
        };
        line.line_total = line.price * line.quantity;
        subtotal += line.line_total;
        return line;
    });

    res.render('forms/order/checkout', {
        title: 'Checkout',
        items,
        subtotal: subtotal.toFixed(2)
    });
};

const handleProcessOrder = async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) return res.redirect('/login');

    // load cart and compute total
    const cartInfo = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country,
        venmo_confirmed: req.body.venmo_confirmed === 'on'
    };
    if (!cartInfo.first_name || !cartInfo.last_name || !cartInfo.email || !cartInfo.address) {
        // minimal validation failed
        return res.redirect('/checkout');
    }

    const cartItems = await getCartItemsByUser(userId);
    if (!cartItems || cartItems.length === 0) {
        return res.redirect('/cart');
    }

    const orderItems = cartItems.map(ci => ({
        product_id: ci.product_id,
        quantity: ci.quantity,
        price_each: parseFloat(ci.price)
    }));

    const total = orderItems.reduce((acc, it) => acc + it.quantity * it.price_each, 0);

    const result = await processOrder(userId, cartInfo, orderItems, total, 'pending');
    if (!result) {
        // handle error — show a fail page or redirect
        return res.status(500).send('Failed to create order');
    }

    // redirect to order confirmation
    res.redirect(`/orderConfirmation/${result.orderId}`);
};

const showOrderConfirmation = async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await getOrderById(orderId);

        if (!order) {
            return res.status(404).send('Order not found');
        }

        res.render('forms/order/orderConfirmation', {
            title: 'Order Confirmation',
            orderId,
            order,
            items: order.items,
            total: order.total.toFixed(2)
        });
    } catch (error) {
        console.error('Error fetching order confirmation:', error);
        res.status(500).send('Unable to load order details');
    }
};

const showMyOrders = async (req, res) => {
    const userId = req.session?.userId;
    if (!userId)
        return res.redirect('/login');

    try {
        const orders = await getOrdersByUser(userId);

        res.render('forms/order/myOrders', {
            title: 'My Orders',
            orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).send('Unable to load your orders');
    }
};

const handleShowAllOrders = async (req, res) => {
    try {
        const orders = await showAllOrders();
        res.render('forms/Order/list', {
            title: 'All Orders',
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Unable to load orders');
    }
};

const completeOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        await db.query(
            `UPDATE orders SET status = 'completed', updated_at = NOW() WHERE id = $1`,
            [orderId]
        );

        // Redirect back to the admin orders list
        return res.redirect("/order/list");
    } catch (error) {
        console.error("Error marking order complete:", error);
        return res.redirect("/order/list?error=true");
    }
};


export {
    showCheckout,
    handleProcessOrder,
    showOrderConfirmation,
    showMyOrders,
    handleShowAllOrders,
    completeOrder
};
