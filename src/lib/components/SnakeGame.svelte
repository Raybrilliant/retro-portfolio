<script lang="ts">
	import { getContext } from 'svelte';
	import { playSfx } from '$lib/data';
	import type { WindowCtx } from '$lib/types';

	let { onToast = (msg: string) => {} }: { onToast?: (msg: string) => void } = $props();

	const win = getContext<WindowCtx>('win98-window');

	const COLS = 20;
	const ROWS = 20;
	const CELL = 16;

	type Pt = { x: number; y: number };
	type Status = 'Ready' | 'Playing' | 'Paused' | 'Game Over';

	let snake = $state<Pt[]>([{ x: 9, y: 9 }]);
	let dir = $state<Pt>({ x: 1, y: 0 });
	let pendingDir = $state<Pt>({ x: 1, y: 0 });
	let food = $state<Pt>({ x: 14, y: 9 });
	let score = $state(0);
	let highScore = $state(0);
	let status = $state<Status>('Ready');
	let speed = $state<'Slow' | 'Normal' | 'Fast'>('Normal');
	let canvas: HTMLCanvasElement | null = null;

	const speedMs = $derived(speed === 'Slow' ? 160 : speed === 'Fast' ? 70 : 110);

	// Load high score
	$effect(() => {
		if (typeof localStorage === 'undefined') return;
		const s = Number(localStorage.getItem('snake-highscore') ?? '0');
		highScore = isNaN(s) ? 0 : s;
	});

	function placeFood() {
		const free: Pt[] = [];
		for (let y = 0; y < ROWS; y++) {
			for (let x = 0; x < COLS; x++) {
				if (!snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
			}
		}
		food = free[Math.floor(Math.random() * free.length)] ?? { x: 0, y: 0 };
	}

	function reset() {
		snake = [
			{ x: 9, y: 9 },
			{ x: 8, y: 9 },
			{ x: 7, y: 9 }
		];
		dir = { x: 1, y: 0 };
		pendingDir = { x: 1, y: 0 };
		score = 0;
		status = 'Ready';
		placeFood();
		draw();
	}

	function start() {
		if (status === 'Game Over') reset();
		status = 'Playing';
	}

	function togglePause() {
		if (status === 'Playing') status = 'Paused';
		else if (status === 'Paused') status = 'Playing';
	}

	function step() {
		dir = pendingDir;
		const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
		// wall collision
		if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
			return gameOver();
		}
		// self collision
		if (snake.some((s) => s.x === head.x && s.y === head.y)) {
			return gameOver();
		}
		const newSnake = [head, ...snake];
		if (head.x === food.x && head.y === food.y) {
			score += 1;
			playSfx('eat', 0.4);
			if (score % 5 === 0) {
				onToast('Achievement unlocked: Still debugging life.');
			}
			if (score > highScore) {
				highScore = score;
				if (typeof localStorage !== 'undefined')
					localStorage.setItem('snake-highscore', String(highScore));
			}
			placeFood();
		} else {
			newSnake.pop();
		}
		snake = newSnake;
	}

	function gameOver() {
		status = 'Game Over';
		playSfx('gameover', 0.4);
		if (score > highScore) {
			highScore = score;
			if (typeof localStorage !== 'undefined')
				localStorage.setItem('snake-highscore', String(highScore));
		}
	}

	function draw() {
		const ctx = canvas?.getContext('2d');
		if (!ctx) return;
		// background grid
		ctx.fillStyle = '#9bd64a';
		ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
		ctx.fillStyle = '#8cc63f';
		for (let y = 0; y < ROWS; y++) {
			for (let x = 0; x < COLS; x++) {
				if ((x + y) % 2 === 0) ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
			}
		}
		// food
		ctx.fillStyle = '#d63027';
		ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
		ctx.fillStyle = '#f5c518';
		ctx.fillRect(food.x * CELL + 5, food.y * CELL + 5, 3, 3);
		// snake
		snake.forEach((s, i) => {
			ctx.fillStyle = i === 0 ? '#1a6a1a' : '#2e8b2e';
			ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
			if (i === 0) {
				ctx.fillStyle = '#fff';
				ctx.fillRect(s.x * CELL + 4, s.y * CELL + 4, 2, 2);
				ctx.fillRect(s.x * CELL + 10, s.y * CELL + 4, 2, 2);
			}
		});
	}

	// Keyboard
	function turn(nd: Pt) {
		if (nd.x === -dir.x && nd.y === -dir.y) return; // no reverse
		pendingDir = nd;
		if (status === 'Ready') start();
	}

	function onKey(e: KeyboardEvent) {
		if (!win || !win.active || win.minimized) return;
		const k = e.key.toLowerCase();
		const map: Record<string, Pt> = {
			arrowup: { x: 0, y: -1 },
			w: { x: 0, y: -1 },
			arrowdown: { x: 0, y: 1 },
			s: { x: 0, y: 1 },
			arrowleft: { x: -1, y: 0 },
			a: { x: -1, y: 0 },
			arrowright: { x: 1, y: 0 },
			d: { x: 1, y: 0 }
		};
		if (k === ' ' || k === 'p') {
			e.preventDefault();
			if (status === 'Ready') start();
			else togglePause();
			return;
		}
		const nd = map[k];
		if (!nd) return;
		e.preventDefault();
		turn(nd);
	}

	$effect(() => {
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	// Auto-pause when window inactive/minimized
	$effect(() => {
		if (!win) return;
		if ((win.minimized || !win.active) && status === 'Playing') {
			status = 'Paused';
		}
	});

	// Game loop
	$effect(() => {
		if (status !== 'Playing') return;
		const t = setInterval(() => {
			step();
			draw();
		}, speedMs);
		return () => clearInterval(t);
	});

	// Redraw on state change
	$effect(() => {
		// re-bind deps
		snake;
		food;
		status;
		draw();
	});
</script>

<div class="snake-app">
	<div class="hud">
		<div class="counter">
			<span class="clbl">SCORE</span>
			<span class="cval">{score.toString().padStart(3, '0')}</span>
		</div>
		<div class="status-pill" class:go={status === 'Game Over'} class:play={status === 'Playing'}>
			{status}
		</div>
		<div class="counter">
			<span class="clbl">HIGH</span>
			<span class="cval hi">{highScore.toString().padStart(3, '0')}</span>
		</div>
	</div>

	<div class="board-wrap">
		<canvas bind:this={canvas} width={COLS * CELL} height={ROWS * CELL} class="board"></canvas>
		{#if status === 'Game Over'}
			<div class="overlay">
				<div class="go-card">
					<div class="go-title">Game Over</div>
					<div class="go-score">Final score: {score}</div>
				</div>
			</div>
		{:else if status === 'Paused'}
			<div class="overlay">
				<div class="pause-card">Paused — tap Resume</div>
			</div>
		{:else if status === 'Ready'}
			<div class="overlay">
				<div class="pause-card">Tap Start to play</div>
			</div>
		{/if}
	</div>

	<div class="controls">
		<button class="wbtn" onclick={start}>▶ Start</button>
		<button class="wbtn" onclick={togglePause}>
			{status === 'Paused' ? '▶ Resume' : '⏸ Pause'}
		</button>
		<button class="wbtn" onclick={reset}>↻ Restart</button>
		<label class="speed">
			Speed
			<select bind:value={speed} onchange={() => status === 'Playing' && (status = 'Paused')}>
				<option>Slow</option>
				<option>Normal</option>
				<option>Fast</option>
			</select>
		</label>
	</div>

	<!-- Touch D-pad -->
	<div class="dpad" role="group" aria-label="Snake controls">
		<button class="dbtn up" aria-label="Up" onclick={() => turn({ x: 0, y: -1 })}>▲</button>
		<button class="dbtn left" aria-label="Left" onclick={() => turn({ x: -1, y: 0 })}>◀</button>
		<button class="dbtn right" aria-label="Right" onclick={() => turn({ x: 1, y: 0 })}>▶</button>
		<button class="dbtn down" aria-label="Down" onclick={() => turn({ x: 0, y: 1 })}>▼</button>
	</div>

	<p class="hint">Arrow keys / WASD or the D-pad to steer · Space to pause</p>
</div>

<style>
	.snake-app {
		padding: 10px;
		font-family: var(--win-font);
		color: #000;
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: center;
	}
	.hud {
		display: flex;
		gap: 6px;
		width: 100%;
		align-items: center;
	}
	.counter {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #000;
		padding: 2px 8px;
		min-width: 64px;
	}
	.clbl {
		font-size: 8px;
		color: #d4a017;
		letter-spacing: 1px;
	}
	.cval {
		font-family: 'Courier New', monospace;
		font-size: 18px;
		font-weight: 800;
		color: #ff3b3b;
		font-variant-numeric: tabular-nums;
		text-shadow: 0 0 4px rgba(255, 60, 60, 0.5);
		line-height: 1.1;
	}
	.cval.hi {
		color: #9bd64a;
		text-shadow: 0 0 4px rgba(155, 214, 74, 0.5);
	}
	.status-pill {
		flex: 1;
		text-align: center;
		font-size: 12px;
		font-weight: 700;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 4px 6px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
		color: #444;
	}
	.status-pill.go {
		color: #c03030;
	}
	.status-pill.play {
		color: #2e8b2e;
	}
	.board-wrap {
		position: relative;
		border-top: 2px solid #404040;
		border-left: 2px solid #404040;
		border-right: 2px solid #fff;
		border-bottom: 2px solid #fff;
		line-height: 0;
	}
	.board {
		image-rendering: pixelated;
		display: block;
		box-shadow: 0 0 6px rgba(120, 200, 120, 0.35);
	}
	.overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.55);
	}
	.go-card,
	.pause-card {
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		padding: 8px 16px;
		text-align: center;
	}
	.go-title {
		font-size: 18px;
		font-weight: 800;
		color: #c03030;
	}
	.go-score {
		font-size: 12px;
		margin-top: 2px;
	}
	.pause-card {
		font-size: 12px;
		font-weight: 700;
	}
	.controls {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
	.speed {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 11px;
	}
	.speed select {
		font-family: var(--win-font);
		font-size: 11px;
		border-top: 2px solid #808080;
		border-left: 2px solid #808080;
		border-right: 2px solid #fff;
		border-bottom: 2px solid #fff;
		background: #fff;
	}
	.hint {
		font-size: 10px;
		color: #555;
		margin: 0;
	}

	.dpad {
		display: grid;
		grid-template-columns: repeat(3, 44px);
		grid-template-rows: repeat(3, 44px);
		gap: 4px;
		margin-top: 2px;
	}
	.dbtn {
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow:
			inset -1px -1px 0 #808080,
			inset 1px 1px 0 #dfdfdf;
		font-size: 16px;
		color: #000;
		cursor: pointer;
		padding: 0;
		touch-action: manipulation;
	}
	.dbtn:active {
		border-color: #404040 #fff #fff #404040;
		box-shadow:
			inset 1px 1px 0 #808080,
			inset -1px -1px 0 #dfdfdf;
	}
	.dbtn.up {
		grid-column: 2;
		grid-row: 1;
	}
	.dbtn.left {
		grid-column: 1;
		grid-row: 2;
	}
	.dbtn.right {
		grid-column: 3;
		grid-row: 2;
	}
	.dbtn.down {
		grid-column: 2;
		grid-row: 3;
	}

	/* Show D-pad only on touch / coarse pointers; hide on desktop mouse */
	@media (hover: hover) and (pointer: fine) {
		.dpad {
			display: none;
		}
	}
</style>
