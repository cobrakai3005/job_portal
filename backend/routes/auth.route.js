import express from "express";
import {
  loginAdmin,
  logout,
  getMe,
  register,
} from "../controllers/auth.controller.js";
import { db } from "../config/db.js";
import { authorizeRoles, verifyToken } from "../middlewares/auth.middleware.js";
import { registerUserSchema, loginUserSchema } from "../schemas/index.js";
import { validate } from "../middlewares/validation.js";

const router = express.Router();

router.post("/register", validate(registerUserSchema), register);
router.post("/login", validate(loginUserSchema), loginAdmin);
router.post("/logout", logout);
router.get("/get-me", verifyToken, authorizeRoles("admin"), getMe);
export default router;
