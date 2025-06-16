import express from "express";
import cors from "cors";

import processRouter from "./modules/process/processRouter.ts";

const PORT = 5000;

const app = express({
  origin: "http://localhost:5173",
  credentials: true,
});

app.use(express.json()).use(cors()).use("/processes", processRouter);

async function startApp() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
startApp();
