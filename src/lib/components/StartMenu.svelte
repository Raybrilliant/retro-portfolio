<script lang="ts">
	import Icon from './Icon.svelte';
	import type { IconName } from '$lib/types';

	let {
		visible,
		onItem,
		onShutDown
	}: {
		visible: boolean;
		onItem: (id: string) => void;
		onShutDown?: () => void;
	} = $props();

	const items: { id: string; label: string; icon: IconName; key?: string }[] = [
		{ id: 'work', label: 'Work', icon: 'briefcase', key: 'W' },
		{ id: 'projects', label: 'Projects', icon: 'folder', key: 'J' },
		{ id: 'about', label: 'About Me', icon: 'about', key: 'A' },
		{ id: 'contact', label: 'Contact', icon: 'mail', key: 'C' },
		{ id: 'certificates', label: 'Certificates', icon: 'certificate', key: 'T' },
		{ id: 'winamp', label: 'Winamp Player', icon: 'winamp', key: 'P' },
		{ id: 'snake', label: 'Snake Game', icon: 'snake', key: 'S' },
		{ id: 'minesweeper', label: 'Minesweeper', icon: 'minesweeper', key: 'M' },
		{ id: 'resume', label: 'Resume', icon: 'doc', key: 'R' }
	];

	let hoverItem: string | null = $state('work');
</script>

{#if visible}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="startmenu anim-rise" onpointerdown={(e) => e.stopPropagation()} role="presentation">
		<!-- Left vertical banner -->
		<div class="banner">
			<span class="banner-text">Raybrilliant<span class="banner-sub">OS</span></span>
		</div>

		<!-- Main items -->
		<div class="items">
			{#each items as it}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<button
					class="item"
					class:hi={hoverItem === it.id}
					onpointerenter={() => (hoverItem = it.id)}
					onclick={() => onItem(it.id)}
				>
					<span class="iwrap"><Icon name={it.icon} size={22} /></span>
					<span class="label">
						<b>{it.label}</b>
						{#if it.key}<u>{it.key}</u>{/if}
					</span>
				</button>
			{/each}

			<hr class="sep" />

			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<button class="item dim" onclick={() => onShutDown?.()}>
				<span class="iwrap"><Icon name="shutdown" size={22} /></span>
				<span class="label"><b>Shut Down…</b></span>
			</button>
		</div>
	</div>
{/if}

<style>
	.startmenu {
		position: absolute;
		left: 2px;
		bottom: 42px;
		width: 260px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf,
			3px 3px 8px rgba(0, 0, 0, 0.35);
		display: flex;
		overflow: hidden;
		z-index: 9000;
	}

	.banner {
		width: 36px;
		background: linear-gradient(180deg, #000080 0%, #1084d0 100%);
		position: relative;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 6px 0;
	}
	.banner-text {
		color: #fff;
		font-weight: 800;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		font-size: 18px;
		letter-spacing: 1px;
		text-shadow: 1px 1px 0 #000;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.banner-sub {
		font-size: 10px;
		font-weight: 700;
		opacity: 0.85;
	}

	.items {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 3px;
		gap: 1px;
	}
	.item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 5px 8px;
		background: transparent;
		border: none;
		cursor: pointer;
		font-family: var(--win-font);
		font-size: 13px;
		color: #000;
		text-align: left;
		width: 100%;
	}
	.item.hi {
		background: var(--hi-blue);
		color: #fff;
	}
	.item.dim {
		color: #444;
	}
	.iwrap {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.label {
		flex: 1;
		display: flex;
		align-items: baseline;
		gap: 4px;
	}
	.label b {
		font-weight: 700;
	}
	.chev {
		font-size: 8px;
		opacity: 0.7;
	}
	.sep {
		border: none;
		border-top: 1px solid #808080;
		border-bottom: 1px solid #fff;
		margin: 3px 2px;
	}
</style>
