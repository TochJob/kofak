export class CButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["label"];
  }

  // attributeChangedCallback() {
  //   this.render();
  // }

  connectedCallback() {
    this.render();
    // this.addListeners();
  }

  render() {
    const label = this.getAttribute("label");

    this.shadowRoot!.innerHTML = `
      <style>${css}</style>
      <button class="c-button">
        <slot>${label}</slot>
      </button>
    `;
  }

  addListeners() {
    const button = this.shadowRoot!.querySelector("button");
    button?.addEventListener("click", () => {
      this.dispatchEvent(new Event("click", { bubbles: true, composed: true }));
    });
  }
}
const css = `
 
`;
customElements.define("c-button", CButton);
