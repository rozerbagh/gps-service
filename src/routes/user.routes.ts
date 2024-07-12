import { Router } from "express";
import userController from "../controllers/user.controller"
const router = Router();

router.post("/login", userController.userLogin);
router.post("/signup", userController.addUser);
router.post("/sendotp", userController.sendOtp);
router.get("/users", userController.getallUser);
router.get("/user/:id", userController.getUserDetails);
router.put("/user/:id", userController.updateUserDetails);
router.delete("/user/:id", userController.deleteUser);

export default router;
