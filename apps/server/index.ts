import express from "express";
import mongoose from "mongoose";

import authRouter from "./authRouter.ts";

const DB_URL =
  "mongodb+srv://admin:admin@cluster0.efkoc0g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const PORT = 5000;

const app = express();

app.use(express.json()).use("/auth", authRouter);
async function startApp() {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
startApp();
