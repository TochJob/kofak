import { Router } from "express";

import processController from "./processController.ts";

const router = new Router();

router.get("/", processController.getProcesses);
router.get("/:pid", processController.getProcess);

export default router;
