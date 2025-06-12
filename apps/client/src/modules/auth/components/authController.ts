import type { LoginResponse } from "./typos";

export async function initAuthFlow(): Promise<void> {
  try {
    const authBlock = document.querySelector<HTMLElement>("x-auth-block")!;
    const processosList =
      document.querySelector<HTMLElement>("x-processos-list")!;

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      authBlock.addEventListener("login-success", (event: Event) => {
        const customEvent = event as CustomEvent<LoginResponse>;
        const loginData = customEvent.detail;

        localStorage.setItem("authToken", loginData.token);

        authBlock.style.display = "none";
        processosList.style.display = "block";
      });
    } else {
      authBlock.style.display = "none";
      processosList.style.display = "block";
    }
  } catch (err) {
    console.error("Auth flow init error:", err);
  }
}

initAuthFlow();
