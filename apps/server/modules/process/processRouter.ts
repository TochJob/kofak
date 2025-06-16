import { Router } from "express";

import processController from "./processController.ts";

const { getProcesses } = processController;

const router = new Router();

router.get("/", getProcesses);

export default router;
