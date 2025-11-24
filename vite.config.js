import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Cargamos variables de entorno de Vite
  const env = loadEnv(mode, process.cwd(), "");

  const isProd = mode === "production";

  return {
    plugins: [react(), tailwindcss()],
    base: isProd ? "/novaglow/" : "/",
  };
});
