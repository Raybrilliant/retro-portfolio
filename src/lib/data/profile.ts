// Profile / About Me data
// Edit this file to update personal info, bio, facts, and contact details.

export const profile = {
	name: 'Rey',
	company: 'Ministry of Religious Affairs Republic of Indonesia',
	role: 'Full-Stack Web Developer & Government IT',
	heroBadge: 'Raybrilliant OS · Build 2026',
	heroTitle: "Hi, I'm Rey",
	heroSub: 'Full-stack web developer, government IT guy, and digital problem solver.',
	tagline: 'Rey · Full-Stack Developer · Government IT · Digital Problem Solver',
	bio: `Hi, I'm Rey — a full-stack web developer and government IT professional from East Java, Indonesia. Behind the “Rey” alias is Raihan Fikri Brilliansyach. I build web applications, digital public service systems, and internal tools with a focus on usability, performance, and maintainability. I enjoy working with Astro, Svelte, React, Laravel, Elysia, servers, and unique interfaces that make technology feel fun again. Like my motto “Be Unique and Stay Different”.`,
	facts: [
		{ label: 'Name', value: 'Raihan Fikri Brilliansyach' },
		{ label: 'Also known as', value: 'Rey / Raybrilliant' },
		{ label: 'Role', value: 'Full-Stack Web Developer & Government IT' },
		{
			label: 'Current Work',
			value: 'Pranata Komputer Ahli Pertama at Ministry of Religious Affairs RI'
		},
		{
			label: 'Focus',
			value: 'Web apps, digital services, performance, efficiency, and maintainability'
		},
		{ label: 'Stack', value: 'Astro, Svelte, React, Elysia, Laravel, PostgreSQL' },
		{ label: 'Systems', value: 'Server Administration, Docker, Linux, Windows, Mac' },
		{ label: 'Vibe', value: 'Practical builder, calm troubleshooter, DJ Angkot enjoyer' }
	] as { label: string; value: string }[]
};

export const contact = {
	email: 'hello@raybrilliant.my.id',
	phone: '',
	linkedin: 'www.linkedin.com/in/raybrilliant',
	portfolio: 'raybrilliant.my.id',
	heading: 'Contact',
	hint: "Drop a message and I'll get back when I'm not fighting bugs, servers, or government paperwork.",
	placeholder: 'Hello Rey…'
};

// Hero window action buttons
export const heroButtons = [
	{ id: 'work', label: 'View Work' },
	{ id: 'about', label: 'About Me' },
	{ id: 'contact', label: 'Contact' }
] as { id: string; label: string }[];
