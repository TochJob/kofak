import pidusage from "pidusage";
import psList from "ps-list";

import type { Request, Response } from "express";

class ProcessController {
  async getProcesses(req: Request, res: Response) {
    try {
      return res.json(await psList());
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error fetching processes" });
    }
  }

  async getProcess(req: Request<{ pid: string | string[] }>, res: Response) {
    const { pid } = req.params;
    if (!pid) return res.status(400).json({ message: "PID is required" });
    if (Number.isNaN(pid))
      return res.status(400).json({ message: "Invalid PID" });

    try {
      if (Array.isArray(pid)) {
        const processes = await Promise.all(
          pid.map((p) => pidusage(p).catch(() => null))
        );
        const validProcesses = processes.filter((p: number) => p !== null);
        return res.status(200).json(validProcesses);
      } else {
        const process = await pidusage(pid);
        return res.status(200).json(process);
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error fetching processes" });
    }
  }
}

export default new ProcessController();
