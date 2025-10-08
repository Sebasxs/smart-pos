import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
   plugins: [react(), tailwind()],
   clearScreen: false,
   server: {
      host: true,
      allowedHosts: ['localhost'],
   },
});
