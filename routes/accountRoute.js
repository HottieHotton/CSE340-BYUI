const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities/");

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildMain))
router.get("/login", accountController.buildLogin);
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/register", accountController.buildRegister);
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.get("/update", utilities.checkLogin, accountController.buildUpdatePage);
router.get("/update/details", utilities.checkLogin, accountController.buildDetailsPage);
router.post("/update/details", 
regValidate.updateAccountRules(), 
regValidate.checkUpdateData,
utilities.handleErrors(accountController.updateAccount));
router.get("/update/password", utilities.checkLogin, accountController.buildUpdatePassword);
router.post("/update/password", utilities.handleErrors(accountController.updatePassword))

router.get("/logout", accountController.logOut);

module.exports = router;
