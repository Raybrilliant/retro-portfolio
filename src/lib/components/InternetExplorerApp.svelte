<script lang="ts">
	import { socialLinks, ieHomePage, type SocialGlyph } from '$lib/data/social';

	// Bubble status text up to the Window's status bar (bindable).
	let { status = $bindable('Done') }: { status?: string } = $props();

	let currentUrl = $state(ieHomePage.url);
	let history: string[] = [];
	let forwardStack: string[] = [];
	let loading = $state(false);
	let loadTimer: ReturnType<typeof setTimeout> | undefined;

	function navigate(url: string, opts: { push?: boolean } = {}) {
		if (opts.push !== false && currentUrl !== url) {
			history = [...history, currentUrl];
			forwardStack = [];
		}
		currentUrl = url;
		loading = true;
		status = `Opening ${url}…`;
		if (loadTimer) clearTimeout(loadTimer);
		loadTimer = setTimeout(() => {
			loading = false;
			status = 'Done';
		}, 650);
	}

	function openSocial(url: string) {
		navigate(url);
		if (typeof window !== 'undefined') {
			window.open(url, '_blank', 'noopener,noreferrer');
		}
	}

	function goBack() {
		const prev = history.pop();
		if (!prev) return;
		forwardStack = [...forwardStack, currentUrl];
		// Don't push again when going back.
		currentUrl = prev;
		loading = true;
		status = `Opening ${prev}…`;
		if (loadTimer) clearTimeout(loadTimer);
		loadTimer = setTimeout(() => {
			loading = false;
			status = 'Done';
		}, 650);
	}

	function goForward() {
		const next = forwardStack.pop();
		if (!next) return;
		history = [...history, currentUrl];
		currentUrl = next;
		loading = true;
		status = `Opening ${next}…`;
		if (loadTimer) clearTimeout(loadTimer);
		loadTimer = setTimeout(() => {
			loading = false;
			status = 'Done';
		}, 650);
	}

	function refresh() {
		loading = true;
		status = 'Refreshing…';
		if (loadTimer) clearTimeout(loadTimer);
		loadTimer = setTimeout(() => {
			loading = false;
			status = 'Done';
		}, 650);
	}

	function goHome() {
		forwardStack = [];
		navigate(ieHomePage.url, { push: true });
	}

	function onAddressKeydown(e: KeyboardEvent) {
		if (e.key !== 'Enter') return;
		const v = currentUrl.trim();
		if (/^https?:\/\//i.test(v)) {
			if (typeof window !== 'undefined') window.open(v, '_blank', 'noopener,noreferrer');
			navigate(v);
		} else {
			goHome();
		}
	}

	function onGoClick() {
		const v = currentUrl.trim();
		if (/^https?:\/\//i.test(v)) {
			if (typeof window !== 'undefined') window.open(v, '_blank', 'noopener,noreferrer');
			navigate(v);
		} else {
			goHome();
		}
	}

	const canBack = $derived(history.length > 0);
	const canForward = $derived(forwardStack.length > 0);
</script>

<div class="ie">
	<!-- Menu bar -->
	<div class="ie-menu">
		<button type="button"><u>F</u>ile</button>
		<button type="button"><u>E</u>dit</button>
		<button type="button"><u>V</u>iew</button>
		<button type="button"><u>F</u>avorites</button>
		<button type="button"><u>T</u>ools</button>
		<button type="button"><u>H</u>elp</button>
	</div>

	<!-- Toolbar -->
	<div class="ie-toolbar">
		<button class="tb" type="button" disabled={!canBack} onclick={goBack}>
			<span class="tb-ico">←</span><span class="tb-lbl">Back</span>
		</button>
		<button class="tb" type="button" disabled={!canForward} onclick={goForward}>
			<span class="tb-ico">→</span><span class="tb-lbl">Forward</span>
		</button>
		<button class="tb" type="button" onclick={refresh}>
			<span class="tb-ico">↻</span><span class="tb-lbl">Refresh</span>
		</button>
		<button class="tb" type="button" onclick={goHome}>
			<span class="tb-ico">⌂</span><span class="tb-lbl">Home</span>
		</button>
	</div>

	<!-- Address bar -->
	<div class="ie-address">
		<span class="addr-label">Address</span>
		<div class="addr-field">
			<input
				type="text"
				value={currentUrl}
				onkeydown={onAddressKeydown}
				spellcheck="false"
				aria-label="Address"
			/>
		</div>
		<button class="addr-go" type="button" onclick={onGoClick}>Go</button>
	</div>

	<!-- Page content (the "web page") -->
	<div class="ie-page">
		<div class="page">
			<header class="page-head">
				<!-- <h1>Raybrilliant Online</h1> -->
				<p class="page-sub">
					Welcome — you are connected to <b>raybrilliant.my.id</b>. Choose a destination below to
					visit Rey around the web.
				</p>
			</header>

			<hr class="page-rule" />

			<h2 class="fav-title">★ Favorites</h2>
			<ul class="fav-list">
				{#each socialLinks as s}
					<li>
						<a
							class="fav"
							href={s.url}
							target="_blank"
							rel="noopener noreferrer"
							onclick={(e) => {
								e.preventDefault();
								openSocial(s.url);
							}}
						>
							<span class="fav-ico" style="--accent:{s.accent}">
								{#if s.glyph === 'instagram'}
									<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
										<rect
											x="3"
											y="3"
											width="18"
											height="18"
											rx="5"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										/>
										<circle
											cx="12"
											cy="12"
											r="4.4"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										/>
										<circle cx="17.4" cy="6.6" r="1.4" fill="currentColor" />
									</svg>
								{:else if s.glyph === 'linkedin'}
									<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
										<rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
										<rect x="6.5" y="10.5" width="2.4" height="7" fill="#fff" />
										<circle cx="7.7" cy="7.6" r="1.3" fill="#fff" />
										<path
											d="M11.6 17.6 v-7 h2.2 v1 a3 3 0 0 1 2.6 -1.4 c1.9 0 3 1.2 3 3.3 v4.1 h-2.4 v-3.7 c0 -1 -.5 -1.6 -1.4 -1.6 c-.9 0 -1.5 .6 -1.5 1.6 v3.7 Z"
											fill="#fff"
										/>
									</svg>
								{:else}
									<svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor" aria-hidden="true">
										<path
											d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
										/>
									</svg>
								{/if}
							</span>
							<span class="fav-meta">
								<span class="fav-line1">
									<b>{s.label}</b>
									<span class="fav-handle">{s.handle}</span>
								</span>
								<span class="fav-blurb">{s.blurb}</span>
							</span>
							<span class="fav-open" aria-hidden="true">Open »</span>
						</a>
					</li>
				{/each}
			</ul>

			<footer class="page-foot">
				<span>Raybrilliant OS · Internet Explorer 5.0 · © 2002–2026 Rey</span>
			</footer>
		</div>

		{#if loading}
			<div class="ie-loading"><div class="ie-loading-bar"></div></div>
		{/if}
	</div>
</div>

<style>
	.ie {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--face);
		font-family: var(--win-font);
		color: #000;
	}

	/* Menu bar */
	.ie-menu {
		display: flex;
		gap: 1px;
		padding: 1px 2px;
		background: var(--face);
		border-bottom: 1px solid #808080;
		font-size: 12px;
	}
	.ie-menu button {
		background: transparent;
		border: none;
		padding: 2px 6px;
		font-family: var(--win-font);
		font-size: 12px;
		color: #000;
		cursor: default;
	}
	.ie-menu button u {
		text-decoration: underline;
	}

	/* Toolbar */
	.ie-toolbar {
		display: flex;
		gap: 2px;
		padding: 3px 4px 4px;
		background: var(--face);
		border-bottom: 1px solid #808080;
		box-shadow: inset 0 1px 0 #fff;
	}
	.tb {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		min-width: 52px;
		padding: 3px 6px 2px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow: inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf;
		font-family: var(--win-font);
		color: #000;
		cursor: pointer;
	}
	.tb:active {
		border-color: #404040 #fff #fff #404040;
		box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #dfdfdf;
	}
	.tb:disabled {
		color: #808080;
		text-shadow: 1px 1px 0 #fff;
		cursor: default;
	}
	.tb-ico {
		font-size: 14px;
		line-height: 1;
	}
	.tb-lbl {
		font-size: 10px;
		line-height: 1.1;
	}

	/* Address bar */
	.ie-address {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 3px 4px;
		background: var(--face);
		border-bottom: 1px solid #808080;
		box-shadow: inset 0 1px 0 #fff;
	}
	.addr-label {
		font-size: 11px;
		color: #000;
		padding-right: 2px;
	}
	.addr-field {
		flex: 1;
		min-width: 0;
		background: #fff;
		border-top: 2px solid #808080;
		border-left: 2px solid #808080;
		border-right: 2px solid #fff;
		border-bottom: 2px solid #fff;
		box-shadow: inset 1px 1px 0 #404040;
		padding: 1px 4px;
	}
	.addr-field input {
		width: 100%;
		border: none;
		outline: none;
		background: transparent;
		font-family: var(--win-font);
		font-size: 12px;
		color: #000;
		padding: 1px 0;
	}
	.addr-go {
		padding: 2px 10px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow: inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf;
		font-family: var(--win-font);
		font-size: 12px;
		cursor: pointer;
	}
	.addr-go:active {
		border-color: #404040 #fff #fff #404040;
		box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #dfdfdf;
	}

	/* Page */
	.ie-page {
		flex: 1;
		overflow: auto;
		background: #fff;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid #808080;
		border-bottom: 1px solid #808080;
		position: relative;
	}
	.page {
		padding: 18px 22px 22px;
	}
	.page-sub {
		font-size: 13px;
		color: #333;
		margin: 0;
		line-height: 1.45;
		max-width: 60ch;
	}
	.page-rule {
		border: none;
		border-top: 1px solid #c0c0c0;
		margin: 16px 0 12px;
	}
	.fav-title {
		font-size: 14px;
		margin: 0 0 8px;
		color: #000080;
	}
	.fav-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.fav {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 12px;
		background: #f4f4f0;
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #c0c0c0;
		border-bottom: 2px solid #c0c0c0;
		text-decoration: none;
		color: #000;
		cursor: pointer;
	}
	.fav:hover,
	.fav:focus-visible {
		background: #000080;
		color: #fff;
		outline: none;
	}
	.fav:hover .fav-handle,
	.fav:hover .fav-blurb,
	.fav:focus-visible .fav-handle,
	.fav:focus-visible .fav-blurb {
		color: #fff;
	}
	.fav:hover .fav-open,
	.fav:focus-visible .fav-open {
		color: #ffe;
	}
	.fav-ico {
		flex: 0 0 auto;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--accent, #000);
	}
	.fav:hover .fav-ico,
	.fav:focus-visible .fav-ico {
		filter: brightness(1.1);
	}
	.fav-meta {
		flex: 1 1 auto;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.fav-line1 {
		display: flex;
		align-items: baseline;
		gap: 8px;
		font-size: 13px;
	}
	.fav-line1 b {
		font-weight: 700;
	}
	.fav-handle {
		font-size: 11px;
		color: #555;
	}
	.fav-blurb {
		font-size: 11px;
		color: #555;
		line-height: 1.35;
	}
	.fav-open {
		flex: 0 0 auto;
		font-size: 11px;
		color: #000080;
		text-decoration: underline;
	}
	.page-foot {
		margin-top: 18px;
		font-size: 10px;
		color: #777;
	}

	/* Loading bar */
	.ie-loading {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		background: #e0e8f8;
		overflow: hidden;
	}
	.ie-loading-bar {
		height: 100%;
		width: 40%;
		background: linear-gradient(90deg, #1084d0, #6fb0ef);
		animation: ie-load 0.7s linear infinite;
	}
	@keyframes ie-load {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(350%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ie-loading-bar {
			animation: none;
		}
	}
</style>