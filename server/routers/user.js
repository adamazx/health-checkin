const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  searchUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

router.get("/", getAllUsers); // GET /api/users
router.get("/search", searchUsers); // GET /api/users
router.get("/:id", getUserById); // GET /api/users
router.post("/", createUser); // POST /api/users
router.put("/:id", updateUser); // PUT /api/users
router.delete("/:id", deleteUser); // DELETE /api/users

module.exports = router;
