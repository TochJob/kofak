import UserModel from "./models/User.ts";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

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
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Login error",
      });
    }
  }
  async getUsers(req, res) {
    try {
      res.json('{"message": "Users list"}');
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Error while getting users",
      });
    }
  }
}

export default new AuthController();
