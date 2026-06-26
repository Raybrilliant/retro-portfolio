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
	{
		id: 'qmis',
		title: 'QMIS',
		category: 'Finance',
		year: '2023',
		image: '/projects/qmis.webp',
		description: 'The dynamic QRIS app that requires no registration. Simplify your transactions with ease!',
		technologies: ['Typescript', 'NextJs'],
		link: 'https://qmis.pages.dev/'
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
