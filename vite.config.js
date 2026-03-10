import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default {
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/hf": {
        target: "https://huggingface.co",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/hf/, ""),
      },
    },
  },
};

