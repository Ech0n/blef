import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      // This is required to get TS files working in svelte https://svelte.dev/docs/typescript
      preprocess: preprocess(),
    }),
  ],
});
