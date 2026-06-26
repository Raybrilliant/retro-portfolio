// Work items: real/production work done for clients, institutions, offices.
// Images live in static/work/ and are referenced as /work/<file>.

export type WorkItem = {
	id: string;
	title: string;
	client: string;
	year: string;
	type: string;
	image?: string;
	description: string;
	technologies: string[];
	link?: string;
};

export const workItems: WorkItem[] = [
	{
		id: 'solusi',
		title: 'SOLUSI',
		client: 'Kementerian Agama Kota Probolinggo',
		year: '2026',
		type: 'Government Web System',
		image: '/work/solusi.webp',
		description:
			'Sistem Online Unggul Terintegrasi untuk mendukung layanan dan informasi resmi instansi.',
		technologies: ['Astro', 'ElysiaJS', 'PostgreSQL', 'REST'],
		link: 'https://kemenagkotaprobolinggo.id/'
	},
	{
		id: 'sicakep',
		title: 'SICAKEP',
		client: 'Kementerian Agama Kota Probolinggo',
		year: '2026',
		type: 'Internal Management System',
		image: '/work/sicakep.webp',
		description:
			'Dashboard manajemen kepegawaian internal untuk monitoring catatan kinerja harian pegawai.',
		technologies: ['SvelteKit', 'TypeScript', 'ElysiaJS', 'REST'],
		link: 'https://sicakep.kemenagkotaprobolinggo.id'
	},
	{
		id: 'portal-cuti',
		title: 'Leave Portal',
		client: 'Kementerian Agama Kota Probolinggo',
		year: '2026',
		type: 'Internal Management System',
		image: '/work/cuti.webp',
		description: 'Portal layanan untuk internal pegawai mengajukan, mengelola, dan memonitor cuti.',
		technologies: ['SvelteKit', 'TypeScript', 'ElysiaJS', 'REST'],
		link: 'https://cuti.kemenagkotaprobolinggo.id'
	},
	{
		id: 'portal-m2kp',
		title: 'Official School Portal',
		client: 'MAN 2 Kota Probolinggo',
		year: '2024',
		type: 'Public Web System',
		image: '/work/portal-m2kp.webp',
		description: 'Offers information about the school with an engaging design tailored to the needs of the community, prospective students, and parents.',
		technologies: ['NextJS', 'React', 'ShadCN'],
		link: 'https://man2kotaprob.pages.dev/'
	},
	{
		id: 'individual-traning-plan',
		title: 'Individual Training Plan',
		client: 'Kalbe Farma',
		year: '2023',
		type: 'Internal Management System',
		image: '/work/individual-traning-plan.webp',
		description: 'Kalbe first app for efficient and personalized employee training management.',
		technologies: ['Laravel', 'Bootstrap', 'MySQL'],
		link: 'https://rpkc.kalbe.site/'
	},
];
