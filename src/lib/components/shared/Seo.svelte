<!-- src/lib/components/shared/Seo.svelte -->
<script lang="ts">
  import { page } from '$app/state';
  import {
    SITE_NAME,
    OG_IMAGE_PATH,
    OG_IMAGE_WIDTH,
    OG_IMAGE_HEIGHT,
    OG_IMAGE_ALT,
    siteTitle,
    absoluteUrl,
  } from '$lib/utils/seo';

  let {
    title,
    description,
    noindex = false,
  }: { title: string; description: string; noindex?: boolean } = $props();

  const fullTitle = $derived(siteTitle(title));
  const canonicalUrl = $derived(absoluteUrl(page.url.pathname));
  const ogImageUrl = absoluteUrl(OG_IMAGE_PATH);
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
  {#if noindex}
    <meta name="robots" content="noindex" />
  {/if}

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImageUrl} />
  <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
  <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
  <meta property="og:image:alt" content={OG_IMAGE_ALT} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImageUrl} />
  <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />

  <meta name="theme-color" content="#0a1531" />
</svelte:head>
