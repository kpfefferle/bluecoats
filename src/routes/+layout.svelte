<script lang="ts">
  import '../app.css';
  import NavigationBar from '#components/nav/NavigationBar.svelte';
  import MobileTabBar from '#components/nav/MobileTabBar.svelte';
  import Footer from '#components/shared/Footer.svelte';
  import { onMount, type Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  // Mount effects run only after the whole tree has hydrated, so this marks
  // the point where every event handler is attached. E2E tests wait for it
  // before driving JS-only controls (see tests/e2e/hydration.ts).
  onMount(() => {
    document.documentElement.dataset['hydrated'] = '';
  });
</script>

<div class="flex min-h-full flex-col">
  <NavigationBar />
  <main class="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom,0))] md:pb-0">
    {@render children()}
    <Footer />
  </main>
  <MobileTabBar />
</div>
