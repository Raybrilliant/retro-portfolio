// Lazy music loader.
//
// Audio files live as STATIC assets in static/assets/music/ (served at
// /assets/music/...). They are NOT bundled by Vite and NOT preloaded.
//
// Playlist metadata is fetched lazily from /assets/music/manifest.json only
// when Winamp is opened. The audio element uses preload="none", so a track's
// bytes are only fetched when the user presses Play (or auto-next runs after a
// user gesture). Only the current track is ever attached to the <audio> src.
//
// manifest.json format:
//   [
//     { "file": "song.mp3", "name": "Song Title" },
//     { "file": "other.m4a", "name": "Other Title" }
//   ]
// `name` is optional; if omitted it is derived from the filename.

export interface Track {
	name: string; // display name
	file: string; // original filename
	url: string; // resolved static asset url
}

const MUSIC_BASE = '/assets/music';

function prettyName(file: string): string {
	const base = file.replace(/\.[^.]+$/, '');
	return base
		.replace(/[-_]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

let cache: Track[] | null = null;

export async function loadTracks(): Promise<Track[]> {
	if (cache) return cache;
	try {
		const res = await fetch(`${MUSIC_BASE}/manifest.json`, { cache: 'force-cache' });
		if (!res.ok) {
			cache = [];
			return cache;
		}
		const data = await res.json();
		const list: unknown[] = Array.isArray(data) ? data : [];
		cache = list
			.map((entry) => {
				const file = typeof entry === 'string' ? entry : ((entry as { file?: string })?.file ?? '');
				if (!file) return null;
				const name =
					typeof entry === 'string' || !(entry as { name?: string })?.name
						? prettyName(file)
						: (entry as { name: string }).name;
				return { file, name, url: `${MUSIC_BASE}/${encodeURI(file)}` } satisfies Track;
			})
			.filter((t): t is Track => t !== null)
			.sort((a, b) => a.name.localeCompare(b.name));
		return cache;
	} catch {
		cache = [];
		return cache;
	}
}
