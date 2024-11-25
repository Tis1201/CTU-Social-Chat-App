const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");


router.post("/refresh-token", authController.refreshToken);

module.exports = router;
