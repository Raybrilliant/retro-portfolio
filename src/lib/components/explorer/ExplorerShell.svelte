<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../Icon.svelte';
	import type { IconName } from '$lib/types';

	type Section = 'work' | 'projects' | 'certificates';

	let {
		activeSection,
		address,
		onSectionChange = () => {},
		children
	}: {
		activeSection: Section;
		address: string;
		onSectionChange?: (section: Section) => void;
		children: Snippet;
	} = $props();

	const sidebar: { id: Section; label: string; icon: IconName }[] = [
		{ id: 'work', label: 'Work', icon: 'briefcase' },
		{ id: 'projects', label: 'Projects', icon: 'folder' },
		{ id: 'certificates', label: 'Certificates', icon: 'certificate' }
	];

	let hovered: Section | null = $state(null);
</script>

<div class="explorer">
	<!-- Menu bar -->
	<div class="menubar">
		<span class="menu-item">File</span>
		<span class="menu-item">View</span>
		<span class="menu-item">Help</span>
	</div>

	<!-- Toolbar -->
	<div class="toolbar">
		<button class="tb-btn" tabindex="-1" aria-label="Back">◀</button>
		<button class="tb-btn" tabindex="-1" aria-label="Forward">▶</button>
		<button class="tb-btn" tabindex="-1" aria-label="Up">Up</button>
		<div class="tb-divider"></div>
		<button class="tb-btn" tabindex="-1">View</button>
		<button class="tb-btn" tabindex="-1">Details</button>
	</div>

	<!-- Address bar -->
	<div class="addrbar">
		<span class="addr-label">Address</span>
		<div class="addr-field">
			<Icon name="folder" size={14} />
			<span>{address}</span>
		</div>
	</div>

	<!-- Main: sidebar + content -->
	<div class="main">
		<div class="sidebar">
			{#each sidebar as s}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<button
					class="side-item"
					class:sel={activeSection === s.id}
					class:hover={hovered === s.id}
					onpointerenter={() => (hovered = s.id)}
					onpointerleave={() => (hovered = null)}
					onclick={() => onSectionChange(s.id)}
				>
					<Icon name={s.icon} size={16} />
					<span>{s.label}</span>
				</button>
			{/each}
		</div>

		<div class="content win-scroll">
			{@render children()}
		</div>
	</div>
</div>

<style>
	.explorer {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--face);
		font-family: var(--win-font);
		font-size: 12px;
		color: #000;
		overflow: hidden;
	}
	.menubar {
		display: flex;
		gap: 2px;
		padding: 2px 4px;
		background: var(--face);
		border-bottom: 1px solid #808080;
	}
	.menu-item {
		padding: 2px 8px;
		font-size: 12px;
	}
	.menu-item:hover {
		background: #000080;
		color: #fff;
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 3px;
		padding: 3px 6px;
		background: var(--face);
		border-bottom: 1px solid #808080;
	}
	.tb-btn {
		min-width: 26px;
		height: 22px;
		padding: 0 6px;
		background: var(--face);
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid #808080;
		border-bottom: 1px solid #808080;
		font-size: 11px;
		color: #000;
		cursor: default;
		font-family: var(--win-font);
	}
	.tb-btn:hover {
		border-right-color: #404040;
		border-bottom-color: #404040;
	}
	.tb-btn:active {
		border-color: #404040 #fff #fff #404040;
	}
	.tb-divider {
		width: 2px;
		height: 18px;
		background: #808080;
		border-right: 1px solid #fff;
		margin: 0 4px;
	}

	.addrbar {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 3px 6px;
		background: var(--face);
		border-bottom: 1px solid #808080;
	}
	.addr-label {
		font-size: 11px;
	}
	.addr-field {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 6px;
		background: #fff;
		border-top: 1px solid #808080;
		border-left: 1px solid #808080;
		border-right: 1px solid #fff;
		border-bottom: 1px solid #fff;
		padding: 2px 6px;
		font-size: 11px;
		min-width: 0;
	}

	.main {
		flex: 1;
		display: flex;
		min-height: 0;
	}
	.sidebar {
		width: 168px;
		flex-shrink: 0;
		background: #e8e8e8;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid #808080;
		border-bottom: 1px solid #808080;
		padding: 4px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	.side-item {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 3px 6px;
		font-size: 11px;
		cursor: pointer;
		background: transparent;
		border: none;
		font-family: var(--win-font);
		color: #000;
		text-align: left;
	}
	.side-item:hover {
		background: #d8e6ff;
	}
	.side-item.sel {
		background: #000080;
		color: #fff;
	}

	.content {
		flex: 1;
		overflow-y: auto;
		background: #fff;
		padding: 10px;
	}

	@media (max-width: 480px) {
		.sidebar {
			display: none;
		}
	}
</style>
