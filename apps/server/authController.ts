import UserModel from "./models/User.ts";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "./config.ts";

import type { ObjectId } from "mongodb";

function generateAccessToken(id: ObjectId): string {
  const payload = { id };
  return jwt.sign(payload, config.secret, { expiresIn: "24h" });
}

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Registration error",
          errors: errors.array(),
        });
      }

      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          message: "Username and password are required",
        });
      }

      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
      const hashPassword = await bcrypt.hash(password, 8);
      const user = new UserModel({ username, password: hashPassword });
      await user.save();
      res.status(201).json({
        message: "User registered successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Registration error",
      });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          message: "Invalid password",
        });
      }
      const token = generateAccessToken(user._id);
      return res.json({ token, userId: user._id, username: user.username });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Login error",
      });
    }
  }
}

export default new AuthController();
