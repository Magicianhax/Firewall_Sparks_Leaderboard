import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsDir: 'assets',
    copyPublicDir: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          
          if (/xlsx|xls/i.test(extType)) {
            // Keep Excel files in their original location without hash
            return 'assets/[name][extname]';
          }
          
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  base: mode === 'development' ? '/' : '/Firewall_Sparks_Leaderboard/'
}));
