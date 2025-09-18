const express = require("express");
const router = express.Router();
const availabilityController = require("../../controller/admin/availabilityController");
const authejsController = require("../../controller/admin/authejsController");
const AuthCheck = require("../../middleware/auth");

// Create dynamic availability
router.post("/availability/createpost",AuthCheck,authejsController.CheckAuth, availabilityController.createAvailability);
router.get('/availability/create',AuthCheck,authejsController.CheckAuth,availabilityController.renderCreateForm)
// Get availability for a specific doctor
// router.get("/doctor/:doctorId",AuthCheck,authejsController.CheckAuth, availabilityController.getAvailabilityByDoctor);
router.get("/doctor/:doctorId/dayoff", AuthCheck,authejsController.CheckAuth,availabilityController.renderDayOffPage);
// Update recurring day off
router.post("/doctor/:doctorId/dayoff", AuthCheck,authejsController.CheckAuth,availabilityController.setDayOff);
router.get("/doctor/:doctorId/specialdayoff", AuthCheck,authejsController.CheckAuth,availabilityController.renderSpecialDayOffPage);
// Add a special day off (holiday, travel, etc.)
router.post("/doctor/:doctorId/specialdayoff",AuthCheck,authejsController.CheckAuth, availabilityController.addSpecialDayOff);
router.post("/doctor/:doctorId/specialdayoff/delete", AuthCheck,authejsController.CheckAuth,availabilityController.deleteSpecialDayOff);
// Get all doctors availability
router.get("/availability/list",AuthCheck,authejsController.CheckAuth, availabilityController.getAllAvailability);

module.exports = router;
