<script lang="ts">
	import bliss from '$lib/assets/bliss-hill.jpg';
	import mePhoto from '$lib/assets/me.jpg';
	import notifySound from '$lib/assets/notify.m4a';
	import Icon from '$lib/components/Icon.svelte';
	import Window from '$lib/components/Window.svelte';
	import StartMenu from '$lib/components/StartMenu.svelte';
	import Taskbar from '$lib/components/Taskbar.svelte';
	import BootScreen from '$lib/components/BootScreen.svelte';
	import ShutdownScreen from '$lib/components/ShutdownScreen.svelte';
	import Winamp from '$lib/components/Winamp.svelte';
	import SnakeGame from '$lib/components/SnakeGame.svelte';
	import Minesweeper from '$lib/components/Minesweeper.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import ExplorerApp from '$lib/components/ExplorerApp.svelte';
	import AchievementToast from '$lib/components/system/AchievementToast.svelte';
	import type { IconName } from '$lib/types';
	import {
		desktopIcons,
		type WinState,
		resumeText,
		profile,
		contact,
		heroButtons,
		certificates,
		workItems,
		projectItems
	} from '$lib/data';

	let booted = $state(false);

	let windows = $state<WinState[]>([]);
	let zCounter = $state(10);
	let activeId = $state<string | null>(null);
	let startOpen = $state(false);
	let selectedIcon = $state<string | null>(null);
	let tooltip = $state<{ text: string; x: number; y: number } | null>(null);
	let shuttingDown = $state(false);
	let toast = $state<string | null>(null);

	function showToast(msg: string) {
		toast = msg;
		try {
			const a = new Audio(notifySound);
			a.volume = 0.5;
			a.play().catch(() => {});
		} catch {
			/* ignore */
		}
		setTimeout(() => {
			if (toast === msg) toast = null;
		}, 3200);
	}

	// Open hero window automatically after boot.
	// Desktop: bottom-right. Mobile: top-left.
	$effect(() => {
		if (booted && windows.length === 0) {
			const hero = desktopIcons.find((d) => d.id === 'hero')!.win;
			const vw = window.innerWidth;
			const vh = window.innerHeight - 44; // taskbar
			const isMobile = vw <= 640;
			const w = Math.max(280, Math.min(hero.w, vw - 8));
			const h = Math.max(180, Math.min(hero.h, vh - 8));
			const x = isMobile ? 2 : Math.max(2, vw - w - 12);
			const y = isMobile ? 2 : Math.max(2, vh - h - 12);
			windows = [{ ...hero, w, h, x, y, minimized: false }];
			activeId = 'hero';
		}
	});

	function zIndexFor(id: string) {
		return id === activeId ? zCounter + 1 : zCounter;
	}

	// ---- Unified Explorer (single window, switches content in place) ----
	type ExplorerSection = 'work' | 'projects' | 'certificates';
	const EXPLORER_SECTIONS: ExplorerSection[] = ['work', 'projects', 'certificates'];
	let explorerSection = $state<ExplorerSection>('work');

	function isExplorerSection(id: string): id is ExplorerSection {
		return (EXPLORER_SECTIONS as string[]).includes(id);
	}
	function explorerTitleFor(s: ExplorerSection): string {
		return s === 'work' ? 'My Work' : s === 'projects' ? 'Projects' : 'Certificates Gallery';
	}
	function explorerIconFor(s: ExplorerSection): IconName {
		return s === 'work' ? 'briefcase' : s === 'projects' ? 'folder' : 'certificate';
	}
	function explorerStatusFor(s: ExplorerSection): string {
		return s === 'work'
			? `${workItems.length} work item(s)`
			: s === 'projects'
				? `${projectItems.length} project item(s)`
				: `${certificates.length} object(s)`;
	}

	function syncExplorerWindow(s: ExplorerSection) {
		const title = explorerTitleFor(s);
		const icon = explorerIconFor(s);
		windows = windows.map((w) => (w.id === 'explorer' ? { ...w, title, icon } : w));
	}

	function openExplorer(section: ExplorerSection) {
		explorerSection = section;
		const existing = windows.find((w) => w.id === 'explorer');
		if (existing) {
			windows = windows.map((w) => (w.id === 'explorer' ? { ...w, minimized: false } : w));
			syncExplorerWindow(section);
			activeId = 'explorer';
			zCounter += 1;
			return;
		}
		const offset = (windows.length % 5) * 26;
		const vw = window.innerWidth;
		const vh = window.innerHeight - 44;
		const w = Math.max(280, Math.min(860, vw - 8));
		const h = Math.max(180, Math.min(600, vh - 8));
		const cx = Math.max(2, Math.round((vw - w) / 2)) + (offset % 60);
		const cy = Math.max(2, Math.round((vh - h) / 3)) + (offset % 40);
		windows = [
			...windows,
			{
				id: 'explorer',
				title: explorerTitleFor(section),
				icon: explorerIconFor(section),
				x: Math.min(cx, Math.max(0, vw - w - 4)),
				y: Math.min(cy, Math.max(0, vh - h - 4)),
				w,
				h,
				minimized: false
			}
		];
		activeId = 'explorer';
		zCounter += 1;
	}

	function setExplorerSection(section: ExplorerSection) {
		explorerSection = section;
		syncExplorerWindow(section);
	}

	function openIcon(id: string) {
		if (isExplorerSection(id)) openExplorer(id);
		else openApp(id);
	}

	function openApp(id: string) {
		const def = desktopIcons.find((d) => d.id === id);
		if (!def) return;
		const existing = windows.find((w) => w.id === id);
		if (existing) {
			// un-minimize & focus
			windows = windows.map((w) => (w.id === id ? { ...w, minimized: false } : w));
			activeId = id;
			zCounter += 1;
			return;
		}
		const offset = (windows.length % 5) * 26;
		// Clamp window to viewport (mobile-friendly).
		const vw = window.innerWidth;
		const vh = window.innerHeight - 44; // taskbar
		const maxW = Math.min(def.win.w, vw - 8);
		const maxH = Math.min(def.win.h, vh - 8);
		const w = Math.max(280, maxW);
		const h = Math.max(180, maxH);
		const cx = Math.max(2, Math.round((vw - w) / 2)) + (offset % 60);
		const cy = Math.max(2, Math.round((vh - h) / 3)) + (offset % 40);
		windows = [
			...windows,
			{
				...def.win,
				w,
				h,
				x: Math.min(cx, Math.max(0, vw - w - 4)),
				y: Math.min(cy, Math.max(0, vh - h - 4)),
				minimized: false
			}
		];
		activeId = id;
		zCounter += 1;
	}

	function activate(id: string) {
		if (activeId === id) return;
		activeId = id;
		zCounter += 1;
	}

	function closeWin(id: string) {
		windows = windows.filter((w) => w.id !== id);
		if (activeId === id) activeId = windows[windows.length - 1]?.id ?? null;
	}

	function minimizeWin(id: string) {
		windows = windows.map((w) => (w.id === id ? { ...w, minimized: true } : w));
		if (activeId === id) activeId = null;
	}

	function toggleStart() {
		startOpen = !startOpen;
	}

	function startItem(id: string) {
		startOpen = false;
		openIcon(id);
	}

	function taskClick(id: string) {
		const w = windows.find((x) => x.id === id);
		if (!w) return;
		if (activeId === id && !w.minimized) {
			// minimize
			minimizeWin(id);
		} else {
			windows = windows.map((x) => (x.id === id ? { ...x, minimized: false } : x));
			activeId = id;
			zCounter += 1;
		}
	}

	function shutDown() {
		startOpen = false;
		shuttingDown = true;
	}

	function finishShutdown() {
		shuttingDown = false;
		booted = false;
		windows = [];
		activeId = null;
	}

	function onDesktopClick() {
		startOpen = false;
		selectedIcon = null;
	}
</script>

{#if !booted}
	<BootScreen onDone={() => (booted = true)} />
{/if}

{#if shuttingDown}
	<ShutdownScreen onDone={finishShutdown} />
{/if}

<!-- Desktop -->
<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<div
	class="desktop"
	style="background-image:url('{bliss}')"
	onclick={onDesktopClick}
	role="presentation"
>
	<!-- Desktop icons -->
	<div class="icons">
		{#each desktopIcons as d, i}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<button
				class="dicon"
				class:sel={selectedIcon === d.id}
				onclick={(e) => {
					e.stopPropagation();
					selectedIcon = d.id;
				}}
				ondblclick={() => openIcon(d.id)}
				onpointerup={(e) => {
					// Touch tap opens immediately on small screens.
					if (e.pointerType === 'touch') {
						e.stopPropagation();
						openIcon(d.id);
					}
				}}
				onpointerenter={(e) => (tooltip = { text: d.label, x: e.clientX, y: e.clientY + 16 })}
				onpointermove={(e) => (tooltip = { text: d.label, x: e.clientX, y: e.clientY + 16 })}
				onpointerleave={() => (tooltip = null)}
				style="grid-row:{Math.floor(i / 2) + 1}; grid-column:{(i % 2) + 1};"
			>
				<span class="dicon-img"><Icon name={d.icon} size={34} /></span>
				<span class="dicon-label">{d.label}</span>
			</button>
		{/each}
	</div>

	<!-- Windows -->
	{#each windows as w (w.id)}
		{#if w.id === 'winamp'}
			<Winamp
				id={w.id}
				title={w.title}
				icon={w.icon}
				x={w.x}
				y={w.y}
				z={zIndexFor(w.id)}
				active={activeId === w.id}
				minimized={w.minimized}
				onActivate={activate}
				onClose={closeWin}
				onMinimize={minimizeWin}
			/>
		{:else}
			<Window
				id={w.id}
				title={w.title}
				icon={w.icon}
				x={w.x}
				y={w.y}
				width={w.w}
				height={w.h}
				active={activeId === w.id}
				minimized={w.minimized}
				z={zIndexFor(w.id)}
				keepMounted={w.id === 'snake' || w.id === 'minesweeper'}
				statusText={w.id === 'explorer' ? explorerStatusFor(explorerSection) : 'Ready'}
				statusRight={w.id === 'explorer' ? 'Ready' : ''}
				onActivate={activate}
				onClose={closeWin}
				onMinimize={minimizeWin}
				onMaximize={() => {}}
			>
				{#if w.id === 'hero'}
					<div class="content hero">
						<div class="hero-top">
							<div class="hero-badge">{profile.heroBadge}</div>
							<h1 class="hero-title crt-glow">{profile.heroTitle}</h1>
							<p class="hero-sub">{profile.heroSub}</p>
						</div>
						<div class="hero-buttons">
							{#each heroButtons as b}
								<button class="wbtn" onclick={() => openIcon(b.id)}>
									{b.label}
								</button>
							{/each}
						</div>
						<div class="hero-foot">
							<span>Double-click an icon to open a program.</span>
							<span class="caret">▌</span>
						</div>
					</div>
				{:else if w.id === 'explorer'}
					<ExplorerApp section={explorerSection} onSectionChange={setExplorerSection} />
				{:else if w.id === 'about'}
					<div class="content about">
						<div class="about-head">
							<div class="photo-frame">
								<img src={mePhoto} alt="Ray" class="me-photo" />
							</div>
							<div>
								<h2 class="sec-title" style="margin:0">About Me</h2>
								<p class="muted">{profile.tagline}</p>
							</div>
						</div>
						<p>{profile.bio}</p>
						<ul class="facts">
							{#each profile.facts as f}
								<li><b>{f.label}:</b> {f.value}</li>
							{/each}
						</ul>
					</div>
				{:else if w.id === 'contact'}
					<div class="content contact">
						<h2 class="sec-title">{contact.heading}</h2>
						<p class="muted">{contact.hint}</p>
						<form onsubmit={(e) => e.preventDefault()} class="cform">
							<label>Name<input type="text" placeholder="Your name" /></label>
							<label>Email<input type="email" placeholder="you@domain.com" /></label>
							<label>Message<textarea rows="4" placeholder={contact.placeholder}></textarea></label>
							<div class="form-actions">
								<button type="submit" class="wbtn">Send</button>
								<button type="reset" class="wbtn ghost">Clear</button>
							</div>
						</form>
						<div class="quick">
							<div>📧 {contact.email}</div>
							<div>📞 {contact.phone}</div>
						</div>
					</div>
				{:else if w.id === 'resume'}
					<div class="content notepad">
						<pre>{resumeText}</pre>
					</div>
				{:else if w.id === 'snake'}
					<SnakeGame onToast={showToast} />
				{:else if w.id === 'minesweeper'}
					<Minesweeper
						onOpenWork={() => openExplorer('work')}
						onOpenContact={() => openApp('contact')}
					/>
				{/if}
			</Window>
		{/if}
	{/each}

	<!-- Start Menu -->
	<StartMenu visible={startOpen} onItem={startItem} onShutDown={shutDown} />

	<!-- Taskbar -->
	<Taskbar
		{startOpen}
		{activeId}
		tasks={windows.map((w) => ({
			id: w.id,
			title: w.title,
			icon: w.icon,
			minimized: w.minimized
		}))}
		onToggleStart={toggleStart}
		onTaskClick={taskClick}
	/>
</div>

<!-- Overlays -->
<div class="crt-overlay"></div>
<div class="noise-overlay"></div>

{#if tooltip}
	<div class="win-tip" style="left:{tooltip.x}px; top:{tooltip.y}px;">{tooltip.text}</div>
{/if}

{#if toast}
	<div class="toast-wrap"><Toast message={toast} /></div>
{/if}

{#if booted}
	<!-- Self-contained: starts a 2-minute timer on mount, shows once per session. -->
	<AchievementToast />
{/if}

<style>
	.desktop {
		position: fixed;
		inset: 0;
		background-size: cover;
		background-position: center;
		overflow: hidden;
	}

	.icons {
		position: absolute;
		top: 12px;
		left: 12px;
		display: grid;
		grid-template-columns: repeat(2, 78px);
		grid-auto-rows: 78px;
		gap: 4px;
	}
	.dicon {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 4px 2px;
		background: transparent;
		border: 1px dotted transparent;
		cursor: pointer;
		font-family: var(--win-font);
		color: #fff;
		text-shadow:
			0 0 3px rgba(0, 0, 0, 0.9),
			1px 1px 0 #000;
	}
	.dicon.sel {
		background: rgba(0, 0, 128, 0.45);
		border: 1px dotted #fff;
	}
	.dicon-img {
		filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.6));
	}
	.dicon-label {
		font-size: 11px;
		line-height: 1.1;
		text-align: center;
		max-width: 72px;
		word-break: break-word;
	}

	/* Content area */
	.content {
		padding: 16px 18px 26px;
		color: #000;
		font-family: var(--win-font);
		height: 100%;
	}
	.sec-title {
		font-size: 18px;
		margin: 0 0 8px;
		font-weight: 700;
	}
	.muted {
		color: #444;
		margin: 0 0 10px;
		font-size: 12px;
	}

	/* Hero */
	.hero {
		display: flex;
		flex-direction: column;
		gap: 14px;
		background: linear-gradient(180deg, rgba(0, 0, 80, 0.04), rgba(0, 0, 80, 0));
	}
	.hero-badge {
		display: inline-block;
		align-self: flex-start;
		background: #000080;
		color: #fff;
		padding: 2px 8px;
		font-size: 10px;
		letter-spacing: 1px;
	}
	.hero-title {
		font-size: 38px;
		margin: 0;
		font-weight: 800;
		color: #000080;
		line-height: 1;
	}
	.hero-sub {
		font-size: 14px;
		margin: 0;
		max-width: 480px;
		line-height: 1.45;
		color: #202020;
	}
	.hero-buttons {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.hero-foot {
		margin-top: auto;
		font-size: 11px;
		color: #555;
		display: flex;
		gap: 6px;
		align-items: center;
		border-top: 1px solid #c0c0c0;
		padding-top: 8px;
	}

	/* Buttons */
	.wbtn {
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
		padding: 5px 14px;
		font-family: var(--win-font);
		font-size: 12px;
		color: #000;
		cursor: pointer;
		min-width: 86px;
	}
	.wbtn:active {
		border-color: #404040 #fff #fff #404040;
		box-shadow:
			inset 1px 1px 0 #808080,
			inset -1px -1px 0 #dfdfdf;
		padding: 6px 13px 4px 15px;
	}
	.wbtn.ghost {
		min-width: 64px;
	}

	/* About */
	.about-head {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 10px;
	}
	.photo-frame {
		flex-shrink: 0;
		padding: 3px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
	}
	.me-photo {
		display: block;
		width: 115px;
		height: 115px;
		object-fit: cover;
		object-position: center 24%;
		background: #1a1a1a;
		border-top: 1px solid #808080;
		border-left: 1px solid #808080;
		border-right: 1px solid #fff;
		border-bottom: 1px solid #fff;
	}
	.facts {
		margin: 10px 0 0;
		padding-left: 18px;
		line-height: 1.7;
		font-size: 12px;
	}

	/* Contact */
	.cform {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 8px;
	}
	.cform label {
		display: flex;
		flex-direction: column;
		font-size: 12px;
		gap: 3px;
	}
	.cform input,
	.cform textarea {
		border-top: 2px solid #808080;
		border-left: 2px solid #808080;
		border-right: 2px solid #fff;
		border-bottom: 2px solid #fff;
		padding: 4px 6px;
		font-family: var(--win-font);
		font-size: 12px;
		background: #fff;
		resize: none;
	}
	.form-actions {
		display: flex;
		gap: 8px;
		margin-top: 4px;
	}
	.quick {
		margin-top: 14px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 12px;
		padding-top: 8px;
		border-top: 1px solid #c0c0c0;
	}

	/* Notepad */
	.notepad pre {
		font-family: 'Courier New', monospace;
		font-size: 13px;
		line-height: 1.6;
		white-space: pre-wrap;
		margin: 0;
		color: #111;
		font-weight: 500;
	}
</style>
