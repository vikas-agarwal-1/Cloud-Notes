import express from "express";
import { login, register, logout } from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/logout", verifyToken, logout);

export default router;