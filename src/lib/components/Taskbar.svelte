<script lang="ts">
	import Icon from './Icon.svelte';
	import type { IconName } from '$lib/types';

	let {
		startOpen,
		tasks,
		activeId,
		onToggleStart,
		onTaskClick
	}: {
		startOpen: boolean;
		tasks: { id: string; title: string; icon: IconName; minimized: boolean }[];
		activeId: string | null;
		onToggleStart: () => void;
		onTaskClick: (id: string) => void;
	} = $props();

	let now = $state(new Date());
	$effect(() => {
		const t = setInterval(() => (now = new Date()), 1000 * 15);
		return () => clearInterval(t);
	});

	const timeStr = $derived(
		now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
	);
</script>

<div class="taskbar">
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<button
		class="start-btn"
		class:pressed={startOpen}
		onclick={(e) => {
			e.stopPropagation();
			onToggleStart();
		}}
	>
		<Icon name="start" size={18} />
		<span class="start-label">Start</span>
	</button>

	<div class="divider"></div>

	<div class="tasks">
		{#each tasks as t}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<button
				class="task"
				class:active={activeId === t.id && !t.minimized}
				class:pressed={t.minimized}
				onclick={() => onTaskClick(t.id)}
			>
				<Icon name={t.icon} size={16} />
				<span class="task-label">{t.title}</span>
			</button>
		{/each}
	</div>

	<div class="tray">
		<span class="tray-icon" title="Sound">🔊</span>
		<span class="tray-time">{timeStr}</span>
	</div>
</div>

<style>
	.taskbar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 40px;
		background: var(--face);
		border-top: 2px solid #fff;
		box-shadow: inset 0 1px 0 #dfdfdf;
		display: flex;
		align-items: center;
		padding: 3px;
		gap: 4px;
		z-index: 9500;
	}

	.start-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 34px;
		padding: 0 10px 0 6px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
		cursor: pointer;
		font-family: var(--win-font);
		font-weight: 700;
		font-size: 13px;
		color: #000;
	}
	.start-btn.pressed {
		border-color: #404040 #fff #fff #404040;
		box-shadow:
			inset 1px 1px 0 #808080,
			inset -1px -1px 0 #dfdfdf;
		padding: 1px 8px 0 8px;
	}
	.start-label {
		font-style: italic;
	}

	.divider {
		width: 2px;
		height: 30px;
		background: #808080;
		border-right: 1px solid #fff;
		margin: 0 2px;
	}

	.tasks {
		flex: 1;
		display: flex;
		gap: 3px;
		overflow: hidden;
	}
	.task {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 30px;
		padding: 0 8px;
		min-width: 0;
		max-width: 170px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
		cursor: pointer;
		font-family: var(--win-font);
		font-size: 12px;
		color: #000;
	}
	.task.active {
		background: repeating-linear-gradient(45deg, #000080 0, #000080 1px, #1084d0 1px, #1084d0 2px);
		color: #fff;
		font-weight: 700;
		border-color: #404040 #fff #fff #404040;
		box-shadow:
			inset 1px 1px 0 #808080,
			inset -1px -1px 0 #dfdfdf;
	}
	.task.pressed {
		border-color: #404040 #fff #fff #404040;
		box-shadow:
			inset 1px 1px 0 #808080,
			inset -1px -1px 0 #dfdfdf;
	}
	.task-label {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tray {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 34px;
		padding: 0 10px;
		border-top: 2px solid #808080;
		border-left: 2px solid #808080;
		border-right: 2px solid #fff;
		border-bottom: 2px solid #fff;
		background: var(--face);
		font-size: 12px;
	}
	.tray-icon {
		font-size: 12px;
	}
	.tray-time {
		font-variant-numeric: tabular-nums;
		min-width: 56px;
		text-align: right;
	}
</style>
