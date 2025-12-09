import { body } from "express-validator";

/**
 * Validation rules for new product form submission
 */
const newProductValidation = [
    body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Product name must be at least 2 characters long"),

    body("description")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Product description must be at least 10 characters long"),
    
    body("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be a number greater than 0"),
    
    body("tag")
        .notEmpty()
        .withMessage("Please choose a tag")
];

export { newProductValidation };
