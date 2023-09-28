const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/login", userController.userLogin);
router.post("/signup", userController.addUser);
router.get("/users", userController.getallUser);
router.get("/user/:id", userController.getUserDetails);
router.put("/user/:id", userController.updateUserDetails);
router.delete("/user/:id", userController.deleteUser);

module.exports = router;
