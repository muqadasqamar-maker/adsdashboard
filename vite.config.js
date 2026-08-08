import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React config.
//   npm install && npm run dev      -> local dev server
//   npm run build                   -> production bundle in dist/
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
