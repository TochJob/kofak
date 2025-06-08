import { Router } from "express";

import processController from "./processController.ts";

const router = new Router();

router.get("/", processController.getProcesses);

export default router;
