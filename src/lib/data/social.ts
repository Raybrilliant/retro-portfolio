// Social media links shown inside the Internet Explorer app.
// Edit handles/URLs here to point to your real profiles.

export type SocialGlyph = 'instagram' | 'linkedin' | 'github';

export interface SocialLink {
	id: string;
	label: string;
	handle: string;
	url: string;
	blurb: string;
	glyph: SocialGlyph;
	accent: string;
}

export const socialLinks: SocialLink[] = [
	{
		id: 'instagram',
		label: 'Instagram',
		handle: '@raybrilliant',
		url: 'https://www.instagram.com/raybrilliant',
		blurb: 'Daily photos, builds, and behind-the-scenes moments.',
		glyph: 'instagram',
		accent: '#c13584'
	},
	{
		id: 'linkedin',
		label: 'LinkedIn',
		handle: 'in/raybrilliant',
		url: 'https://www.linkedin.com/in/raybrilliant',
		blurb: 'Professional profile, work history, and endorsements.',
		glyph: 'linkedin',
		accent: '#0a66c2'
	},
	{
		id: 'github',
		label: 'GitHub',
		handle: 'github.com/raybrilliant',
		url: 'https://github.com/raybrilliant',
		blurb: 'Open-source code, side projects, and gists.',
		glyph: 'github',
		accent: '#24292f'
	}
];

// The retro "homepage" IE opens to.
export const ieHomePage = {
	url: 'http://www.raybrilliant.my.id/favorites.htm',
	title: 'Reybrilliant Online — Favorites'
};