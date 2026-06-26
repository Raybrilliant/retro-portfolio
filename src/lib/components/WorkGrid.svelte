<script lang="ts">
	import { workItems, type WorkItem } from '$lib/data';
	import WorkDetails from './WorkDetails.svelte';

	let selected = $state<WorkItem | null>(null);
	let tip = $state<{ text: string; x: number; y: number } | null>(null);
	let broken = $state<Set<string>>(new Set());

	function open(w: WorkItem) {
		selected = w;
	}
	function markBroken(id: string) {
		broken = new Set(broken).add(id);
	}
</script>

<div class="grid">
	{#each workItems as w (w.id)}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div
			class="card"
			role="button"
			tabindex="0"
			onclick={() => open(w)}
			onkeydown={(e) => e.key === 'Enter' && open(w)}
			onpointermove={(e) => (tip = { text: 'Open work details', x: e.clientX, y: e.clientY + 16 })}
			onpointerleave={() => (tip = null)}
		>
			<div class="thumb">
				{#if w.image && !broken.has(w.id)}
					<img src={w.image} alt={w.title} onerror={() => markBroken(w.id)} />
				{:else}
					<div class="thumb-fallback"><span>Screenshot</span></div>
				{/if}
			</div>
			<div class="card-info">
				<div class="c-title">{w.title}</div>
				<div class="c-sub">{w.client}</div>
				<div class="c-year">{w.year} · {w.type}</div>
				<div class="tags">
					{#each w.technologies.slice(0, 2) as t}<span class="tag">{t}</span>{/each}
				</div>
			</div>
		</div>
	{/each}
</div>

{#if selected}
	<WorkDetails item={selected} onClose={() => (selected = null)} />
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
		max-width: 200px;
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
	.thumb {
		height: 104px;
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
		object-fit: cover;
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
		font-size: 12px;
		font-weight: 700;
		line-height: 1.2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 2px;
	}
	.c-sub {
		font-size: 10px;
		color: #333;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.c-year {
		font-size: 10px;
		color: #666;
		margin: 1px 0 3px;
	}
	.tags {
		display: flex;
		gap: 3px;
		flex-wrap: wrap;
	}
	.tag {
		background: #000080;
		color: #fff;
		font-size: 9px;
		padding: 0 4px;
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
