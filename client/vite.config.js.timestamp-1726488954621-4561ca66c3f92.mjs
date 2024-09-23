// vite.config.js
import { defineConfig } from "file:///home/mati/blef/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///home/mati/blef/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import preprocess from "file:///home/mati/blef/node_modules/svelte-preprocess/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => {
  return {
    plugins: [
      svelte({
        // This is required to get TS files working in svelte https://svelte.dev/docs/typescript
        preprocess: preprocess()
      })
    ],
    build: {
      outDir: "../public"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tYXRpL2JsZWYvY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9tYXRpL2JsZWYvY2xpZW50L3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL21hdGkvYmxlZi9jbGllbnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnO1xuaW1wb3J0IHByZXByb2Nlc3MgZnJvbSAnc3ZlbHRlLXByZXByb2Nlc3MnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgIHN2ZWx0ZSh7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyByZXF1aXJlZCB0byBnZXQgVFMgZmlsZXMgd29ya2luZyBpbiBzdmVsdGUgaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3MvdHlwZXNjcmlwdFxuICAgICAgICAgICAgICAgIHByZXByb2Nlc3M6IHByZXByb2Nlc3MoKSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgb3V0RGlyOiAnLi4vcHVibGljJyxcbiAgICAgICAgfSxcbiAgICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9QLFNBQVMsb0JBQW9CO0FBQ2pSLFNBQVMsY0FBYztBQUN2QixPQUFPLGdCQUFnQjtBQUd2QixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN0QyxTQUFPO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDTCxPQUFPO0FBQUE7QUFBQSxRQUVILFlBQVksV0FBVztBQUFBLE1BQzNCLENBQUM7QUFBQSxJQUNMO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDSCxRQUFRO0FBQUEsSUFDWjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
