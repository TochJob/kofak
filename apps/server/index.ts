import express from "express";
import cors from "cors";
import http from "http";
import { setupWebSocket } from "./modules/process/processControllerWS.ts";

const PORT = 5000;

const app = express();

app
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(express.json());

const server = http.createServer(app);

setupWebSocket(server);

async function startApp() {
  try {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startApp();
