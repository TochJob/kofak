import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@auth": path.resolve(__dirname, "src/modules/auth"),
      "@processos": path.resolve(__dirname, "src/modules/processos"),
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
});
