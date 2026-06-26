<script lang="ts">
	import { getContext } from 'svelte';
	import { playSfx } from '$lib/data';
	import type { WindowCtx } from '$lib/types';

	let {
		onOpenWork = () => {},
		onOpenContact = () => {}
	}: { onOpenWork?: () => void; onOpenContact?: () => void } = $props();

	const win = getContext<WindowCtx>('win98-window');

	type Diff = 'Beginner' | 'Intermediate' | 'Expert';
	const CONFIG: Record<Diff, { cols: number; rows: number; mines: number }> = {
		Beginner: { cols: 9, rows: 9, mines: 10 },
		Intermediate: { cols: 16, rows: 16, mines: 40 },
		Expert: { cols: 30, rows: 16, mines: 99 }
	};

	interface Cell {
		mine: boolean;
		revealed: boolean;
		flagged: boolean;
		count: number;
	}

	let diff = $state<Diff>('Beginner');
	let cols = $state(9);
	let rows = $state(9);
	let mines = $state(10);
	let board = $state<Cell[]>([]);
	let gameState = $state<'idle' | 'playing' | 'won' | 'lost'>('idle');
	let timer = $state(0);
	let flagsPlaced = $state(0);
	let pressing = $state(false);
	let showWin = $state(false);
	let bestTime = $state(0);

	const NUM_COLORS = [
		'',
		'#0000ff',
		'#008000',
		'#ff0000',
		'#000080',
		'#800000',
		'#008080',
		'#000000',
		'#808080'
	];

	function makeBoard(c: number, r: number): Cell[] {
		return Array.from({ length: c * r }, () => ({
			mine: false,
			revealed: false,
			flagged: false,
			count: 0
		}));
	}

	function idx(x: number, y: number) {
		return y * cols + x;
	}
	function neighbors(i: number): number[] {
		const x = i % cols;
		const y = Math.floor(i / cols);
		const out: number[] = [];
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				if (dx === 0 && dy === 0) continue;
				const nx = x + dx;
				const ny = y + dy;
				if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) out.push(idx(nx, ny));
			}
		}
		return out;
	}

	function loadBest() {
		if (typeof localStorage === 'undefined') return;
		const b = Number(localStorage.getItem(`mines-best-${diff}`) ?? '0');
		bestTime = isNaN(b) ? 0 : b;
	}

	function reset(d: Diff = diff) {
		diff = d;
		const cfg = CONFIG[d];
		cols = cfg.cols;
		rows = cfg.rows;
		mines = cfg.mines;
		board = makeBoard(cols, rows);
		gameState = 'idle';
		timer = 0;
		flagsPlaced = 0;
		showWin = false;
		loadBest();
	}

	function placeMines(safe: number) {
		const exclude = new Set([safe, ...neighbors(safe)]);
		const candidates: number[] = [];
		for (let i = 0; i < board.length; i++) if (!exclude.has(i)) candidates.push(i);
		// shuffle
		for (let i = candidates.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[candidates[i], candidates[j]] = [candidates[j], candidates[i]];
		}
		const placed = candidates.slice(0, mines);
		const nb = board.map((c, i) => ({ ...c, mine: placed.includes(i) }));
		for (let i = 0; i < nb.length; i++) {
			if (nb[i].mine) continue;
			nb[i].count = neighbors(i).filter((n) => nb[n].mine).length;
		}
		board = nb;
	}

	function startTimer() {
		const t = setInterval(() => {
			if (gameState !== 'playing') {
				clearInterval(t);
				return;
			}
			timer += 1;
		}, 1000);
	}

	function reveal(i: number) {
		if (gameState === 'won' || gameState === 'lost') return;
		const cell = board[i];
		if (cell.revealed || cell.flagged) return;

		if (gameState === 'idle') {
			placeMines(i);
			gameState = 'playing';
			startTimer();
		}

		if (cell.mine) {
			board = board.map((c, j) => (c.mine ? { ...c, revealed: true } : c));
			gameState = 'lost';
			playSfx('lose', 0.4);
			return;
		}

		// flood fill
		const stack = [i];
		const nb = [...board];
		while (stack.length) {
			const cur = stack.pop()!;
			if (nb[cur].revealed || nb[cur].flagged) continue;
			nb[cur].revealed = true;
			if (nb[cur].count === 0 && !nb[cur].mine) {
				for (const n of neighbors(cur)) {
					if (!nb[n].revealed && !nb[n].mine) stack.push(n);
				}
			}
		}
		board = nb;
		playSfx('reveal', 0.2);
		checkWin();
	}

	function toggleFlag(e: MouseEvent, i: number) {
		e.preventDefault();
		if (gameState === 'won' || gameState === 'lost') return;
		const cell = board[i];
		if (cell.revealed) return;
		board = board.map((c, j) => (j === i ? { ...c, flagged: !c.flagged } : c));
		flagsPlaced = board.filter((c) => c.flagged).length;
	}

	function checkWin() {
		const safeRemaining = board.some((c) => !c.mine && !c.revealed);
		if (!safeRemaining) {
			gameState = 'won';
			// flag all mines visually
			board = board.map((c) => (c.mine ? { ...c, flagged: true } : c));
			if (bestTime === 0 || timer < bestTime) {
				bestTime = timer;
				if (typeof localStorage !== 'undefined')
					localStorage.setItem(`mines-best-${diff}`, String(bestTime));
			}
			showWin = true;
			playSfx('win', 0.4);
		}
	}

	const smiley = $derived(
		gameState === 'lost' ? '😵' : gameState === 'won' ? '😎' : pressing ? '😮' : '🙂'
	);
	const mineCount = $derived(Math.max(0, mines - flagsPlaced));
	const timerStr = $derived(Math.min(999, timer).toString().padStart(3, '0'));
	const mineStr = $derived(Math.max(-99, mineCount).toString().padStart(3, '0'));

	// pause timer when window minimized (visual only; interval self-clears via gameState check)
	$effect(() => {
		if (win && win.minimized && gameState === 'playing') {
			// keep timer running but it's fine
		}
	});

	reset('Beginner');
	loadBest();
</script>

<div class="ms-app">
	<div class="ms-toolbar">
		<label class="ms-diff">
			Difficulty
			<select value={diff} onchange={(e) => reset(e.currentTarget.value as Diff)}>
				<option>Beginner</option>
				<option>Intermediate</option>
				<option>Expert</option>
			</select>
		</label>
		<div class="ms-best">Best: {bestTime || '—'}s</div>
	</div>

	<div class="ms-header">
		<div class="seg mine-seg">{mineStr}</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<button
			class="smiley"
			onclick={() => reset()}
			onmousedown={() => (pressing = true)}
			onmouseup={() => (pressing = false)}
			onmouseleave={() => (pressing = false)}
			aria-label="Reset"
		>
			{smiley}
		</button>
		<div class="seg time-seg">{timerStr}</div>
	</div>

	<div
		class="ms-board"
		style="grid-template-columns:repeat({cols}, 22px);"
		oncontextmenu={(e) => e.preventDefault()}
	>
		{#each board as cell, i}
			<button
				class="cell"
				class:revealed={cell.revealed}
				class:mine={cell.revealed && cell.mine}
				class:flagged={cell.flagged}
				class:boom={cell.revealed && cell.mine && gameState === 'lost'}
				onmousedown={() => (pressing = true)}
				onmouseup={() => (pressing = false)}
				onmouseleave={() => (pressing = false)}
				onclick={() => reveal(i)}
				oncontextmenu={(e) => toggleFlag(e, i)}
				style="color:{NUM_COLORS[cell.count]}"
			>
				{#if cell.revealed}
					{#if cell.mine}💣{:else if cell.count > 0}{cell.count}{/if}
				{:else if cell.flagged}🚩{/if}
			</button>
		{/each}
	</div>

	<div class="ms-status">
		{#if gameState === 'won'}You cleared the field! 🎉{:else if gameState === 'lost'}Boom! Game
			over.{:else}Left-click to reveal · Right-click to flag{/if}
	</div>

	{#if showWin}
		<div class="ms-modal-overlay">
			<div class="ms-modal anim-open">
				<div class="ms-modal-title">
					<span>Recruiter Mode</span>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<button class="ms-modal-x" onclick={() => (showWin = false)}>×</button>
				</div>
				<div class="ms-modal-body">
					<p class="ms-modal-head">😎 You cleared the field.</p>
					<p class="ms-modal-sub">Recruiter mode unlocked.</p>
					<p class="ms-modal-time">Time: {timer}s · Best ({diff}): {bestTime}s</p>
					<div class="ms-modal-actions">
						<button
							class="wbtn"
							onclick={() => {
								showWin = false;
								onOpenWork();
							}}>View Work</button
						>
						<button
							class="wbtn"
							onclick={() => {
								showWin = false;
								onOpenContact();
							}}>Contact Ray</button
						>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.ms-app {
		padding: 8px;
		font-family: var(--win-font);
		color: #000;
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: center;
	}
	.ms-toolbar {
		display: flex;
		gap: 8px;
		align-items: center;
		width: 100%;
		justify-content: space-between;
	}
	.ms-diff {
		font-size: 11px;
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.ms-diff select {
		font-family: var(--win-font);
		font-size: 11px;
		border-top: 2px solid #808080;
		border-left: 2px solid #808080;
		border-right: 2px solid #fff;
		border-bottom: 2px solid #fff;
		background: #fff;
	}
	.ms-best {
		font-size: 11px;
		color: #000080;
		font-weight: 700;
	}
	.ms-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 6px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
	}
	.seg {
		font-family: 'Courier New', monospace;
		font-weight: 800;
		font-size: 18px;
		color: #ff0000;
		background: #000;
		padding: 1px 4px;
		letter-spacing: 1px;
		border: 1px solid #404040;
		min-width: 48px;
		text-align: center;
		text-shadow: 0 0 4px rgba(255, 60, 60, 0.6);
	}
	.smiley {
		width: 30px;
		height: 30px;
		font-size: 18px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
		cursor: pointer;
		padding: 0;
		line-height: 1;
	}
	.smiley:active {
		border-color: #404040 #fff #fff #404040;
		box-shadow:
			inset 1px 1px 0 #808080,
			inset -1px -1px 0 #dfdfdf;
	}
	.ms-board {
		display: grid;
		gap: 0;
		border-top: 2px solid #808080;
		border-left: 2px solid #808080;
		border-right: 2px solid #fff;
		border-bottom: 2px solid #fff;
		background: var(--face);
	}
	.cell {
		width: 22px;
		height: 22px;
		font-family: var(--win-font);
		font-size: 13px;
		font-weight: 800;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #808080;
		border-bottom: 2px solid #808080;
		cursor: pointer;
		line-height: 1;
	}
	.cell:active:not(.revealed) {
		border-color: #404040;
		border-width: 1px;
	}
	.cell.revealed {
		background: #c0c0c0;
		border: 1px solid #808080;
	}
	.cell.mine {
		background: #c0c0c0;
	}
	.cell.boom {
		background: #c03030;
	}
	.ms-status {
		font-size: 11px;
		color: #444;
		min-height: 14px;
	}

	/* Win modal */
	.ms-modal-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.35);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
	}
	.ms-modal {
		width: 260px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf,
			3px 3px 10px rgba(0, 0, 0, 0.4);
	}
	.ms-modal-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(90deg, #000080, #1084d0);
		color: #fff;
		font-weight: 700;
		font-size: 12px;
		padding: 3px 4px 3px 6px;
	}
	.ms-modal-x {
		background: var(--face);
		width: 18px;
		height: 16px;
		border: 1px solid;
		border-color: #fff #404040 #404040 #fff;
		cursor: pointer;
		font-size: 12px;
		line-height: 1;
		padding: 0;
	}
	.ms-modal-body {
		padding: 12px;
		text-align: center;
	}
	.ms-modal-head {
		font-size: 14px;
		font-weight: 800;
		margin: 0 0 2px;
		color: #000080;
	}
	.ms-modal-sub {
		font-size: 12px;
		margin: 0 0 8px;
	}
	.ms-modal-time {
		font-size: 11px;
		color: #555;
		margin: 0 0 10px;
	}
	.ms-modal-actions {
		display: flex;
		gap: 6px;
		justify-content: center;
	}
</style>
