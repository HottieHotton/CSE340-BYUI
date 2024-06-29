const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inv_id", invController.buildByVehicleId);

//NOTE: I unintentionally fixed my 500 errors long before I got to task 3
//so I didn't realize we were tasked to do this until then. Just creating
//the route just to show that it does work as expected.
router.get("/detail/break", invController.buildByVehicleId);

module.exports = router;