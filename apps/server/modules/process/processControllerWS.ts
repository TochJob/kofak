import { WebSocketServer } from "ws";
import http from "http";
import si from "systeminformation";
import type { ClientMeta } from "./typos";

let wss: WebSocketServer | null = null;
const DEFAULT_INTERVAL = 1500;
let currentInterval = DEFAULT_INTERVAL;

export function setupWebSocket(server: http.Server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket connected");
    ws.send(JSON.stringify({ message: "Connect ready" }));

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log("message", message);

        if (typeof message?.body?.interval === "number") {
          const intervalMessage: ClientMeta = message;

          currentInterval = Math.max(1000, intervalMessage.body.interval);

          ws.send(
            JSON.stringify({
              type: "info",
              message: `New interval set: ${currentInterval} sec`,
            })
          );
        }
      } catch (error) {
        console.log("Error:", error);
      }
    });
  });

  function startProcessBroadcasting() {
    function scheduleNextTick() {
      setTimeout(async () => {
        if (!wss) return;

        let filtered: ReturnType<typeof mapProcessList> = [];

        try {
          const allProcesses = await si.processes();
          filtered = mapProcessList(allProcesses.list);
        } catch (e) {
          console.error("Error fetching processes:", e);
        }

        const message = JSON.stringify({ type: "processes", body: filtered });

        wss.clients.forEach((client) => {
          if (client.readyState === 1) client.send(message);
        });

        scheduleNextTick();
      }, currentInterval);
    }

    scheduleNextTick();
  }

  function mapProcessList(
    list: Awaited<ReturnType<typeof si.processes>>["list"]
  ) {
    return list.map((p) => ({
      pid: p.pid,
      name: p.name,
      cpu: Number(p.cpu.toFixed(2)),
      mem: Number((p.mem * 100).toFixed(2)),
    }));
  }

  startProcessBroadcasting();
}
