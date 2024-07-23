import { Router } from "express";
import userController from "../controllers/user.controller"
const router = Router();

router.post("/login", userController.userLogin);
router.post("/signup", userController.addUser);
router.post("/sendotp", userController.sendOtp);
router.get("/lists", userController.getallUser);
router.get("/get/:id", userController.getUserDetails);
router.patch("/update/:id", userController.updateUserDetails);
router.delete("/delete/:id", userController.deleteUser);

export default router;
