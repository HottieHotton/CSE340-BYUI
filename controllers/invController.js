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

module.exports = invCont;
