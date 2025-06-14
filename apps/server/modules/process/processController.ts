import si from "systeminformation";

import type { Request, Response } from "express";

class ProcessController {
  async getProcesses(req: Request, res: Response) {
    try {
      const allProcesses = await si.processes();
      const filterdProcesses = allProcesses.list.map((p) => ({
        pid: p.pid,
        name: p.name,
        cpu: Number(p.cpu.toFixed(1)),
        mem: Number((p.mem * 100).toFixed(1)),
      }));
      return res.json(filterdProcesses);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error fetching processes" });
    }
  }
}

export default new ProcessController();
