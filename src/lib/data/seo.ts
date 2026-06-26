// Central SEO configuration.
// Edit this file to update how search engines and social previews represent the site.
// The real name below is what makes the site discoverable when people search for it.

export const seo = {
	fullName: 'Raihan Fikri Brilliansyach',
	alias: 'Rey',
	brand: 'Raybrilliant OS',
	role: 'Full-Stack Web Developer & Government IT',
	tagline:
		'Full-stack web developer, government IT guy, and digital problem solver from Indonesia.',
	domain: 'raybrilliant.my.id',
	siteUrl: 'https://raybrilliant.my.id',
	locale: 'en',

	// Indexable title + description used in <title>, Open Graph, Twitter, and JSON-LD.
	title: 'Raihan Fikri Brilliansyach — Full-Stack Web Developer Portfolio',
	shortTitle: 'Raybrilliant OS — Portfolio',
	description:
		'Portfolio of Raihan Fikri Brilliansyach (Rey), a full-stack web developer and government IT professional from Indonesia. Explore Reybrilliant OS — an interactive Windows 98-style portfolio showcasing work, projects, certificates, mini-games, and more.',
	keywords: [
		'Raihan Fikri Brilliansyach',
		'Reybrilliant',
		'Rey',
		'full-stack web developer',
		'web developer Indonesia',
		'government IT',
		'Pranata Komputer',
		'portfolio',
		'Svelte',
		'SvelteKit',
		'Laravel',
		'Astro',
		'React',
		'Elysia',
		'PostgreSQL',
		'Windows 98 portfolio'
	],

	// Social preview image. Drop a 1200x630 PNG at static/og.png to populate this.
	ogImage: 'https://raybrilliant.my.id/og.png',
	twitter: '@raybrilliant',
	linkedin: 'https://www.linkedin.com/in/raybrilliant',
	email: 'hello@raybrilliant.my.id',
	worksFor: 'Ministry of Religious Affairs Republic of Indonesia',
	knowsAbout: [
		'Svelte',
		'SvelteKit',
		'React',
		'Astro',
		'Laravel',
		'Elysia',
		'PostgreSQL',
		'Docker',
		'Government digital services'
	]
};

// JSON-LD structured data. Helps Google connect this site to the name
// "Raihan Fikri Brilliansyach" and surface rich results for person searches.
export const personSchema = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: seo.fullName,
	alternateName: [seo.alias, seo.brand],
	jobTitle: seo.role,
	url: seo.siteUrl,
	email: `mailto:${seo.email}`,
	image: seo.ogImage,
	sameAs: [seo.linkedin],
	worksFor: {
		'@type': 'Organization',
		name: seo.worksFor
	},
	knowsAbout: seo.knowsAbout,
	description: seo.description
};

export const websiteSchema = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: seo.brand,
	url: seo.siteUrl,
	author: { '@type': 'Person', name: seo.fullName },
	publisher: { '@type': 'Person', name: seo.fullName }
};
