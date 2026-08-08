import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for the production build path.
// The source in /src is standard React + JSX with root-absolute
// ("/src/...") imports, which Vite resolves the same way the no-build
// preview does, so no source changes are needed to move here.
//
// To switch from the no-build preview to Vite:
//   1. npm install
//   2. replace index.html with index.vite.html (see README)
//   3. npm run dev
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
