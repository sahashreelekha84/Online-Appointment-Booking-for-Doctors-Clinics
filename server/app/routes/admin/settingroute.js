// routes/admin.js
const express = require("express");
const router = express.Router();
const settingController = require("../../controller/admin/systemcontroller");
const AuthCheck=require("../../middleware/auth")
// Show settings page
router.get("/admin/settings",AuthCheck, settingController.getSettings);

// Update settings
router.post("/admin/settings", AuthCheck,settingController.updateSettings);

module.exports = router;
