const jwt = require("jsonwebtoken");
require("dotenv").config();
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

const accountCont = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
};

accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process Registration
 * *************************************** */
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
};

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    console.log(await bcrypt.compare(account_password, accountData.account_password))
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }else{
      req.flash("notice", "Incorrect password. Please try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    req.flash("notice", "An error occurred during login. Please try again later.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
};

accountCont.buildMain = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    firstName: res.locals.accountData.account_firstname,
    type: res.locals.accountData.account_type,
  });
};

accountCont.buildUpdatePage = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/accountMain", {
    title: "Account Management",
    nav,
    firstName: res.locals.accountData.account_firstname,
  });
};

accountCont.buildDetailsPage = async function (req, res, next) {
  let nav = await utilities.getNav();
  let data = res.locals.accountData;
  res.render("account/accountDetails", {
    title: "Update Account",
    nav,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    account_id: data.account_id,
  });
};

accountCont.updateAccount = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_id } =
      req.body;
    if(account_email != res.locals.accountData.account_email){
      const data = await accountModel.getAccountByEmail(account_email);
      if (!data) {
        req.flash("notice", "Email already exists in database, please use a different email address.");
        res.status(400).render("account/accountDetails", {
          title: "Update Account",
          nav,
          errors: null,
          account_firstname: res.locals.accountData.account_firstname,
          account_lastname: res.locals.accountData.account_lastname,
          account_email: res.locals.accountData.account_email,
          account_id: res.locals.accountData.account_id,
        });
        return;
      }
    }
    let result = await accountModel.updateAccountById(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    );
    if (result) {
      let accountData = result
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      req.flash("notice", "Your account has been updated!");
      res.redirect("/account/update");
    } else {
      let data = res.locals.accountData;
      res.render("account/accountDetails", {
        title: "Update Account",
        nav,
        account_firstname: data.account_firstname,
        account_lastname: data.account_lastname,
        account_email: data.account_email,
        account_id: data.account_id,
      });
    }
  } catch (error) {
    throw new Error(error)
  }
};

accountCont.buildUpdatePassword = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/updatePassword", {
    title: "Update Password",
    nav
  })
};

accountCont.updatePassword = async function(req,res,next){
  let {current_account_password, new_account_password} = req.body;
  let data = await accountModel.getAccountById(res.locals.accountData.account_id)
  try {
    if (await bcrypt.compare(current_account_password, data.account_password)) {
      delete data.account_password;
      hashedPassword = await bcrypt.hashSync(new_account_password, 10);
      let result = await accountModel.updatePasswordById(hashedPassword, data.account_id);
      if(result){
        req.flash("notice", "Password has been updated!");
        res.redirect("/account/update");
      }else{
        let nav = await utilities.getNav();
        req.flash("error", "Malformed Request. Please check contents and try again!")
        res.render("account/updatePassword", {
          title: "Update Password",
          nav
        })
      }
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

accountCont.logOut = async function (req, res, next) {
  res.locals.accountData = null;
  res.locals.loggedin = 0;
  res.locals.name = null;
  res.clearCookie("jwt");
  req.flash("notice", "Logged Out!");
  res.redirect("/");
};

module.exports = accountCont;
