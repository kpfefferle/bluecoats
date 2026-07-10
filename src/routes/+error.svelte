<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import PageContent from '$components/shared/PageContent.svelte';
  import PageHeader from '$components/shared/PageHeader.svelte';

  const notFound = $derived(page.status === 404);
  const title = $derived(notFound ? 'Page not found' : 'Something went wrong');
  const subtitle = $derived(
    notFound
      ? 'This page never made it past prelims.'
      : `${page.status}: ${page.error?.message ?? 'Unexpected error'}`,
  );
</script>

<svelte:head>
  <title>{notFound ? 'Page not found' : 'Error'} | Bluecoats Scores</title>
</svelte:head>

<PageHeader {title} {subtitle} />
<PageContent>
  <a
    href={resolve('/')}
    class="text-sm font-semibold text-brand-600 hover:text-brand-500"
  >
    Back to Today →
  </a>
</PageContent>
