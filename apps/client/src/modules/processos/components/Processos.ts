export class ProcessosList extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  connectedCallback() {}

  render() {
    const stylePath = new URL("./style.css", import.meta.url).href;

    this.innerHTML = `
          <link rel="stylesheet" href="${stylePath}">
          
          <div class="auth-container">
            <h2>Welcome to AuthBlock</h2>
            <p>Please log in to continue.</p>
  
            <form class="auth-form">
              <input id="username" type="text" placeholder="Username" />
              <input id="password" type="password" placeholder="Password" />
              <button class="c-button" type="submit" label="Login"></button>
            </form>
  
          </div>
        `;
  }
}

customElements.define("x-processos-list", ProcessosList);
