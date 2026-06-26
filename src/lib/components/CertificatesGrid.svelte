<script lang="ts">
	import { certificates } from '$lib/data';
	import CertificateViewer from './CertificateViewer.svelte';

	let viewIndex = $state<number | null>(null);
	let selectedIndex = $state<number | null>(null);
	let tip = $state<{ text: string; x: number; y: number } | null>(null);
	let broken = $state<Set<string>>(new Set());

	function open(i: number) {
		selectedIndex = i;
		viewIndex = i;
	}
	function close() {
		viewIndex = null;
	}
	function markBroken(id: string) {
		broken = new Set(broken).add(id);
	}
</script>

<div class="grid">
	{#each certificates as c, i (c.id)}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div
			class="card"
			class:sel={selectedIndex === i}
			role="button"
			tabindex="0"
			onclick={() => open(i)}
			onkeydown={(e) => e.key === 'Enter' && open(i)}
			onpointermove={(e) => (tip = { text: 'Open certificate', x: e.clientX, y: e.clientY + 16 })}
			onpointerleave={() => (tip = null)}
		>
			<div class="thumb">
				{#if !broken.has(c.id)}
					<img src={c.image} alt={c.title} onerror={() => markBroken(c.id)} />
				{:else}
					<div class="thumb-fallback"><span>Certificate</span></div>
				{/if}
			</div>
			<div class="card-info">
				<div class="c-title">{c.title}</div>
				<div class="c-issuer">{c.issuer}</div>
				<div class="c-year">{c.year}</div>
			</div>
		</div>
	{/each}
</div>

{#if viewIndex !== null}
	<CertificateViewer {certificates} startIndex={viewIndex} onClose={close} />
{/if}

{#if tip}
	<div class="win-tip" style="left:{tip.x}px; top:{tip.y}px;">{tip.text}</div>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		align-content: start;
		justify-items: start;
	}
	.card {
		width: 100%;
		max-width: 180px;
		display: flex;
		flex-direction: column;
		background: #c0c0c0;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid #404040;
		border-bottom: 1px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
		padding: 6px;
		cursor: pointer;
	}
	.card:hover {
		background: #d8e6ff;
	}
	.card.sel {
		background: #000080;
		color: #fff;
	}
	.thumb {
		height: 100px;
		background: #fff;
		border-top: 1px solid #808080;
		border-left: 1px solid #808080;
		border-right: 1px solid #fff;
		border-bottom: 1px solid #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}
	.thumb-fallback {
		color: #aaa;
		font-size: 10px;
	}
	.card-info {
		padding: 4px 2px 0;
	}
	.c-title {
		font-size: 11px;
		font-weight: 700;
		line-height: 1.2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 2px;
	}
	.c-issuer {
		font-size: 10px;
		color: #333;
	}
	.card.sel .c-issuer,
	.card.sel .c-year {
		color: #e8e8e8;
	}
	.c-year {
		font-size: 10px;
		color: #666;
	}

	@media (max-width: 768px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 480px) {
		.grid {
			grid-template-columns: 1fr;
		}
		.card {
			max-width: 100%;
		}
	}
</style>
