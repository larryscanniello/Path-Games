// vite.config.js
import { defineConfig } from 'vite';
import { reactRouter } from "vite";
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
            tailwindcss(),
            reactRouter(),
            tsconfigPaths(),
          ],
  // Optional: If your CRA build output was 'build', you can keep it the same
  // build: {
  //   outDir: 'build',
  // },
});