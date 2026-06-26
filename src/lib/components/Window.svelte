<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconName, WindowCtx } from '$lib/types';

	let {
		id,
		title,
		icon,
		children,
		active = false,
		minimized = false,
		x = 120,
		y = 80,
		width = 520,
		height = 360,
		z = 1,
		keepMounted = false,
		onActivate,
		onClose,
		onMinimize,
		onMaximize,
		resizable = true,
		statusText = 'Ready',
		statusRight = ''
	}: {
		id: string;
		title: string;
		icon: IconName;
		children: Snippet;
		active?: boolean;
		minimized?: boolean;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		z?: number;
		keepMounted?: boolean;
		onActivate?: (id: string) => void;
		onClose?: (id: string) => void;
		onMinimize?: (id: string) => void;
		onMaximize?: (id: string) => void;
		resizable?: boolean;
		statusText?: string;
		statusRight?: string;
	} = $props();

	// Reactive context so children (games) can react to focus/minimize.
	const winCtx = $state<WindowCtx>({ active, minimized });
	$effect(() => {
		winCtx.active = active;
		winCtx.minimized = minimized;
	});
	setContext('win98-window', winCtx);

	let px = $state(x);
	let py = $state(y);
	let w = $state(width);
	let h = $state(height);
	let maximized = $state(false);
	let dragging = $state(false);
	let resizing = $state(false);
	let dragOff = { x: 0, y: 0 };

	function startDrag(e: PointerEvent) {
		if (maximized) return;
		onActivate?.(id);
		dragging = true;
		dragOff = { x: e.clientX - px, y: e.clientY - py };
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
		window.addEventListener('pointermove', onDrag);
		window.addEventListener('pointerup', endDrag);
	}
	function onDrag(e: PointerEvent) {
		if (!dragging) return;
		px = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - dragOff.x));
		py = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - dragOff.y));
	}
	function endDrag() {
		dragging = false;
		window.removeEventListener('pointermove', onDrag);
		window.removeEventListener('pointerup', endDrag);
	}

	function startResize(e: PointerEvent) {
		e.stopPropagation();
		onActivate?.(id);
		resizing = true;
		const sx = e.clientX;
		const sy = e.clientY;
		const sw = w;
		const sh = h;
		function onMove(ev: PointerEvent) {
			if (!resizing) return;
			w = Math.max(280, sw + (ev.clientX - sx));
			h = Math.max(180, sh + (ev.clientY - sy));
		}
		function onUp() {
			resizing = false;
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
		}
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	}

	function handleMaximize() {
		maximized = !maximized;
		onMaximize?.(id);
	}

	const style = $derived(
		maximized
			? 'left:0;top:0;width:100vw;height:calc(100vh - 40px);'
			: `left:${px}px;top:${py}px;width:${w}px;height:${h}px;`
	);
</script>

{#if !minimized || keepMounted}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="win anim-open"
		class:active
		class:hidden={minimized && keepMounted}
		style="{style} z-index:{z};"
		onpointerdown={() => onActivate?.(id)}
		role="presentation"
	>
		<!-- Title bar -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div
			class="titlebar"
			class:active
			onpointerdown={startDrag}
			ondblclick={handleMaximize}
			role="presentation"
		>
			<div class="ttl-left">
				<Icon name={icon} size={16} />
				<span class="ttl-text">{title}</span>
			</div>
			<div class="ttl-btns">
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<button
					class="ttl-btn"
					aria-label="Minimize"
					onpointerdown={(e) => e.stopPropagation()}
					onclick={() => onMinimize?.(id)}
				>
					<span class="glyph min"></span>
				</button>
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<button
					class="ttl-btn"
					aria-label="Maximize"
					onpointerdown={(e) => e.stopPropagation()}
					onclick={handleMaximize}
				>
					<span class="glyph max"></span>
				</button>
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<button
					class="ttl-btn close"
					aria-label="Close"
					onpointerdown={(e) => e.stopPropagation()}
					onclick={() => onClose?.(id)}
				>
					<span class="glyph x"></span>
				</button>
			</div>
		</div>

		<!-- Body -->
		<div class="win-body win-scroll">
			{@render children()}
		</div>

		<!-- Status bar -->
		<div class="win-status">
			<div class="status-cell flex-1">{statusText}</div>
			<div class="status-cell">{statusRight || title}</div>
		</div>

		{#if resizable && !maximized}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="resizer" onpointerdown={startResize} role="presentation"></div>
		{/if}
	</div>
{/if}

<style>
	.win {
		position: absolute;
		display: flex;
		flex-direction: column;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf,
			2px 2px 6px rgba(0, 0, 0, 0.28);
		padding: 2px;
		min-width: 280px;
		min-height: 180px;
	}
	.win.active {
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf,
			3px 3px 10px rgba(0, 0, 0, 0.35);
	}
	.win.hidden {
		display: none;
	}

	.titlebar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 22px;
		background: #808080;
		padding: 2px 3px 2px 4px;
		cursor: move;
		user-select: none;
		touch-action: none;
	}
	.titlebar.active {
		background: linear-gradient(90deg, #000080 0%, #1084d0 100%);
	}
	.ttl-left {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #fff;
		font-weight: 700;
		font-size: 13px;
		text-shadow: 1px 1px 0 #000;
		overflow: hidden;
		flex: 1 1 auto;
		min-width: 0;
	}
	.ttl-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.ttl-btns {
		display: flex;
		gap: 2px;
		flex-shrink: 0;
	}
	.ttl-btn {
		width: 20px;
		height: 18px;
		background: var(--face);
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid #404040;
		border-bottom: 1px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
	}
	.ttl-btn:active {
		border-color: #404040 #fff #fff #404040;
		box-shadow:
			inset 1px 1px 0 #808080,
			inset -1px -1px 0 #dfdfdf;
	}
	.glyph {
		display: block;
		width: 10px;
		height: 10px;
		position: relative;
	}
	.glyph.min::before {
		content: '';
		position: absolute;
		left: 1px;
		bottom: 1px;
		width: 8px;
		height: 2px;
		background: #000;
	}
	.glyph.max::before {
		content: '';
		position: absolute;
		left: 1px;
		top: 1px;
		width: 9px;
		height: 8px;
		border: 1px solid #000;
		border-top-width: 2px;
	}
	.glyph.x::before,
	.glyph.x::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 12px;
		height: 2px;
		background: #000;
		top: 4px;
	}
	.glyph.x::before {
		transform: rotate(45deg);
	}
	.glyph.x::after {
		transform: rotate(-45deg);
	}

	.win-body {
		flex: 1;
		overflow: auto;
		background: #fff;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid #808080;
		border-bottom: 1px solid #808080;
		margin: 1px 0;
	}

	.win-status {
		display: flex;
		gap: 2px;
		height: 18px;
	}
	.status-cell {
		background: var(--face);
		border-top: 1px solid #404040;
		border-left: 1px solid #404040;
		border-right: 1px solid #fff;
		border-bottom: 1px solid #fff;
		padding: 1px 4px;
		font-size: 11px;
		color: #000;
	}
	.flex-1 {
		flex: 1;
	}

	.resizer {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 14px;
		height: 14px;
		cursor: nwse-resize;
		touch-action: none;
		background: linear-gradient(
			135deg,
			transparent 0 50%,
			#404040 50% 60%,
			transparent 60% 70%,
			#404040 70% 80%,
			transparent 80% 90%,
			#404040 90% 100%
		);
	}
</style>
