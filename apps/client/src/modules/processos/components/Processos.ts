import API_URL_LIST from "@/api/api.config.ts";
import type { ProcessosListType, ProcessosItemType } from "./typos";

const { apiGetProcessos } = API_URL_LIST;

export class ProcessosList extends HTMLElement {
  private _state = {
    processosData: null as ProcessosItemType[] | null,
    sortKey: null as keyof ProcessosItemType | null,
    sortAsc: true,
  };

  private state = new Proxy(this._state, {
    set: (target, prop, value) => {
      Reflect.set(target, prop, value);
      this.render();
      return true;
    },
  });

  constructor() {
    super();
    this.render();
  }

  async connectedCallback() {
    try {
      const response = await fetch(apiGetProcessos, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Fetch failed");

      const data: ProcessosListType = await response.json();
      this.state.processosData = data.list;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  render() {
    const stylePath = new URL("./style.css", import.meta.url).href;
    const { processosData, sortKey, sortAsc } = this.state;

    const sortedData = processosData
      ? [...processosData].sort((a, b) => {
          if (!sortKey) return 0;

          const aValue = a[sortKey];
          const bValue = b[sortKey];

          const isNumber =
            typeof aValue === "number" && typeof bValue === "number";
          const result = isNumber
            ? (aValue as number) - (bValue as number)
            : String(aValue).localeCompare(String(bValue));

          return sortAsc ? result : -result;
        })
      : null;

    const tableHtml = sortedData
      ? `
        <table class="processos-table">
          <thead>
            <tr>
              ${this.renderHeader("name", "Name")}
              ${this.renderHeader("cpu", "CPU")}
              ${this.renderHeader("mem", "MEM")}
            </tr>
          </thead>
          <tbody>
            ${sortedData
              .map(
                (p) => `
                <tr>
                  <td>${p.name}</td>
                  <td>${p.cpu}</td>
                  <td>${p.mem}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
    `
      : "<p>Loading <span>...</span></p>";

    this.innerHTML = `
      <link rel="stylesheet" href="${stylePath}">
      <div class="auth-container">
        <h2>Список процессов</h2>
        ${tableHtml}
      </div>
    `;

    this.querySelectorAll("th[data-sort]").forEach((th) => {
      console.log(123);

      th.addEventListener("click", () => {
        const key = th.getAttribute("data-sort") as keyof ProcessosItemType;
        if (!key) return;

        const isSame = this.state.sortKey === key;
        this.state.sortKey = key;
        this.state.sortAsc = isSame ? !this.state.sortAsc : true;
      });
    });
  }

  renderHeader(key: keyof ProcessosItemType, label: string) {
    const active = this.state.sortKey === key;
    const arrow = active ? (this.state.sortAsc ? "↑" : "↓") : "";
    return `<th data-sort="${key}">${label} ${arrow}</th>`;
  }
}

customElements.define("x-processos-list", ProcessosList);
