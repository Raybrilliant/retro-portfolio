// Auto-scan optional sound effects in src/lib/assets/sfx.
// Keys are filenames without extension, e.g. eat.mp3 -> 'eat'.
// If a key has no file, playSfx() silently does nothing.

const modules = import.meta.glob('../assets/sfx/*.{mp3,webm,wav,ogg,m4a}', {
	eager: true,
	query: '?url',
	import: 'default'
}) as Record<string, string>;

const sfx: Record<string, string> = {};
for (const [path, url] of Object.entries(modules)) {
	const file = path.split('/').pop() ?? path;
	const key = file.replace(/\.[^.]+$/, '');
	sfx[key] = url;
}

export function hasSfx(key: string): boolean {
	return key in sfx;
}

export function playSfx(key: string, volume = 0.4): void {
	const url = sfx[key];
	if (!url) return;
	try {
		const a = new Audio(url);
		a.volume = volume;
		a.play().catch(() => {});
	} catch {
		/* ignore */
	}
}
