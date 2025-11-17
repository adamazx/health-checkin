const express = require("express");
const router = express.Router();

const {
  getAllServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

router.get("/", getAllServices);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;
