<script lang="ts">
	import type { WorkItem } from '$lib/data';
	import Icon from './Icon.svelte';

	let { item, onClose = () => {} }: { item: WorkItem; onClose?: () => void } = $props();
	let imgError = $state(false);
	$effect(() => {
		imgError = false;
	});

	function onOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onClose();
	}
	const linkAvailable = $derived(!!item.link && item.link !== '#');
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="overlay" onclick={onOverlayClick} role="presentation">
	<div class="win anim-open" onclick={(e) => e.stopPropagation()} role="presentation">
		<div class="titlebar">
			<div class="ttl-left">
				<Icon name="briefcase" size={16} />
				<span>Work Details - {item.title}</span>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<button class="ttl-close" aria-label="Close" onclick={onClose}>
				<span class="x-glyph"></span>
			</button>
		</div>

		<div class="body win-scroll">
			<div class="shot">
				{#if item.image && !imgError}
					<img src={item.image} alt={item.title} onerror={() => (imgError = true)} />
				{:else}
					<div class="shot-fallback"><Icon name="computer" size={44} /><span>No screenshot</span></div>
				{/if}
			</div>

			<h2 class="dt-title">{item.title}</h2>
			<div class="meta">
				<div><span class="lbl">Client:</span> {item.client}</div>
				<div><span class="lbl">Year:</span> {item.year}</div>
				<div><span class="lbl">Type:</span> {item.type}</div>
			</div>

			<p class="desc">{item.description}</p>

			<div class="block">Technologies</div>
			<div class="tags">
				{#each item.technologies as t}<span class="tag">{t}</span>{/each}
			</div>

			<div class="actions">
				{#if linkAvailable}
					<a class="wbtn" href={item.link} target="_blank" rel="noopener noreferrer">
						Visit link ▶
					</a>
				{:else}
					<button class="wbtn" disabled>Link unavailable</button>
				{/if}
			</div>
		</div>

		<div class="status">
			<div class="status-cell flex-1">Ready</div>
			<div class="status-cell">{item.type}</div>
		</div>
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 10050;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
	}
	.win {
		width: min(820px, 92vw);
		max-height: 620px;
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
	.titlebar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 22px;
		background: linear-gradient(90deg, #000080, #1084d0);
		color: #fff;
		padding: 2px 3px 2px 5px;
		font-weight: 700;
		font-size: 13px;
		text-shadow: 1px 1px 0 #000;
	}
	.ttl-left {
		display: flex;
		align-items: center;
		gap: 6px;
		overflow: hidden;
		white-space: nowrap;
	}
	.ttl-close {
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
		flex-shrink: 0;
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

	.body {
		flex: 1;
		overflow: auto;
		background: #c0c0c0;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid #808080;
		border-bottom: 1px solid #808080;
		margin: 1px 0;
		padding: 10px 12px;
	}
	.shot {
		height: 240px;
		max-height: 280px;
		background: #fff;
		border-top: 1px solid #808080;
		border-left: 1px solid #808080;
		border-right: 1px solid #fff;
		border-bottom: 1px solid #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		margin-bottom: 10px;
	}
	.shot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.shot-fallback {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		color: #999;
		font-size: 11px;
	}
	.dt-title {
		font-size: 16px;
		font-weight: 800;
		color: #000080;
		margin: 0 0 6px;
	}
	.meta {
		font-size: 12px;
		line-height: 1.6;
		margin-bottom: 8px;
	}
	.lbl {
		font-weight: 700;
	}
	.desc {
		font-size: 12px;
		line-height: 1.5;
		margin: 0 0 10px;
		color: #222;
	}
	.block {
		font-size: 11px;
		font-weight: 700;
		color: #000080;
		margin: 4px 0;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-bottom: 12px;
	}
	.tag {
		background: #000080;
		color: #fff;
		font-size: 10px;
		padding: 1px 6px;
		letter-spacing: 0.3px;
	}
	.actions {
		display: flex;
		gap: 8px;
	}
	.actions .wbtn:disabled {
		color: #888;
		cursor: default;
	}

	.status {
		display: flex;
		gap: 2px;
		height: 18px;
	}
	.status-cell {
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
		.win {
			width: 96vw;
			max-height: 88vh;
		}
		.shot {
			height: 160px;
		}
	}
</style>
