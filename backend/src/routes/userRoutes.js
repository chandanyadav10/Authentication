import express from "express";
import { loginUser, registerUser, logoutUser , getUser, updateUser} from "../controllers/auth/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login",loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

export default router;