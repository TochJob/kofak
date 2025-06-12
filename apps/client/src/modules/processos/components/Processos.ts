import API_URL_LIST from "@/api/api.config.ts";
const { apiGetProcessos } = API_URL_LIST;

export class ProcessosList extends HTMLElement {
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
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      this.dispatchEvent(
        new CustomEvent("login-success", {
          detail: data,
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  }

  render() {
    const stylePath = new URL("./style.css", import.meta.url).href;

    this.innerHTML = `
          <link rel="stylesheet" href="${stylePath}">
          
          <div class="auth-container">
            <h2>Welcome to AuthBlock</h2>
            <p>Please log in to continue.</p>
          </div>
        `;
  }
}

customElements.define("x-processos-list", ProcessosList);
