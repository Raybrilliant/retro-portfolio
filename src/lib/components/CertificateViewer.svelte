<script lang="ts">
	import type { Certificate } from '$lib/data';
	import Icon from './Icon.svelte';

	let {
		certificates,
		startIndex = 0,
		onClose = () => {}
	}: { certificates: Certificate[]; startIndex?: number; onClose?: () => void } = $props();

	let index = $state(startIndex);
	let imgError = $state(false);

	const cert = $derived(certificates[index]);
	const atFirst = $derived(index <= 0);
	const atLast = $derived(index >= certificates.length - 1);

	$effect(() => {
		imgError = false;
	});

	function prev() {
		if (!atFirst) index -= 1;
	}
	function next() {
		if (!atLast) index += 1;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			next();
		}
	}

	$effect(() => {
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	function onOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onClose();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="viewer-overlay" onclick={onOverlayClick} role="presentation">
	<div class="viewer anim-open" onclick={(e) => e.stopPropagation()} role="presentation">
		<!-- Title bar -->
		<div class="v-title">
			<div class="v-ttl-left">
				<Icon name="certificate" size={16} />
				<span>Certificate Viewer</span>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<button class="v-close" aria-label="Close" onclick={onClose}>
				<span class="x-glyph"></span>
			</button>
		</div>

		<!-- Body -->
		<div class="v-body">
			<div class="v-header">
				<div class="v-title-text">{cert?.title}</div>
				<div class="v-sub">{cert?.issuer} · {cert?.year}</div>
			</div>

			<div class="v-frame">
				{#if cert?.image && !imgError}
					<img src={cert.image} alt={cert?.title} onerror={() => (imgError = true)} />
				{:else}
					<div class="v-placeholder">
						<Icon name="certificate" size={48} />
						<span>Image not available</span>
						<span class="v-path">{cert?.image}</span>
					</div>
				{/if}
			</div>

			{#if cert?.description}
				<p class="v-desc">{cert.description}</p>
			{/if}
		</div>

		<!-- Control bar -->
		<div class="v-controls">
			<button class="wbtn" onclick={prev} disabled={atFirst}>◀ Previous</button>
			<span class="v-pos">{index + 1} / {certificates.length}</span>
			<button class="wbtn" onclick={next} disabled={atLast}>Next ▶</button>
			<span class="v-spacer"></span>
			<button class="wbtn" onclick={onClose}>Close</button>
		</div>

		<!-- Status bar -->
		<div class="v-status">
			<div class="v-status-cell flex-1">Viewing certificate</div>
			<div class="v-status-cell">{index + 1} of {certificates.length}</div>
		</div>
	</div>
</div>

<style>
	.viewer-overlay {
		position: fixed;
		inset: 0;
		z-index: 10050;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
	}
	.viewer {
		width: min(860px, 92vw);
		max-height: 88vh;
		display: flex;
		flex-direction: column;
		background: #c0c0c0;
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf,
			4px 4px 14px rgba(0, 0, 0, 0.5);
		padding: 2px;
	}

	/* Title bar */
	.v-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 22px;
		background: linear-gradient(90deg, #000080 0%, #1084d0 100%);
		color: #fff;
		padding: 2px 3px 2px 5px;
		font-weight: 700;
		font-size: 13px;
		text-shadow: 1px 1px 0 #000;
	}
	.v-ttl-left {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.v-close {
		width: 20px;
		height: 18px;
		background: #c0c0c0;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid #404040;
		border-bottom: 1px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
		cursor: pointer;
		padding: 0;
		position: relative;
	}
	.v-close:active {
		border-color: #404040 #fff #fff #404040;
	}
	.x-glyph::before,
	.x-glyph::after {
		content: '';
		position: absolute;
		left: 3px;
		top: 8px;
		width: 12px;
		height: 2px;
		background: #000;
	}
	.x-glyph::before {
		transform: rotate(45deg);
	}
	.x-glyph::after {
		transform: rotate(-45deg);
	}

	/* Body */
	.v-body {
		flex: 1;
		overflow: auto;
		background: #c0c0c0;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid #808080;
		border-bottom: 1px solid #808080;
		margin: 1px 0;
		padding: 8px 10px;
	}
	.v-header {
		margin-bottom: 8px;
	}
	.v-title-text {
		font-size: 14px;
		font-weight: 800;
		color: #000080;
	}
	.v-sub {
		font-size: 11px;
		color: #444;
	}

	/* Image frame */
	.v-frame {
		background: #fff;
		border-top: 1px solid #808080;
		border-left: 1px solid #808080;
		border-right: 1px solid #fff;
		border-bottom: 1px solid #fff;
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
	}
	.v-frame img {
		max-width: 100%;
		max-height: 440px;
		width: auto;
		height: auto;
		object-fit: contain;
		display: block;
	}
	.v-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		color: #888;
		font-size: 11px;
		text-align: center;
	}
	.v-path {
		font-family: 'Courier New', monospace;
		font-size: 10px;
		color: #aaa;
	}
	.v-desc {
		margin: 8px 0 0;
		font-size: 12px;
		color: #222;
		line-height: 1.45;
	}

	/* Controls */
	.v-controls {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 4px;
	}
	.v-pos {
		font-size: 11px;
		color: #333;
		font-variant-numeric: tabular-nums;
		min-width: 44px;
		text-align: center;
	}
	.v-spacer {
		flex: 1;
	}
	.v-controls .wbtn:disabled {
		color: #888;
		cursor: default;
	}

	/* Status bar */
	.v-status {
		display: flex;
		gap: 2px;
		height: 18px;
	}
	.v-status-cell {
		background: #c0c0c0;
		border-top: 1px solid #404040;
		border-left: 1px solid #404040;
		border-right: 1px solid #fff;
		border-bottom: 1px solid #fff;
		padding: 1px 6px;
		font-size: 11px;
		color: #000;
	}
	.flex-1 {
		flex: 1;
	}

	@media (max-width: 480px) {
		.viewer {
			width: 96vw;
			max-height: 92vh;
		}
		.v-frame img {
			max-height: 52vh;
		}
		.v-controls {
			flex-wrap: wrap;
			justify-content: center;
		}
		.v-spacer {
			display: none;
		}
	}
</style>
