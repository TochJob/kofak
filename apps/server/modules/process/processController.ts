import si from "systeminformation";

import type { Request, Response } from "express";

class ProcessController {
  async getProcesses(req: Request, res: Response) {
    try {
      const allProcesses = await si.processes();

      return res.json(allProcesses);

      // console.log("processes", processes);
      // const processesUuidList: number[] = processes.map(
      //   (process) => process.pid
      // );
      // const usage = await pidusage(processesUuidList);
      // console.log("usage", usage);

      // const enrichedProcesses = await Promise.all(
      //   processes.map(async (process) => {
      //     try {
      //       const usage = await pidusage(process.pid);
      //       return { ...process, ...usage };
      //     } catch {
      //       return { ...process, error: "Failed to fetch usage data" };
      //     }
      //   })
      // );

      // return res.json(enrichedProcesses);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error fetching processes" });
    }
  }

  // async getProcess(req: Request<{ pid: string | string[] }>, res: Response) {
  //   const { pid } = req.params;
  //   console.log("pid", pid);

  //   if (!pid) return res.status(400).json({ message: "PID is required" });

  //   const pids = Array.isArray(pid) ? pid : [pid];

  //   const invalid = pids.filter((p) => isNaN(Number(p)));
  //   if (invalid.length > 0) {
  //     return res
  //       .status(400)
  //       .json({ message: `Invalid PID(s): ${invalid.join(", ")}` });
  //   }

  //   try {
  //     const stats = await Promise.all(
  //       pids.map(async (p) => {
  //         try {
  //           const usage = await pidusage(Number(p));
  //           return { pid: p, ...usage };
  //         } catch {
  //           return null;
  //         }
  //       })
  //     );
  //     console.log("123");

  //     const filtered = stats.filter(
  //       (s): s is { pid: string | number } & Stat => s !== null
  //     );

  //     return res.status(200).json(filtered);
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(400).json({ message: "Error fetching processes" });
  //   }
  // }
}

export default new ProcessController();
