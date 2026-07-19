<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import PageContent from '$components/shared/PageContent.svelte';
  import PageHeader from '$components/shared/PageHeader.svelte';
  import Seo from '$components/shared/Seo.svelte';

  const notFound = $derived(page.status === 404);
  const title = $derived(notFound ? 'Page not found' : 'Something went wrong');
  const subtitle = $derived(
    notFound
      ? 'This page never made it past prelims.'
      : `${page.status}: ${page.error?.message ?? 'Unexpected error'}`,
  );
</script>

<Seo
  title={notFound ? 'Page not found' : 'Error'}
  description="This page never made it past prelims. Head back to the Bluecoats scores."
  noindex
/>

<PageHeader {title} {subtitle} />
<PageContent>
  <a
    href={resolve('/')}
    class="text-brand-600 hover:text-brand-500 text-sm font-semibold"
  >
    Back to Today →
  </a>
</PageContent>
