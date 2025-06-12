export async function initAuthFlow(): Promise<void> {
  try {
    const authBlock = document.querySelector<HTMLElement>("x-auth-block")!;
    const processosList =
      document.querySelector<HTMLElement>("x-processos-list")!;

    authBlock.addEventListener("login-success", (event: Event) => {
      const customEvent = event as CustomEvent;
      const loginData = customEvent.detail;
      console.log("Login successful:", loginData);

      // Показываем основной экран и прячем auth
      authBlock.style.display = "none";
      processosList.style.display = "block";
    });
  } catch (err) {
    console.error("Auth flow init error:", err);
  }
}

initAuthFlow();
