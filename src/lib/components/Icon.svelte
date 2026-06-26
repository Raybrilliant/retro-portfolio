<script lang="ts">
	import type { IconName } from '$lib/types';

	let { name, size = 32 }: { name: IconName; size?: number } = $props();
</script>

{#if name === 'start'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<rect x="2" y="2" width="13" height="13" fill="#d63027" />
		<rect x="17" y="2" width="13" height="13" fill="#74b74a" />
		<rect x="2" y="17" width="13" height="13" fill="#3b8ee0" />
		<rect x="17" y="17" width="13" height="13" fill="#f5c518" />
		<rect x="2" y="2" width="13" height="3" fill="#ff6b5e" />
		<rect x="2" y="17" width="13" height="3" fill="#6fb6f0" />
	</svg>
{:else if name === 'computer' || name === 'mywork'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<rect x="3" y="4" width="26" height="18" fill="#c0c0c0" stroke="#404040" stroke-width="1" />
		<rect x="5" y="6" width="22" height="13" fill="#0a8a4a" />
		<rect x="6" y="7" width="20" height="11" fill="#0bbf63" />
		<rect x="9" y="9" width="5" height="2" fill="#a6f5cf" />
		<rect x="9" y="12" width="9" height="1" fill="#0a7a3a" />
		<rect x="9" y="14" width="7" height="1" fill="#0a7a3a" />
		<rect x="9" y="16" width="8" height="1" fill="#0a7a3a" />
		<rect x="9" y="22" width="14" height="3" fill="#808080" />
		<rect x="6" y="25" width="20" height="3" fill="#c0c0c0" stroke="#404040" stroke-width="1" />
	</svg>
{:else if name === 'folder' || name === 'projects'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<path d="M3 8 H13 L16 11 H29 V26 H3 Z" fill="#e9c46a" stroke="#8a6a1a" stroke-width="1" />
		<path d="M3 12 H29 V26 H3 Z" fill="#f4d58d" />
	</svg>
{:else if name === 'about'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<circle cx="16" cy="11" r="6" fill="#f0c8a0" stroke="#7a4a20" stroke-width="1" />
		<path d="M5 29 C5 20 27 20 27 29 Z" fill="#3b8ee0" stroke="#1a3a6a" stroke-width="1" />
		<rect x="14" y="9" width="4" height="2" fill="#7a4a20" />
	</svg>
{:else if name === 'contact' || name === 'phone' || name === 'mail'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<rect x="4" y="7" width="24" height="18" rx="1" fill="#fff" stroke="#404040" stroke-width="1" />
		<path d="M5 9 L16 17 L27 9" fill="none" stroke="#1a6abf" stroke-width="2" />
	</svg>
{:else if name === 'resume' || name === 'doc'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<path d="M7 3 H20 L25 8 V29 H7 Z" fill="#fff" stroke="#404040" stroke-width="1" />
		<path d="M20 3 V8 H25" fill="#cfcfcf" stroke="#404040" stroke-width="1" />
		<rect x="10" y="13" width="12" height="1" fill="#404040" />
		<rect x="10" y="16" width="12" height="1" fill="#404040" />
		<rect x="10" y="19" width="9" height="1" fill="#404040" />
		<rect x="10" y="22" width="12" height="1" fill="#404040" />
	</svg>
{:else if name === 'recycle'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<path d="M7 11 H25 L23 28 H9 Z" fill="#cfe8d0" stroke="#2a7a2a" stroke-width="1" />
		<rect x="6" y="9" width="20" height="3" fill="#a8d6a8" stroke="#2a7a2a" stroke-width="1" />
		<path
			d="M11 14 L13 25 M16 14 V25 M21 14 L19 25"
			stroke="#2a7a2a"
			stroke-width="1"
			fill="none"
		/>
		<circle cx="16" cy="7" r="3" fill="none" stroke="#2a7a2a" stroke-width="1" />
	</svg>
{:else if name === 'docs'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<path d="M6 4 H18 L22 8 V28 H6 Z" fill="#fff" stroke="#404040" />
		<rect x="9" y="14" width="10" height="1" fill="#404040" />
		<rect x="9" y="17" width="10" height="1" fill="#404040" />
		<rect x="9" y="20" width="7" height="1" fill="#404040" />
	</svg>
{:else if name === 'settings'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<circle cx="16" cy="16" r="9" fill="#9a9a9a" stroke="#404040" />
		<circle cx="16" cy="16" r="3" fill="#404040" />
		<g fill="#9a9a9a" stroke="#404040">
			<rect x="15" y="3" width="2" height="5" />
			<rect x="15" y="24" width="2" height="5" />
			<rect x="3" y="15" width="5" height="2" />
			<rect x="24" y="15" width="5" height="2" />
		</g>
	</svg>
{:else if name === 'shutdown'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<path d="M16 4 A10 10 0 1 0 16 24" fill="none" stroke="#c03030" stroke-width="3" />
		<rect x="14" y="3" width="4" height="11" fill="#c03030" />
	</svg>
{:else if name === 'programs'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<rect x="3" y="4" width="26" height="18" fill="#c0c0c0" stroke="#404040" />
		<rect x="5" y="6" width="22" height="13" fill="#1a3a6a" />
		<rect x="7" y="8" width="4" height="2" fill="#7fd0ff" />
		<rect x="13" y="8" width="4" height="2" fill="#7fd0ff" />
		<rect x="19" y="8" width="4" height="2" fill="#7fd0ff" />
		<rect x="9" y="25" width="14" height="3" fill="#808080" />
		<rect x="6" y="28" width="20" height="2" fill="#c0c0c0" stroke="#404040" />
	</svg>
{:else if name === 'certificate'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<rect x="5" y="3" width="22" height="20" fill="#fff" stroke="#404040" stroke-width="1" />
		<rect x="5" y="3" width="22" height="4" fill="#000080" />
		<rect x="8" y="9" width="16" height="1" fill="#404040" />
		<rect x="8" y="12" width="16" height="1" fill="#404040" />
		<rect x="8" y="15" width="10" height="1" fill="#404040" />
		<!-- seal -->
		<circle cx="16" cy="22" r="4" fill="#d4a017" stroke="#8a6a10" />
		<circle cx="16" cy="22" r="1.5" fill="#8a6a10" />
		<!-- ribbon -->
		<path
			d="M12 24 L10 30 L13 28 L14 30 L16 27 L18 30 L19 28 L22 30 L20 24 Z"
			fill="#c03030"
			stroke="#7a1a1a"
			stroke-width="0.5"
		/>
	</svg>
{:else if name === 'snake'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<rect x="3" y="3" width="26" height="26" fill="#0a3a1a" stroke="#000" />
		<rect x="3" y="3" width="26" height="26" fill="#0a3a1a" />
		<g fill="#7bd64a">
			<rect x="6" y="22" width="4" height="3" />
			<rect x="10" y="19" width="4" height="3" />
			<rect x="14" y="16" width="4" height="3" />
			<rect x="18" y="13" width="4" height="3" />
			<rect x="22" y="10" width="4" height="5" />
		</g>
		<rect x="24" y="11" width="1" height="1" fill="#000" />
		<rect x="7" y="6" width="3" height="3" fill="#d63027" />
		<rect x="8" y="7" width="1" height="1" fill="#f5c518" />
	</svg>
{:else if name === 'minesweeper'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<rect x="3" y="3" width="26" height="26" fill="#c0c0c0" stroke="#404040" />
		<rect x="6" y="6" width="6" height="6" fill="#c0c0c0" stroke="#808080" />
		<rect x="14" y="6" width="6" height="6" fill="#c0c0c0" stroke="#808080" />
		<rect x="22" y="6" width="4" height="6" fill="#c0c0c0" stroke="#808080" />
		<rect x="6" y="14" width="6" height="6" fill="#c0c0c0" stroke="#808080" />
		<rect x="14" y="14" width="6" height="6" fill="#c0c0c0" stroke="#808080" />
		<rect x="22" y="14" width="4" height="6" fill="#c0c0c0" stroke="#808080" />
		<rect x="6" y="22" width="6" height="4" fill="#c0c0c0" stroke="#808080" />
		<rect x="14" y="22" width="6" height="4" fill="#c0c0c0" stroke="#808080" />
		<rect x="22" y="22" width="4" height="4" fill="#c0c0c0" stroke="#808080" />
		<circle cx="17" cy="17" r="3.5" fill="#000" />
		<rect x="16" y="12" width="2" height="2" fill="#000" />
		<rect x="12" y="16" width="2" height="2" fill="#000" />
		<rect x="20" y="16" width="2" height="2" fill="#000" />
		<rect x="16" y="20" width="2" height="2" fill="#000" />
	</svg>
{:else if name === 'winamp'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<rect x="3" y="4" width="26" height="24" rx="1" fill="#1a1a1a" stroke="#000" stroke-width="1" />
		<rect x="3" y="4" width="26" height="6" fill="#3a3a3a" />
		<rect x="5" y="5" width="8" height="3" fill="#d4a017" />
		<text x="14" y="8" font-size="4" fill="#fff" font-family="sans-serif">WA</text>
		<rect x="5" y="13" width="22" height="6" fill="#000" />
		<g fill="#9bd64a">
			<rect x="6" y="16" width="1" height="3" />
			<rect x="8" y="15" width="1" height="4" />
			<rect x="10" y="14" width="1" height="5" />
			<rect x="12" y="15" width="1" height="4" />
			<rect x="14" y="16" width="1" height="3" />
			<rect x="16" y="14" width="1" height="5" />
			<rect x="18" y="15" width="1" height="4" />
			<rect x="20" y="16" width="1" height="3" />
			<rect x="22" y="14" width="1" height="5" />
			<rect x="24" y="15" width="1" height="4" />
			<rect x="26" y="16" width="1" height="3" />
		</g>
		<rect x="5" y="21" width="22" height="2" fill="#444" />
		<rect x="5" y="21" width="10" height="2" fill="#d4a017" />
		<g fill="#888">
			<rect x="5" y="25" width="3" height="2" />
			<rect x="9" y="25" width="3" height="2" />
			<rect x="13" y="25" width="3" height="2" />
			<rect x="17" y="25" width="3" height="2" />
			<rect x="21" y="25" width="3" height="2" />
			<rect x="25" y="25" width="3" height="2" />
		</g>
	</svg>
{:else if name === 'briefcase'}
	<svg width={size} height={size} viewBox="0 0 32 32" shape-rendering="crispEdges">
		<rect x="4" y="9" width="24" height="18" fill="#9a6a2a" stroke="#404040" />
		<rect x="12" y="6" width="8" height="4" fill="#9a6a2a" stroke="#404040" />
		<rect x="4" y="14" width="24" height="3" fill="#c08040" />
	</svg>
{/if}
