<script lang="ts">
	import winLogo from '$lib/assets/win98-logo.svg';
	import startupSound from '$lib/assets/startup-sound.m4a';

	let { onDone }: { onDone: () => void } = $props();

	let stage = $state<'idle' | 'bios' | 'win98' | 'welcome'>('idle');
	let progress = $state(0);
	let biosLines = $state<string[]>([]);
	let audio: HTMLAudioElement | null = null;
	let muted = $state(false);

	const allLines = [
		'Raybrilliant OS BIOS v1.98',
		'Copyright (C) 2023-2026 Raybrilliant, Inc.',
		'',
		'CPU: Retro Pentium II Compatible @ 350MHz',
		'Memory Test: 65536K OK',
		'Detecting Primary Master ... RAY-HDD-98',
		'Detecting IDE devices ... OK',
		'Initializing USB Controllers ... OK',
		'Loading Bliss Hills wallpaper driver ... OK',
		'',
		'Press DEL to enter SETUP, F1 to continue ...'
	];

	function playStartupChime() {
		if (muted) return;
		try {
			audio ??= new Audio(startupSound);
			audio.currentTime = 0;
			audio.volume = 0.7;
			const p = audio.play();
			if (p && typeof p.catch === 'function') p.catch(() => {});
		} catch {
			/* ignore */
		}
	}

	function beginBoot() {
		if (stage !== 'idle') return;
		// User gesture: unlock audio now so the chime can play shortly after.
		try {
			audio ??= new Audio(startupSound);
			audio.volume = 0;
			audio
				.play()
				.then(() => {
					if (audio) {
						audio.pause();
						audio.volume = 0.7;
					}
				})
				.catch(() => {});
		} catch {
			/* ignore */
		}
		stage = 'bios';
	}

	function toggleMute(e: MouseEvent) {
		e.stopPropagation();
		muted = !muted;
		if (muted && audio) {
			audio.pause();
			audio.currentTime = 0;
		}
	}

	$effect(() => {
		if (stage !== 'bios') return;
		let i = 0;
		biosLines = [];
		const t = setInterval(() => {
			biosLines = [...biosLines, allLines[i++] ?? ''];
			if (i >= allLines.length) {
				clearInterval(t);
				setTimeout(() => (stage = 'win98'), 800);
			}
		}, 170);
		return () => clearInterval(t);
	});

	$effect(() => {
		if (stage !== 'win98') return;
		progress = 0;
		// Play the iconic startup chime as the logo appears.
		playStartupChime();
		const t = setInterval(() => {
			progress = Math.min(100, progress + 4 + Math.random() * 6);
			if (progress >= 100) {
				clearInterval(t);
				setTimeout(() => (stage = 'welcome'), 500);
			}
		}, 90);
		return () => clearInterval(t);
	});

	$effect(() => {
		if (stage !== 'welcome') return;
		const t = setTimeout(onDone, 1700);
		return () => clearTimeout(t);
	});
</script>

<div class="boot" class:win98={stage !== 'bios'} class:welcome={stage === 'welcome'}>
	{#if stage === 'idle'}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="idle-overlay" onclick={beginBoot} role="presentation">
			<div class="idle-card">
				<img class="boot-logo" src={winLogo} alt="Windows 98 logo" width="80" height="69" />
				<h2>Raybrilliant OS</h2>
				<p>Click to boot</p>
				<!-- <span class="idle-hint">(sound on)</span> -->
			</div>
			<button
				class="mute-btn"
				onclick={toggleMute}
				title="{muted ? 'Unmute' : 'Mute'} startup sound"
			>
				{muted ? '🔇' : '🔊'}
			</button>
		</div>
	{:else if stage === 'bios'}
		<div class="bios">
			{#each biosLines as line}
				<div class="line">{line || '\u00a0'}</div>
			{/each}
			<div class="line caret">_</div>
		</div>
	{:else if stage === 'win98'}
		<div class="win98boot">
			<div class="logo-wrap">
				<img class="boot-logo" src={winLogo} alt="Windows 98 logo" width="110" height="95" />
				<div class="brand">
					<div class="brand-title">Ray<span class="me">brilliant</span></div>
					<div class="brand-sub">OS <span class="sep98">02</span></div>
				</div>
			</div>
			<div class="bar-wrap">
				<div class="bar" style="width:{progress}%"></div>
			</div>
			<div class="boot-hint">Loading your portfolio…</div>
		</div>
	{:else if stage === 'welcome'}
		<div class="welcome-screen">
			<div class="welcome-card anim-open">
				<img class="boot-logo" src={winLogo} alt="Windows 98 logo" width="70" height="60" />
				<h1>Welcome</h1>
				<p>Raybrilliant OS is ready.</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.boot {
		position: fixed;
		inset: 0;
		z-index: 100000;
		background: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Courier New', monospace;
	}

	.idle-overlay {
		position: relative;
		background: transparent;
		border: none;
		cursor: pointer;
		font-family: var(--win-font);
		color: #fff;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		outline: none;
	}
	.idle-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		text-align: center;
	}
	.boot-logo {
		display: block;
		filter: drop-shadow(2px 2px 0 rgba(255, 255, 255, 0.15));
	}
	.idle-card h2 {
		font-size: 24px;
		font-weight: 800;
		margin: 6px 0 0;
		letter-spacing: -0.5px;
	}
	.idle-card p {
		font-size: 13px;
		color: #c8d8ff;
		margin: 0;
	}
	.idle-hint {
		font-size: 10px;
		opacity: 0.6;
		letter-spacing: 1px;
	}
	.mute-btn {
		position: absolute;
		right: 16px;
		bottom: 16px;
		width: 32px;
		height: 32px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		cursor: pointer;
		font-size: 14px;
		color: #000;
	}
	.mute-btn:active {
		border-color: #404040 #fff #fff #404040;
	}
	.bios {
		position: absolute;
		inset: 24px;
		color: #d8d8d8;
		font-size: 15px;
		line-height: 1.35;
		text-shadow: 0 0 4px rgba(120, 200, 120, 0.5);
	}
	.bios .line {
		white-space: pre-wrap;
	}

	.win98boot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 28px;
		font-family: var(--win-font);
	}
	.logo-wrap {
		display: flex;
		align-items: center;
		gap: 18px;
	}
	.brand-title {
		font-size: 38px;
		font-weight: 800;
		color: #fff;
		letter-spacing: -1px;
	}
	.brand-title .me {
		color: #f5c518;
	}
	.brand-sub {
		font-size: 16px;
		color: #c8d8ff;
		letter-spacing: 2px;
	}
	.brand-sub .sep98 {
		color: #f5c518;
	}

	.bar-wrap {
		width: 240px;
		height: 16px;
		background: #000;
		border: 1px solid #c0c0c0;
		padding: 2px;
	}
	.bar {
		height: 100%;
		background: linear-gradient(90deg, #1084d0, #6fb0ef);
		transition: width 0.09s linear;
	}

	.boot-hint {
		color: #c8d8ff;
		font-size: 12px;
		letter-spacing: 1px;
	}

	.welcome-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		color: #fff;
		text-align: center;
	}
	.welcome-card h1 {
		font-size: 32px;
		margin: 6px 0 0;
		font-family: var(--win-font);
		font-weight: 800;
	}
	.welcome-card p {
		font-size: 13px;
		color: #c8d8ff;
	}
</style>
