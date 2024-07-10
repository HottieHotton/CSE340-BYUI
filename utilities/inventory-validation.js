const inventory_model = require("../models/inventory-model");
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const inv_validate = {};

inv_validate.classificationRules = () => {
  return [
    body("new_classification")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid classification name.")
      .custom(async (new_classification) => {
        const classificationCheck = await inventory_model.checkExistingClass(
          new_classification
        );
        if (classificationCheck) {
          throw new Error(
            "Classification exists. Please enter a different classification"
          );
        }
      }),
  ];
};

inv_validate.addInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification is required.")
      .bail()
      .isInt()
      .withMessage("Invalid classification ID."),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required.")
      .bail()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required.")
      .bail()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required.")
      .bail()
      .isLength({ min: 3 })
      .withMessage("Description must be 3 characters"),
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Image Path is required."),
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Thumbnail Path is required."),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Price is required.")
      .bail()
      .isFloat({ min: 0 })
      .withMessage("Invalid price."),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Year is required.")
      .bail()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Invalid year."),
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Miles is required.")
      .bail()
      .isInt({ min: 0 })
      .withMessage("Invalid miles."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required.")
      .bail()
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters."),
  ];
};

inv_validate.checkInvRegData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classification_drop = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classification_drop,
      ...req.body
    });
    return;
  }
  next();
};

inv_validate.checkClassificationRegData = async (req, res, next) => {
  const { new_classification } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Registration",
      nav,
      new_classification,
    });
    return;
  }
  next();
};

inv_validate.deleteClassificationRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification is required.")
      .isInt()
      .withMessage("Invalid classification ID."),
  ];
};

inv_validate.checkDeleteClassificationData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classification_drop = await utilities.buildClassificationList(
      req.body.classification_id
    );
    res.render("inventory/remove-classification/", {
      errors,
      title: "Remove Classification",
      nav,
      classification_drop,
      ...req.body,
    });
    return;
  }
  next();
};

module.exports = inv_validate;
