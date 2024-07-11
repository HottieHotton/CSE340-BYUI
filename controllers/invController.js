const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};
let error = new Error();

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    if(!data.length){
      error = new Error("Car Classification not found!");
      error.status = 404;
      throw error;
    }
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (err) {
    next(err);
  }
};

invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const vehicleId = req.params.inv_id;
    const data = await invModel.getVehicleById(vehicleId);
    if(!data.length){
      error = new Error("Vehicle not found!");
      error.status = 404;
      throw error;
    }
    const display = await utilities.buildVehicleDetails(data);
    let nav = await utilities.getNav();
    let vehicle =
      data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
    res.render("./inventory/details", {
      title: vehicle,
      nav,
      display,
    });
  } catch (err) {
    next(err);
  }
};

invCont.buildAdminPage = async function(req,res,next){
  let nav = await utilities.getNav()
  res.render("inventory/management",{
    title: "Management",
    nav,
    errors: null
  })
}

invCont.buildNewClassification = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("inventory/add-classification",{
    title: "Add Classification",
    nav,
    errors: null
  })
}

invCont.newClassification = async function (req,res,next) {
  try {
    const newClassification = req.body;
    const result = await invModel.addClassification(newClassification)
    if(result){
      let nav = await utilities.getNav()
      req.flash("notice", "Classification has been added!");
      res.status(201).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
      })
    }
  } catch (error) {
    next(error)
  }
}

invCont.buildRemoveClassification = async function (req,res,next){
  try {
    let nav = await utilities.getNav()
    let classification_drop = await utilities.buildClassificationList()
    res.render("inventory/remove-classification",{
      title: "Remove Classification",
      nav,
      classification_drop,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

invCont.removeClassification = async function (req, res, next) {
  try {
    const { classification_id } = req.body;
    await invModel.deleteInvByClassId(classification_id);
    const result = await invModel.deleteClassById(classification_id);
    if (result.rowCount) {
      req.flash("notice", "Classification deleted successfully.");
      res.redirect("/inv/admin/add-classification");
    } else {
      req.flash("notice", "Error deleting classification.");
      res.redirect("/inv/remove-classification");
    }
  } catch (error) {
    next(error);
  }
};

invCont.buildNewInventory = async function (req,res,next){
  try {
    let nav = await utilities.getNav()
    let classification_drop = await utilities.buildClassificationList()
    res.render("inventory/add-inventory",{
      title: "Add Inventory",
      nav,
      classification_drop,
      inv_make: "",
      inv_model: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_year: "",
      inv_miles: "",
      inv_color: "",
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

invCont.addInventory = async function (req,res,next){
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    } = req.body;
    const result = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color)
    if(result){
      req.flash("notice", "Vehicle added successfully!")
      let nav = await utilities.getNav()
      res.render("inventory/management", {
        errors: null,
        title: "Inventory Management",
        nav,
        messages: req.flash("notice")
      })
    }
  } catch (error) {
    next(error)
  }
}

invCont.buildManageInventory = async function(req,res,next){
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/manageInventory",{
    title: "Inventory Management",
    nav,
    errors: null,
    messages: null,
    classificationSelect
  })
}

invCont.getInventoryJSON = async function(req, res, next) {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const classificationList = await utilities.buildClassificationList()
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  console.log(itemData[0].inv_description)
  res.render("inventory/edit-vehicle", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/admin/")
  } else {
    const classificationList = await utilities.buildClassificationList()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
    })
  }
}

module.exports = invCont;