<script lang="ts">
	import { projectItems, type ProjectItem } from '$lib/data';

	let tip = $state<{ text: string; x: number; y: number } | null>(null);
	let broken = $state<Set<string>>(new Set());

	function markBroken(id: string) {
		broken = new Set(broken).add(id);
	}
	function linkAvailable(p: ProjectItem) {
		return !!p.link && p.link !== '#';
	}
</script>

<div class="grid">
	{#each projectItems as p (p.id)}
		<div class="card">
			<div class="thumb">
				{#if p.image && !broken.has(p.id)}
					<img src={p.image} alt={p.title} onerror={() => markBroken(p.id)} />
				{:else}
					<div class="thumb-fallback"><span>Preview</span></div>
				{/if}
			</div>
			<div class="card-info">
				<div class="c-title">{p.title}</div>
				<div class="c-sub">{p.category}</div>
				<div class="c-year">{p.year}</div>
				<div class="tags">
					{#each p.technologies.slice(0, 2) as t}<span class="tag">{t}</span>{/each}
				</div>
			</div>
			<div class="card-action">
				{#if linkAvailable(p)}
					<a
						class="wbtn open"
						href={p.link}
						target="_blank"
						rel="noopener noreferrer"
						onpointermove={(e) => (tip = { text: 'Open project', x: e.clientX, y: e.clientY + 16 })}
						onpointerleave={() => (tip = null)}
					>
						Open ▶
					</a>
				{:else}
					<button
						class="wbtn open"
						disabled
						onpointermove={(e) => (tip = { text: 'Open project', x: e.clientX, y: e.clientY + 16 })}
						onpointerleave={() => (tip = null)}
					>
						Unavailable
					</button>
				{/if}
			</div>
		</div>
	{/each}
</div>

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
		background: #d8d8d8;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid #404040;
		border-bottom: 1px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
		padding: 6px;
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
		flex: 1;
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
		margin-bottom: 6px;
	}
	.tag {
		background: #1084d0;
		color: #fff;
		font-size: 9px;
		padding: 0 4px;
	}
	.card-action {
		display: flex;
		justify-content: stretch;
	}
	.open {
		width: 100%;
		font-size: 11px;
		padding: 3px 8px;
		text-decoration: none;
		justify-content: center;
	}
	.open:disabled {
		color: #888;
		cursor: default;
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
