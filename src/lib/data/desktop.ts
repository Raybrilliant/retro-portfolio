// Desktop icons + window definitions.
// Edit labels, icons, default window sizes/titles here.

import type { IconName } from '$lib/types';

export interface WinState {
	id: string;
	title: string;
	icon: IconName;
	x: number;
	y: number;
	w: number;
	h: number;
	minimized: boolean;
}

export interface DesktopIcon {
	id: string;
	label: string;
	icon: IconName;
	win: Omit<WinState, 'minimized'>;
}

export const desktopIcons: DesktopIcon[] = [
	{
		id: 'hero',
		label: 'Raybrilliant OS',
		icon: 'computer',
		win: { id: 'hero', title: 'Raybrilliant OS', icon: 'computer', x: 0, y: 0, w: 600, h: 460 }
	},
	{
		id: 'work',
		label: 'My Work',
		icon: 'briefcase',
		win: {
			id: 'work',
			title: 'My Work',
			icon: 'briefcase',
			x: 0,
			y: 0,
			w: 860,
			h: 600
		}
	},
	{
		id: 'about',
		label: 'About Me',
		icon: 'about',
		win: { id: 'about', title: 'About Me', icon: 'about', x: 0, y: 0, w: 560, h: 460 }
	},
	{
		id: 'contact',
		label: 'Contact',
		icon: 'mail',
		win: { id: 'contact', title: 'Contact', icon: 'mail', x: 0, y: 0, w: 520, h: 420 }
	},
	{
		id: 'certificates',
		label: 'Certificates',
		icon: 'certificate',
		win: {
			id: 'certificates',
			title: 'Certificates Gallery',
			icon: 'certificate',
			x: 0,
			y: 0,
			w: 820,
			h: 600
		}
	},
	{
		id: 'resume',
		label: 'Resume',
		icon: 'doc',
		win: { id: 'resume', title: 'Resume.txt - Notepad', icon: 'doc', x: 0, y: 0, w: 520, h: 440 }
	},
	{
		id: 'projects',
		label: 'Projects',
		icon: 'folder',
		win: { id: 'projects', title: 'Projects', icon: 'folder', x: 0, y: 0, w: 860, h: 600 }
	},
	{
		id: 'winamp',
		label: 'Winamp Player',
		icon: 'winamp',
		win: { id: 'winamp', title: 'Winamp', icon: 'winamp', x: 0, y: 0, w: 320, h: 360 }
	},
	{
		id: 'snake',
		label: 'Snake Game',
		icon: 'snake',
		win: { id: 'snake', title: 'Snake Game', icon: 'snake', x: 0, y: 0, w: 420, h: 560 }
	},
	{
		id: 'minesweeper',
		label: 'Minesweeper',
		icon: 'minesweeper',
		win: {
			id: 'minesweeper',
			title: 'Minesweeper',
			icon: 'minesweeper',
			x: 0,
			y: 0,
			w: 380,
			h: 460
		}
	}
];
