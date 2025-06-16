import API_URL_LIST from "@/api/api.config.ts";
import type { ProcessosItemType, AvailibleIntervals } from "./typos";

const { apiGetProcessosWS } = API_URL_LIST;

export class ProcessosList extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  private _state = {
    processosData: null as ProcessosItemType[] | null,
    sortKey: null as keyof ProcessosItemType | null,
    sortAsc: true,
  };

  private updateHeaderSortIndicators() {
    this.querySelectorAll("th[data-sort]").forEach((th) => {
      const key = th.getAttribute("data-sort") as keyof ProcessosItemType;
      const label = th.textContent?.replace(/[\s↑↓]+$/, "") || "";

      if (this._state.sortKey === key) {
        const arrow = this._state.sortAsc ? "↑" : "↓";
        th.textContent = `${label} ${arrow}`;
      } else {
        th.textContent = label;
      }
    });
  }

  private state = new Proxy(this._state, {
    set: (target, prop, value) => {
      Reflect.set(target, prop, value);
      return true;
    },
  });

  AVAILIBLE_INTERVALS: AvailibleIntervals[] = [1000, 2000, 5000, 10000];

  openTableVisible() {
    const table = document.querySelector("#table-wrapper") as HTMLElement;
    const loader = document.querySelector("#loader") as HTMLElement;
    const interval = document.querySelector(
      "#selector-interval"
    ) as HTMLElement;
    if (table) table.classList.remove("hidden");
    if (interval) interval.classList.remove("hidden");
    if (loader) loader.classList.add("hidden");
  }

  async connectedCallback() {
    const socket = new WebSocket(apiGetProcessosWS);
    const intervalSelector = this.querySelector(
      "#interval-selector"
    ) as HTMLSelectElement;

    intervalSelector?.addEventListener("change", () => {
      const interval = Number(intervalSelector.value);

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "set_interval",
            body: { interval },
          })
        );
        localStorage.setItem("processos_interval", String(interval));
      }
    });

    socket.onopen = () => {
      const storageInterval = Number(
        localStorage.getItem("processos_interval")
      );
      const initialInterval: AvailibleIntervals = this.isAvailibleInterval(
        storageInterval
      )
        ? storageInterval
        : 2000;

      socket.send(
        JSON.stringify({
          type: "set_interval",
          body: { interval: initialInterval },
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("data", data);

        if (data.type === "processes" && Array.isArray(data.body)) {
          const newData: ProcessosItemType[] = data.body;

          this._state.processosData = newData;
          const sorted = this.getSortedData(newData);
          this.updateDOMWithNewData(sorted);

          this.openTableVisible();
        }
      } catch (error) {
        console.error("WebScoket error:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket ошибка:", error);
    };

    socket.onclose = () => {
      console.warn("WebSocket connection close");
    };
  }

  private getSortedData(data: ProcessosItemType[]): ProcessosItemType[] {
    const { sortKey, sortAsc } = this.state;

    return [...data].sort((a, b) => {
      if (!sortKey) return 0;

      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const isNumber = typeof aVal === "number" && typeof bVal === "number";

      const result = isNumber
        ? (aVal as number) - (bVal as number)
        : String(aVal).localeCompare(String(bVal));

      return sortAsc ? result : -result;
    });
  }

  private renderHeader(key: keyof ProcessosItemType, label: string) {
    const active = this.state.sortKey === key;
    const arrow = active ? (this.state.sortAsc ? "↑" : "↓") : "";
    return `<th data-sort="${key}">${label} ${arrow}</th>`;
  }

  private render() {
    const stylePath = new URL("./style.css", import.meta.url).href;

    const storageInterval = Number(localStorage.getItem("processos_interval"));
    const initialInterval: AvailibleIntervals = this.isAvailibleInterval(
      storageInterval
    )
      ? storageInterval
      : 2000;

    const intervalOptionsHtml = this.AVAILIBLE_INTERVALS.map(
      (sec) =>
        `<option value="${sec}" ${sec === initialInterval ? "selected" : ""}>${
          sec / 1000
        } sec</option>`
    ).join("");

    const tableHtml = `
        <table class="processos-table">
          <thead class="processos-table__header">
            <tr>
              ${this.renderHeader("name", "Name")}
              ${this.renderHeader("cpu", "CPU")}
              ${this.renderHeader("mem", "MEM")}
            </tr>
          </thead>
          <tbody class="processos-table__body"></tbody>
        </table>
      `;

    const intervalControlHtml = `
      <label id="selector-interval" class="hidden update-interval-label">
        Udpdate interval: 
        <select id="interval-selector">
          ${intervalOptionsHtml}
        </select>
      </label>
    `;

    this.innerHTML = `
      <link rel="stylesheet" href="${stylePath}">
      <div class="main">
        <div class="main-header__wrapper">
          <h2 class="page-header">Processes list</h2>
          ${intervalControlHtml}
        </div>
        <div id="table-wrapper" class="hidden">${tableHtml}</div>
        <div class="loader" id="loader"></div>
      </div>
    `;

    this.querySelectorAll("th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.getAttribute("data-sort") as keyof ProcessosItemType;
        if (!key) return;

        const isSame = this.state.sortKey === key;
        this.state.sortKey = key;
        this.state.sortAsc = isSame ? !this.state.sortAsc : true;

        const sorted = this.getSortedData(this._state.processosData || []);
        this.updateDOMWithNewData(sorted);
        this.updateHeaderSortIndicators();
      });
    });
  }

  private updateDOMWithNewData(data: ProcessosItemType[]) {
    let tbody = this.querySelector(".processos-table__body");
    if (!tbody) return;

    const existingRows = new Map<number, HTMLTableRowElement>();

    Array.from(tbody.querySelectorAll("tr")).forEach((row) => {
      const pidAttr = row.getAttribute("data-pid");
      if (pidAttr) {
        const pid = parseInt(pidAttr);
        if (!isNaN(pid)) existingRows.set(pid, row);
      }
    });

    const usedPids = new Set<number>();

    tbody.innerHTML = "";

    data.forEach((proc) => {
      const { pid, name, cpu, mem } = proc;
      usedPids.add(pid);
      const cpuStr = cpu.toFixed(1);
      const memStr = mem.toFixed(1);

      const existing = existingRows.get(pid);
      let row: HTMLTableRowElement;

      if (existing) {
        row = existing;
        const [nameCell, cpuCell, memCell] = row.children;
        if (nameCell.textContent !== name) nameCell.textContent = name;
        if (cpuCell.textContent !== cpuStr) cpuCell.textContent = cpuStr;
        if (memCell.textContent !== memStr) memCell.textContent = memStr;
      } else {
        row = document.createElement("tr");
        row.classList.add("processos-table__row");
        row.setAttribute("data-pid", String(pid));
        row.innerHTML = `
          <td class="processos-table__item">${name}</td>
          <td class="processos-table__item">${cpuStr}</td>
          <td class="processos-table__item">${memStr}</td>
        `;
      }

      tbody.appendChild(row);
    });
  }

  isAvailibleInterval(value: number): value is AvailibleIntervals {
    return [1000, 2000, 5000, 10000].includes(value);
  }
}

customElements.define("x-processos-list", ProcessosList);
