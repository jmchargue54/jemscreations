# JemsCreations Project Specification

## Project description

JemsCreations is an online storefront for jewelry and other products made from wood and resin. The site acts as a middleman between the business owner and customers: the owner manages products and orders, while shoppers can browse products, save items, submit order requests, and contact the seller.

The first version will not process online payments. Customers will submit an order request, and the business owner will follow up to arrange payment and fulfillment.

## Target users

- **Shoppers:** Browse products and view product information.
- **Customers:** Add products to a cart, submit orders, manage account information, and use wishlists.
- **Administrator/business owner:** Manage products, inventory, discounts, customer orders, and customer messages.

## MVP features

### Customer features

- View a home page featuring JemsCreations products and branding.
- Browse all products in a shop/catalog view.
- Filter products by category.
- Search for products.
- View product details, including the product name, description, images, price, category, and availability.
- Add products to a shopping cart.
- Adjust quantities or remove products from the cart.
- Apply an available discount code.
- Submit an order request as a registered customer or guest.
- Provide shipping and contact information during checkout.
- Indicate that payment was sent through Venmo.
- View confirmation after submitting an order.
- Create an account and sign in.
- View account-related order information.
- Save products to a wishlist.
- Require a customer account to use wishlist features.
- Send a message through the contact page.
- Read the About page.
- Use links to the business's Instagram and Facebook pages.

### Administrator features

- Sign in to an administrative dashboard.
- Create, edit, delete, or deactivate products.
- Upload and manage product images.
- Assign products to categories.
- Manage product prices and inventory.
- Mark one-of-a-kind products as sold without deleting them.
- Turn optional inventory tracking on or off as the business needs change.
- View all submitted orders.
- View customer and shipping information for an order.
- Update orders as pending, processing, shipped, complete, or canceled.
- Create, edit, activate, or deactivate discount codes.
- Set a discount amount or percentage.
- View and respond to customer messages.
- Manage Instagram and Facebook links displayed on the site.

## Optional or future features

- Online payment processing
- Customer product reviews and ratings
- Custom product requests
- Shipping-rate or shipping-label integration
- Automated order confirmation emails
- Order status notifications
- Additional order statuses, such as pending, processing, shipped, and canceled
- Product recommendations
- Discount expiration dates and usage limits
- Customer order history and reorder options
- Product image galleries or zooming

## Basic user flows

### Browse and submit an order

1. A shopper visits the home page.
2. The shopper opens the shop/catalog.
3. The shopper searches or filters products.
4. The shopper opens a product detail page.
5. The shopper adds a product to the cart.
6. The shopper reviews the cart and applies a discount code, if applicable.
7. The shopper proceeds to checkout.
8. The shopper signs in, creates an account, or continues as a guest.
9. The shopper enters contact and shipping information.
10. The shopper submits an order request.
11. The site displays an order confirmation.
12. The administrator reviews and manages the order.

### Manage a product

1. The administrator signs in.
2. The administrator opens the dashboard.
3. The administrator creates, edits, or removes a product.
4. The administrator enters product details, price, category, optional inventory settings, and images.
5. The administrator saves the changes.
6. The product becomes available, sold, or unavailable in the catalog based on its status. If optional inventory tracking is enabled, inventory quantity is also used to determine availability.

### Manage an order

1. The administrator signs in.
2. The administrator opens the orders page.
3. The administrator selects an order.
4. The administrator reviews the customer, products, shipping information, and order total.
5. The administrator communicates with the customer if needed.
6. The administrator marks the order as complete when it has been fulfilled.

### Create a discount

1. The administrator signs in.
2. The administrator opens the discount management area.
3. The administrator creates a discount code.
4. The administrator specifies the discount amount or percentage.
5. The administrator activates or deactivates the code.
6. A customer enters the code during checkout.
7. The site validates the code and updates the order total.

## Initial data models

### User

- User ID
- Name
- Email address
- Password information
- Role: customer or administrator
- Phone number
- Account creation date

### Product

- Product ID
- Name
- Description
- Price
- Category ID
- Product status: active, sold, or inactive
- Optional inventory quantity
- Creation date
- Last updated date

### Product image

- Image ID
- Product ID
- Image location
- Alt text
- Display order

### Category

- Category ID
- Category name
- Description
- Active status

### Cart and cart item

- Cart ID
- User ID, if the customer is signed in
- Cart items
- Creation or update date
- Cart item ID
- Product ID
- Quantity
- Price at the time it was added

### Wishlist item

- Wishlist item ID
- User ID
- Product ID
- Date added

### Order and order item

- Order ID
- Customer or guest information
- Order date
- Order status: submitted, pending, processing, shipped, complete, or canceled
- Items
- Subtotal
- Discount amount
- Total amount
- Shipping information
- Venmo payment confirmation
- Customer notes
- Order item ID
- Product ID
- Product name at the time of purchase
- Quantity
- Price at the time of purchase

### Shipping information

- Shipping information ID
- Order ID
- Recipient name
- Address
- City
- State or region
- Postal code
- Country
- Phone number

### Discount

- Discount ID
- Discount code
- Discount type: fixed amount or percentage
- Discount value
- Active status
- Optional expiration date
- Optional usage limit

### Message

- Message ID
- Sender name
- Sender email
- User ID, if signed in
- Message subject
- Message content
- Date submitted
- Response or resolution status

## Important API endpoints or interactions

These describe the main interactions the application will need. Exact endpoint names can be decided later.

### Products and categories

- Get all active products
- Get one product by ID
- Search products
- Filter products by category
- Create, update, delete, or deactivate a product
- Upload product images
- Get all categories
- Create, edit, or remove a category

### Authentication and users

- Register a customer account
- Sign in and sign out
- Get current user information
- Update customer account information
- Verify administrator access

### Cart and wishlist

- Get the current cart
- Add an item to the cart
- Update cart item quantity
- Remove an item from the cart
- Clear the cart
- Add or remove a wishlist item
- Get the customer’s wishlist

### Orders

- Submit an order request with Venmo payment confirmation
- Get an order confirmation
- Get a customer’s orders
- Get all orders for the administrator
- Get one order’s details
- Update an order status
- Mark an order as complete

### Discounts

- Validate a discount code and apply it to the entire order
- Create, edit, activate, deactivate, or delete a discount

### Messages

- Submit a contact message
- Get messages for the administrator
- Update a message’s status
- Respond to or archive a message

### Site settings and social media

- Get the Instagram and Facebook links displayed on the site
- Update the Instagram and Facebook links as an administrator
- Turn inventory tracking on or off as an administrator

## Open questions

- Will the business owner manually contact customers after each order request, or should the site include a preferred contact method?
- Should guest customers receive an order confirmation by email?
- Should the Venmo payment confirmation be a required checkbox, a text field for payment details, or both?
- Should discount codes have expiration dates or usage limits?
- What Venmo username or payment instructions should be displayed during checkout?
- What shipping regions will the business serve?
- What customer information is required at checkout?
- Should customers be able to view their previous orders after signing in?
