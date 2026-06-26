<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { seo, personSchema, websiteSchema } from '$lib/data';

	let { children } = $props();

	const personJson = JSON.stringify(personSchema);
	const websiteJson = JSON.stringify(websiteSchema);
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={seo.keywords.join(', ')} />
	<meta name="author" content={seo.fullName} />
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<meta name="googlebot" content="index, follow" />
	<link rel="canonical" href={`${seo.siteUrl}/`} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={seo.brand} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={`${seo.siteUrl}/`} />
	<meta property="og:image" content={seo.ogImage} />
	<meta property="og:locale" content={seo.locale} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.ogImage} />
	<meta name="twitter:creator" content={seo.twitter} />

	<!-- Structured data: Person (powers name search) + WebSite -->
	{@html `<script type="application/ld+json">${personJson}</script>`}
	{@html `<script type="application/ld+json">${websiteJson}</script>`}

	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
