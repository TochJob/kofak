import API_URL_LIST from "@/api/api.config.ts";

import type { LoginResponse } from "./typos.ts";

export class AuthBlock extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.addListeners();
  }

  addListeners() {
    const form = this.querySelector("form");
    const usernameInput = this.querySelector("#username") as HTMLInputElement;
    const passwordInput = this.querySelector("#password") as HTMLInputElement;

    usernameInput.addEventListener("focus", () => {
      this.clearErrors();
    });

    passwordInput.addEventListener("focus", () => {
      this.clearErrors();
    });

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      this.clearErrors();

      let hasError = false;

      if (!usernameInput.value.trim()) {
        this.showError(usernameInput, "Username is required.");
        hasError = true;
      }

      if (!passwordInput.value.trim()) {
        this.showError(passwordInput, "Password is required.");
        hasError = true;
      }

      if (hasError) return;

      const payload = {
        username: usernameInput.value,
        password: passwordInput.value,
      };

      try {
        const response = await fetch(API_URL_LIST.apiLogin, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data: LoginResponse = await response.json();

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
    });
  }

  showError(input: HTMLInputElement, message: string) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    input.parentElement?.appendChild(errorElement);
  }

  clearErrors() {
    const errorMessages = this.querySelectorAll(".error-message");
    errorMessages?.forEach((error) => error.remove());
  }

  render() {
    const stylePath = new URL("./style.css", import.meta.url).href;

    this.innerHTML = `
        <link rel="stylesheet" href="${stylePath}">
        
        <div class="auth-container">
          <h2>Welcome to AuthBlock</h2>
          <p>Please log in to continue.</p>

          <form class="auth-form">
            <div class="input-group">
              <input id="username" type="text" placeholder="Username" />
            </div>
            <div class="input-group">
              <input id="password" type="password" placeholder="Password" />
            </div>
            <button class="auth-form__button" type="submit">Login</button>
          </form>
        </div>
      `;
  }
}

customElements.define("x-auth-block", AuthBlock);
