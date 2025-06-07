import { Router } from "express";
import authController from "./authController.ts";
import { check } from "express-validator";

const router = new Router();

router.post(
  "/registration",
  [
    check("username", "Username cannot be empty").notEmpty(),
    check("password", "Password must be at least 4 characters").isLength({
      min: 4,
    }),
  ],
  authController.registration
);
router.post("/login", authController.login);
router.get("/users", authController.getUsers);

export default router;
