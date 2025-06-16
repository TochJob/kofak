import { WebSocketServer } from "ws";
import http from "http";
import si from "systeminformation";

let wss: WebSocketServer | null = null;

export function setupWebSocket(server: http.Server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket connected");
    ws.send(JSON.stringify({ message: "Connect ready" }));
  });

  setInterval(async () => {
    if (!wss) return;

    try {
      const allProcesses = await si.processes();
      const filtered = allProcesses.list.map((p) => ({
        pid: p.pid,
        name: p.name,
        cpu: Number(p.cpu.toFixed(2)),
        mem: Number((p.mem * 100).toFixed(2)),
      }));

      const message = JSON.stringify({ type: "processes", payload: filtered });

      wss.clients.forEach((client) => {
        if (client.readyState === 1) client.send(message);
      });
    } catch (e) {
      console.error("Ошибка при получении процессов:", e);
    }
  }, 1000);
}
