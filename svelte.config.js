import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // Unknown paths bypass the worker (routes.include below), so the static
      // 404.html Cloudflare serves for asset misses must be an SPA shell that
      // hydrates into src/routes/+error.svelte instead of unstyled plaintext.
      fallback: 'spa',
      // Only the two server-side redirect routes invoke the Pages worker; every
      // other path is served as a static asset. Without this, the adapter emits
      // one exclude rule per prerendered page (~180) and Cloudflare's 100-rule
      // _routes.json cap silently drops the overflow, sending those pages
      // through the worker on every request.
      routes: {
        include: ['/tour', '/daily-ranking'],
        exclude: [],
      },
    }),
    prerender: {
      entries: ['*'],
    },
    alias: {
      $components: 'src/lib/components',
      $data: 'src/lib/data',
      $src: 'src',
    },
  },
};

export default config;
