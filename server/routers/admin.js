const express = require("express");
const router = express.Router();
const { adminLogin, adminRegister } = require("../controllers/admin.controller");
// const verifyAdmin = require("../middlewares/authAdmin");

router.post("/login", adminLogin);
router.post("/register", adminRegister);

module.exports = router;