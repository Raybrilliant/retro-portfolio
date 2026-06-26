<script lang="ts">
	import type { IconName } from '$lib/types';
	import { loadTracks, type Track } from '$lib/data';

	let {
		id,
		title = 'Winamp',
		icon = 'winamp' as IconName,
		x = 200,
		y = 60,
		z = 1,
		active = false,
		minimized = false,
		onActivate,
		onClose,
		onMinimize
	}: {
		id: string;
		title?: string;
		icon?: IconName;
		x?: number;
		y?: number;
		z?: number;
		active?: boolean;
		minimized?: boolean;
		onActivate?: (id: string) => void;
		onClose?: (id: string) => void;
		onMinimize?: (id: string) => void;
	} = $props();

	let px = $state(x);
	let py = $state(y);
	let dragging = $state(false);
	let dragOff = { x: 0, y: 0 };

	let audio: HTMLAudioElement | null = null;
	let currentIndex = $state(0);
	let isPlaying = $state(false);
	let volume = $state(0.7);
	let currentTime = $state(0);
	let duration = $state(0);
	let pendingPlay = $state(false);
	let tracks = $state<Track[]>([]);
	let loaded = $state(false);

	const current = $derived(tracks[currentIndex]);
	const hasTracks = $derived(tracks.length > 0);

	// Lazy-load the playlist manifest only when Winamp mounts (i.e. when the
	// user opens it). Audio files themselves are not preloaded (preload="none").
	$effect(() => {
		let cancelled = false;
		loadTracks().then((t) => {
			if (!cancelled) {
				tracks = t;
				loaded = true;
			}
		});
		return () => {
			cancelled = true;
		};
	});

	function fmt(s: number): string {
		if (!s || !isFinite(s)) return '0:00';
		const m = Math.floor(s / 60);
		const sec = Math.floor(s % 60);
		return `${m}:${sec.toString().padStart(2, '0')}`;
	}

	const progressPct = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);

	function activate() {
		onActivate?.(id);
	}

	function startDrag(e: PointerEvent) {
		activate();
		dragging = true;
		dragOff = { x: e.clientX - px, y: e.clientY - py };
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
		window.addEventListener('pointermove', onDrag);
		window.addEventListener('pointerup', endDrag);
	}
	function onDrag(e: PointerEvent) {
		if (!dragging) return;
		px = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - dragOff.x));
		py = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - dragOff.y));
	}
	function endDrag() {
		dragging = false;
		window.removeEventListener('pointermove', onDrag);
		window.removeEventListener('pointerup', endDrag);
	}

	function loadTrack(i: number, autoplay = true) {
		if (!hasTracks) return;
		currentIndex = ((i % tracks.length) + tracks.length) % tracks.length;
		pendingPlay = autoplay;
	}

	async function play() {
		if (!audio || !hasTracks) return;
		audio.volume = volume;
		try {
			await audio.play();
			isPlaying = true;
		} catch {
			isPlaying = false;
		}
	}
	function pause() {
		audio?.pause();
		isPlaying = false;
	}
	function stop() {
		if (!audio) return;
		audio.pause();
		audio.currentTime = 0;
		currentTime = 0;
		isPlaying = false;
	}
	function next() {
		loadTrack(currentIndex + 1, true);
	}
	function prev() {
		if (audio && audio.currentTime > 3) {
			audio.currentTime = 0;
			return;
		}
		loadTrack(currentIndex - 1, true);
	}

	function seek(e: MouseEvent) {
		if (!audio || duration <= 0) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const ratio = (e.clientX - rect.left) / rect.width;
		audio.currentTime = Math.max(0, Math.min(duration, ratio * duration));
	}

	function onTimeUpdate() {
		if (audio) currentTime = audio.currentTime;
	}
	function onLoaded() {
		if (audio) duration = audio.duration;
	}
	function onEnded() {
		// Auto-advance through the playlist, stopping after the last track.
		if (currentIndex < tracks.length - 1) {
			next();
		} else {
			isPlaying = false;
			currentTime = 0;
		}
	}

	$effect(() => {
		if (audio) audio.volume = volume;
	});

	// Play the current track whenever its URL changes (after Svelte updates the
	// <audio src> binding). Setting src already triggers a load, so we must NOT
	// call audio.load() here — doing so aborts the play() promise and the next
	// track ends up silent until you press Play.
	$effect(() => {
		const url = current?.url;
		if (!audio || !url) return;
		if (pendingPlay) {
			audio.currentTime = 0;
			play();
			pendingPlay = false;
		}
	});

	// visualizer bars
	const bars = Array.from({ length: 18 });
</script>

<div
	class="winamp anim-open"
	class:active
	class:minimized
	style="left:{px}px; top:{py}px; z-index:{z};"
>
	<!-- Title bar -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="wa-title"
		onpointerdown={startDrag}
		ondblclick={() => onMinimize?.(id)}
		role="presentation"
	>
		<span class="wa-logo">WINAMP</span>
		<div class="wa-tb-btns">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<button
				class="wa-tb-btn min"
				aria-label="Minimize"
				onpointerdown={(e) => e.stopPropagation()}
				onclick={() => onMinimize?.(id)}
			></button>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<button
				class="wa-tb-btn cls"
				aria-label="Close"
				onpointerdown={(e) => e.stopPropagation()}
				onclick={() => onClose?.(id)}
			></button>
		</div>
	</div>

	{#if hasTracks}
		<!-- Info display -->
		<div class="wa-info">
			<div class="wa-marquee">{current?.name ?? ''}</div>
			<div class="wa-time">{fmt(currentTime)} / {fmt(duration)}</div>
		</div>

		<!-- Visualizer -->
		<div class="wa-viz" class:playing={isPlaying}>
			{#each bars as _, i}
				<span class="bar" style="--i:{i}; --d:{(i % 5) * 0.12}s; --h:{20 + ((i * 7) % 60)}%"></span>
			{/each}
		</div>

		<!-- Progress bar (seek) -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="wa-progress" onclick={seek} role="presentation" title="Seek">
			<div class="wa-progress-fill" style="width:{progressPct}%"></div>
		</div>

		<!-- Transport controls -->
		<div class="wa-controls">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<button class="wa-btn" aria-label="Previous" onclick={prev} title="Previous">⏮</button>
			{#if isPlaying}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<button class="wa-btn play" aria-label="Pause" onclick={pause} title="Pause">⏸</button>
			{:else}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<button class="wa-btn play" aria-label="Play" onclick={play} title="Play">▶</button>
			{/if}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<button class="wa-btn" aria-label="Stop" onclick={stop} title="Stop">⏹</button>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<button class="wa-btn" aria-label="Next" onclick={next} title="Next">⏭</button>
		</div>

		<!-- Volume -->
		<div class="wa-volume">
			<span class="vol-label">VOL</span>
			<input type="range" min="0" max="1" step="0.01" bind:value={volume} aria-label="Volume" />
			<span class="vol-val">{Math.round(volume * 100)}</span>
		</div>

		<!-- Playlist -->
		<div class="wa-playlist win-scroll">
			<div class="pl-head">PLAYLIST · {tracks.length} tracks</div>
			{#each tracks as t, i}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<button
					class="pl-item"
					class:current={i === currentIndex}
					class:playing={i === currentIndex && isPlaying}
					onclick={() => loadTrack(i, true)}
					ondblclick={() => loadTrack(i, true)}
				>
					<span class="pl-idx">{(i + 1).toString().padStart(2, '0')}</span>
					<span class="pl-name">{t.name}</span>
					{#if i === currentIndex && isPlaying}<span class="pl-eq">▶</span>{/if}
				</button>
			{/each}
		</div>
	{:else if !loaded}
		<div class="wa-empty">
			<p>Loading playlist…</p>
		</div>
	{:else}
		<div class="wa-empty">
			<p>No tracks found in assets/music</p>
			<p class="sub">Add files to static/assets/music/ and list them in manifest.json.</p>
		</div>
	{/if}

	<!-- Hidden audio element -->
	<audio
		bind:this={audio}
		src={current?.url ?? ''}
		ontimeupdate={onTimeUpdate}
		onloadedmetadata={onLoaded}
		onended={onEnded}
		onplay={() => (isPlaying = true)}
		onpause={() => (isPlaying = false)}
		preload="none"
	></audio>
</div>

<style>
	.winamp {
		position: absolute;
		width: 320px;
		background: linear-gradient(180deg, #4a4a4a 0%, #2e2e2e 100%);
		border: 1px solid #000;
		border-radius: 2px;
		box-shadow:
			inset 1px 1px 0 #6a6a6a,
			inset -1px -1px 0 #111,
			3px 3px 10px rgba(0, 0, 0, 0.45);
		font-family: var(--win-font);
		color: #d4d4d4;
		padding: 2px;
		user-select: none;
	}
	.winamp.minimized {
		display: none;
	}
	.winamp.active {
		box-shadow:
			inset 1px 1px 0 #6a6a6a,
			inset -1px -1px 0 #111,
			4px 4px 14px rgba(0, 0, 0, 0.55);
	}

	/* Title bar */
	.wa-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 18px;
		background: linear-gradient(180deg, #d4a017 0%, #8a6a10 100%);
		padding: 0 3px 0 6px;
		cursor: move;
		border-bottom: 1px solid #000;
		touch-action: none;
	}
	.wa-logo {
		font-weight: 800;
		font-size: 11px;
		color: #1a1a1a;
		letter-spacing: 1px;
		text-shadow: 1px 1px 0 #f0d060;
	}
	.wa-tb-btns {
		display: flex;
		gap: 2px;
	}
	.wa-tb-btn {
		width: 14px;
		height: 14px;
		background: #1a1a1a;
		border: 1px solid #000;
		cursor: pointer;
		padding: 0;
		position: relative;
	}
	.wa-tb-btn.min::before {
		content: '';
		position: absolute;
		left: 3px;
		bottom: 3px;
		width: 6px;
		height: 2px;
		background: #d4d4d4;
	}
	.wa-tb-btn.cls::before,
	.wa-tb-btn.cls::after {
		content: '';
		position: absolute;
		left: 2px;
		top: 5px;
		width: 8px;
		height: 2px;
		background: #d4d4d4;
	}
	.wa-tb-btn.cls::before {
		transform: rotate(45deg);
	}
	.wa-tb-btn.cls::after {
		transform: rotate(-45deg);
	}

	/* Info */
	.wa-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #0a0a0a;
		border: 1px solid #000;
		margin: 2px 0;
		padding: 3px 6px;
		font-size: 11px;
	}
	.wa-marquee {
		color: #9bd64a;
		font-weight: 700;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-shadow: 0 0 4px rgba(155, 214, 74, 0.5);
	}
	.wa-time {
		color: #d4a017;
		font-variant-numeric: tabular-nums;
	}

	/* Visualizer */
	.wa-viz {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 48px;
		background: #050505;
		border: 1px solid #000;
		padding: 3px;
	}
	.wa-viz .bar {
		flex: 1;
		height: 20%;
		background: linear-gradient(180deg, #ff5a3c 0%, #d4a017 50%, #9bd64a 100%);
		opacity: 0.45;
	}
	.wa-viz.playing .bar {
		animation: vizbar 0.5s ease-in-out infinite alternate;
		animation-delay: var(--d);
		height: var(--h);
		opacity: 1;
	}
	@keyframes vizbar {
		from {
			height: 15%;
		}
		to {
			height: var(--h);
		}
	}

	/* Progress */
	.wa-progress {
		height: 10px;
		margin: 2px 0;
		background: #0a0a0a;
		border: 1px solid #000;
		cursor: pointer;
		position: relative;
	}
	.wa-progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #d4a017, #9bd64a);
		width: 0;
	}

	/* Controls */
	.wa-controls {
		display: flex;
		gap: 4px;
		justify-content: center;
		margin: 3px 0;
	}
	.wa-btn {
		width: 38px;
		height: 26px;
		background: linear-gradient(180deg, #5a5a5a 0%, #2a2a2a 100%);
		border: 1px solid #000;
		box-shadow: inset 1px 1px 0 #6a6a6a;
		color: #e4e4e4;
		font-size: 13px;
		cursor: pointer;
		padding: 0;
		transition:
			filter 0.1s ease,
			transform 0.08s ease;
	}
	.wa-btn:hover {
		filter: brightness(1.25);
	}
	.wa-btn:active {
		transform: translateY(1px);
		box-shadow: inset -1px -1px 0 #6a6a6a;
	}
	.wa-btn.play {
		background: linear-gradient(180deg, #d4a017 0%, #8a6a10 100%);
		color: #1a1a1a;
	}

	/* Volume */
	.wa-volume {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 2px 4px;
		font-size: 10px;
		color: #b4b4b4;
	}
	.vol-label {
		color: #d4a017;
		font-weight: 700;
	}
	.wa-volume input[type='range'] {
		flex: 1;
		accent-color: #d4a017;
		height: 4px;
	}
	.vol-val {
		width: 26px;
		text-align: right;
		color: #9bd64a;
		font-variant-numeric: tabular-nums;
	}

	/* Playlist */
	.wa-playlist {
		margin-top: 3px;
		max-height: 130px;
		overflow-y: auto;
		background: #0a0a0a;
		border: 1px solid #000;
	}
	.pl-head {
		padding: 3px 6px;
		font-size: 9px;
		color: #d4a017;
		letter-spacing: 1px;
		border-bottom: 1px solid #1a1a1a;
	}
	.pl-item {
		display: flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		background: transparent;
		border: none;
		border-bottom: 1px solid #141414;
		color: #b4b4b4;
		font-family: var(--win-font);
		font-size: 11px;
		text-align: left;
		padding: 3px 6px;
		cursor: pointer;
	}
	.pl-item:hover {
		background: #1a2230;
		color: #fff;
	}
	.pl-item.current {
		background: #2a1a05;
		color: #d4a017;
	}
	.pl-item.current.playing {
		color: #9bd64a;
	}
	.pl-idx {
		color: #666;
		width: 18px;
		flex-shrink: 0;
	}
	.pl-item.current .pl-idx {
		color: #d4a017;
	}
	.pl-name {
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.pl-eq {
		color: #9bd64a;
	}

	/* Empty */
	.wa-empty {
		padding: 20px 12px;
		text-align: center;
		color: #b4b4b4;
		font-size: 12px;
	}
	.wa-empty p {
		margin: 0 0 6px;
	}
	.wa-empty .sub {
		font-size: 10px;
		color: #777;
	}
</style>
