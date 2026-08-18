// Project items: personal / side projects / experiments / tools.
// Images live in static/projects/ and are referenced as /projects/<file>.

export type ProjectItem = {
	id: string;
	title: string;
	category: string;
	year: string;
	image?: string;
	description: string;
	technologies: string[];
	link?: string;
};

export const projectItems: ProjectItem[] = [
  {
		id: 'spendy',
		title: 'Spendy',
		category: 'Finance',
		year: '2026',
		image: '/projects/spendy.webp',
		description: 'Spendy is a mobile app that helps you track your expenses and save money.',
		technologies: ['Svelte', 'GASP', 'SQLite'],
		link: 'https://spendy.raybrilliant.my.id'
	},
	{
		id: 'moslem',
		title: 'Moslem',
		category: 'Lifestyle',
		year: '2024',
		image: '/projects/moslem.webp',
		description: 'Ad-free and comfortable Muslim companion for prayer times and reading the Quran',
		technologies: ['Typescript', 'NextJs', 'Framer Motion','PWA'],
		link: 'https://moslem-app.pages.dev/'
	},
	{
		id: 'netplix',
		title: 'Netplix',
		category: 'Entertainment',
		year: '2024',
		image: '/projects/netplix.webp',
		description: 'Watch Movies from Netflix, Disney+, Apple TV+, and Other Streaming Services for Free with Minimal Ads and No Registration.',
		technologies: ['Typescript', 'NextJs'],
		link: 'https://www.netplix.xyz/'
	},
	// {
	// 	id: 'portfolio-os',
	// 	title: 'Portfolio OS',
	// 	category: 'Experiment',
	// 	year: '2026',
	// 	image: '/projects/portfolio-os.jpg',
	// 	description: 'This whole site — a Windows 98 desktop OS portfolio experience.',
	// 	technologies: ['SvelteKit', 'TypeScript', 'Tailwind'],
	// 	link: '#'
	// }
];
