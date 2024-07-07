const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities/");

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inv_id", invController.buildByVehicleId);

router.get("/admin", invController.buildAdminPage)
router.get("/admin/add-classification", invController.buildNewClassification)
router.post("/admin/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassificationRegData,
    utilities.handleErrors(invController.newClassification)
);
router.get("/admin/remove-classification", invController.buildRemoveClassification)
router.post("/admin/remove-classification", 
    regValidate.deleteClassificationRules(), 
    regValidate.checkDeleteClassificationData, 
    invController.removeClassification);
router.get("/admin/add-inventory/", invController.buildNewInventory)
router.post("/admin/add-inventory", 
    regValidate.addInventoryRules(),
    regValidate.checkInvRegData,
    invController.addInventory);

//NOTE: I unintentionally fixed my 500 errors long before I got to task 3
//so I didn't realize we were tasked to do this until then. Just creating
//the route just to show that it does work as expected.
router.get("/detail/break", invController.buildByVehicleId);

module.exports = router;