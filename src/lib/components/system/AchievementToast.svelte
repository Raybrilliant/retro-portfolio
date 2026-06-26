<script lang="ts">
	import { onMount } from 'svelte';
	import notifySound from '$lib/assets/notify.m4a';

	// Show the "2 minutes wandering" achievement only once per browser session.
	const STORAGE_KEY = 'ray_os_achievement_2min_v2';
	const DELAY_MS = 2 * 60 * 1000; // 2 minutes after boot

	let visible = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;

	function playNotify() {
		try {
			const a = new Audio(notifySound);
			a.volume = 0.5;
			a.play().catch(() => {});
		} catch {
			/* ignore */
		}
	}

	function close() {
		visible = false;
		if (hideTimer) clearTimeout(hideTimer);
	}

	onMount(() => {
		// Guard for SSR safety + once-per-session semantics.
		let alreadyShown = false;
		try {
			alreadyShown = sessionStorage.getItem(STORAGE_KEY) === '1';
		} catch {
			/* ignore */
		}

		// Dev-only instant preview: append ?ach=now to the URL to force-show
		// the toast without waiting 2 minutes. Does not run in production builds.
		const devForce =
			import.meta.env.DEV &&
			typeof window !== 'undefined' &&
			new URLSearchParams(window.location.search).get('ach') === 'now';

		const fire = () => {
			try {
				sessionStorage.setItem(STORAGE_KEY, '1');
			} catch {
				/* ignore */
			}
			visible = true;
			playNotify();
			// Auto-hide after 7–10 seconds.
			const hideAfter = 7000 + Math.random() * 3000;
			hideTimer = setTimeout(() => (visible = false), hideAfter);
		};

		if (devForce) {
			fire();
			return;
		}

		if (alreadyShown) return;

		timer = setTimeout(fire, DELAY_MS);

		return () => {
			if (timer) clearTimeout(timer);
			if (hideTimer) clearTimeout(hideTimer);
		};
	});
</script>

{#if visible}
	<!-- Wrapper does not capture clicks so it never blocks the desktop, -->
	<!-- Start Menu, active windows, games, or the Certificate Viewer. -->
	<div class="ach-wrap" role="status" aria-live="polite">
		<div class="ach">
			<div class="ach-title-bar">
				<div class="ach-title-left">
					<svg class="ach-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
						<rect x="3" y="1" width="10" height="2" fill="#ffd700" stroke="#000" />
						<rect x="4" y="3" width="8" height="2" fill="#ffd700" stroke="#000" />
						<rect x="5" y="5" width="6" height="4" fill="#ffd700" stroke="#000" />
						<rect x="6" y="9" width="4" height="2" fill="#c8c8c8" stroke="#000" />
						<rect x="4" y="11" width="8" height="2" fill="#c8c8c8" stroke="#000" />
						<rect x="3" y="13" width="10" height="2" fill="#c8c8c8" stroke="#000" />
					</svg>
					<span>Achievement Unlocked</span>
				</div>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<button class="ach-close" onclick={close} aria-label="Close" type="button">×</button>
			</div>
			<div class="ach-body">
				<div class="ach-row">
					<svg class="ach-trophy" viewBox="0 0 16 16" width="22" height="22" aria-hidden="true">
						<path
							d="M4 2 h8 v3 a4 4 0 0 1 -8 0 z"
							fill="#ffd700"
							stroke="#000"
							stroke-width="0.8"
						/>
						<rect
							x="3"
							y="2"
							width="1.4"
							height="3"
							fill="#ffd700"
							stroke="#000"
							stroke-width="0.6"
						/>
						<rect
							x="11.6"
							y="2"
							width="1.4"
							height="3"
							fill="#ffd700"
							stroke="#000"
							stroke-width="0.6"
						/>
						<rect
							x="6"
							y="9"
							width="4"
							height="2"
							fill="#ffd700"
							stroke="#000"
							stroke-width="0.6"
						/>
						<rect
							x="4.5"
							y="11"
							width="7"
							height="1.6"
							fill="#c8c8c8"
							stroke="#000"
							stroke-width="0.6"
						/>
						<rect
							x="3.5"
							y="12.6"
							width="9"
							height="1.8"
							fill="#c8c8c8"
							stroke="#000"
							stroke-width="0.6"
						/>
					</svg>
					<div class="ach-text">
						<div class="ach-message">What are you looking for, human?</div>
						<div class="ach-sub">You have been wandering around Raybrilliant OS for 2 minutes.</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.ach-wrap {
		position: fixed;
		right: 12px;
		bottom: 48px; /* sits just above the 44px taskbar */
		z-index: 10002; /* above taskbar/toasts, below boot/shutdown overlays */
		pointer-events: none; /* let clicks pass through around the popup */
		font-family: var(--win-font);
		animation: ach-rise 0.18s ease-out;
	}

	.ach {
		width: 268px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf,
			3px 3px 8px rgba(0, 0, 0, 0.35);
		pointer-events: auto; /* only the popup itself is interactive */
		color: #000;
	}

	.ach-title-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(90deg, #000080, #1084d0);
		color: #fff;
		padding: 2px 3px 2px 5px;
		font-size: 11px;
		font-weight: 700;
	}
	.ach-title-left {
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.ach-icon {
		display: block;
	}

	.ach-close {
		width: 16px;
		height: 14px;
		min-width: 16px;
		padding: 0;
		background: var(--face);
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid #404040;
		border-bottom: 1px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
		color: #000;
		font-family: var(--win-font);
		font-size: 11px;
		font-weight: 700;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.ach-close:active {
		border-color: #404040 #fff #fff #404040;
		box-shadow:
			inset 1px 1px 0 #808080,
			inset -1px -1px 0 #dfdfdf;
	}

	.ach-body {
		padding: 8px 10px 10px;
	}
	.ach-row {
		display: flex;
		align-items: flex-start;
		gap: 9px;
	}
	.ach-trophy {
		flex: 0 0 auto;
		margin-top: 1px;
	}
	.ach-text {
		flex: 1 1 auto;
		min-width: 0;
	}
	.ach-message {
		font-size: 12px;
		font-weight: 700;
		color: #000;
		line-height: 1.3;
	}
	.ach-sub {
		margin-top: 3px;
		font-size: 11px;
		color: #333;
		line-height: 1.35;
	}

	@keyframes ach-rise {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ach-wrap {
			animation: none;
		}
	}
</style>
