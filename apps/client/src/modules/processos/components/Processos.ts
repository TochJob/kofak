import API_URL_LIST from "@/api/api.config.ts";
import type { ProcessosItemType } from "./typos";

const { apiGetProcessos } = API_URL_LIST;

export class ProcessosList extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  private intervalId: number | undefined;

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
      // this.render();
      return true;
    },
  });

  async connectedCallback() {
    const fetchAndUpdate = async () => {
      try {
        const response = await fetch(apiGetProcessos, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Fetch failed");

        const newData: ProcessosItemType[] = await response.json();
        if (!Array.isArray(newData)) return;

        this._state.processosData = newData;
        const sorted = this.getSortedData(newData);
        this.updateDOMWithNewData(sorted);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        this.intervalId = window.setTimeout(fetchAndUpdate, 500);
      }
    };

    await fetchAndUpdate();
  }

  disconnectedCallback() {
    if (this.intervalId) clearTimeout(this.intervalId);
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

  private render() {
    const stylePath = new URL("./style.css", import.meta.url).href;

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

    this.innerHTML = `
      <link rel="stylesheet" href="${stylePath}">
      <div class="main">
        <h2>Список процессов</h2>
        ${tableHtml}
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

  private renderHeader(key: keyof ProcessosItemType, label: string) {
    const active = this.state.sortKey === key;
    const arrow = active ? (this.state.sortAsc ? "↑" : "↓") : "";
    return `<th data-sort="${key}">${label} ${arrow}</th>`;
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
}

customElements.define("x-processos-list", ProcessosList);
