import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRouter from "./modules/auth/authRouter.ts";
import processRouter from "./modules/process/processRouter.ts";

const DB_URL =
  "mongodb+srv://admin:admin@cluster0.efkoc0g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const PORT = 5000;

const app = express({
  origin: "http://localhost:5173",
  credentials: true,
});

app
  .use(express.json())
  .use(cors())
  .use("/auth", authRouter)
  .use("/processes", processRouter);

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
