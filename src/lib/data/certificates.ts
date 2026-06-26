// Certificates data.
// Drop image files into static/certificates/ and reference them as
// /certificates/<file> (SvelteKit serves the static/ folder at the site root).

export type Certificate = {
	id: string;
	title: string;
	issuer: string;
	year: string;
	image: string;
	description?: string;
};

export const certificates: Certificate[] = [
 	{
		id: '1',
		title: 'Front End Development Libraries',
		issuer: 'freeCodeCamp',
		year: '2024',
		image: '/certificates/freeCodeCamp-front-end.webp',
		description: 'built the following projects and got all automated test suites to pass: Build a Random Quote Machine, Build a Markdown Previewer, Build a Drum Machine, Build a JavaScript Calculator, Build a 25 + 5 Clock'
	},
	{
		id: '2',
		title: 'Responsive Web Design',
		issuer: 'freeCodeCamp',
		year: '2024',
		image: '/certificates/freeCodeCamp-responsive.webp',
		description: 'built the following projects and got all automated test suites to pass: Build a Survey Form, Build a Tribute Page, Build a Technical Documentation Page, Build a Product Landing Page, Build a Personal Portfolio Webpage'
	},
	// {
	// 	id: 'it-support',
	// 	title: 'IT Support Professional',
	// 	issuer: 'Coursera',
	// 	year: '2022',
	// 	image: '/certificates/it-support-professional.jpg',
	// 	description: 'IT support fundamentals, troubleshooting, networking, and system administration.'
	// }
];
