<script lang="ts">
	import winLogo from '$lib/assets/win98-logo.svg';

	let { onDone }: { onDone: () => void } = $props();

	let progress = $state(0);

	$effect(() => {
		progress = 0;
		const t = setInterval(() => {
			progress = Math.min(100, progress + 3 + Math.random() * 5);
			if (progress >= 100) {
				clearInterval(t);
				setTimeout(onDone, 700);
			}
		}, 110);
		return () => clearInterval(t);
	});
</script>

<div class="shutdown">
	<div class="sd-card">
		<img class="boot-logo" src={winLogo} alt="Windows 98 logo" width="64" height="55" />
		<h1>Please wait…</h1>
		<p>Raybrilliant OS is shutting down.</p>
		<div class="sd-bar-wrap">
			<div class="sd-bar" style="width:{progress}%"></div>
		</div>
		<p class="sd-foot">It is now safe to turn off your computer… eventually.</p>
	</div>
</div>

<style>
	.shutdown {
		position: fixed;
		inset: 0;
		z-index: 100001;
		background: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--win-font);
	}
	.sd-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		color: #fff;
		text-align: center;
	}
	.flag {
		image-rendering: pixelated;
	}
	.boot-logo {
		display: block;
		filter: drop-shadow(2px 2px 0 rgba(255, 255, 255, 0.15));
	}
	.sd-card h1 {
		font-size: 24px;
		font-weight: 800;
		margin: 4px 0 0;
	}
	.sd-card p {
		font-size: 13px;
		color: #c8d8ff;
		margin: 0;
	}
	.sd-bar-wrap {
		margin-top: 10px;
		width: 220px;
		height: 14px;
		background: #000;
		border: 1px solid #c0c0c0;
		padding: 2px;
	}
	.sd-bar {
		height: 100%;
		background: linear-gradient(90deg, #d63027, #f5c518);
		transition: width 0.1s linear;
	}
	.sd-foot {
		margin-top: 14px !important;
		font-size: 11px;
		color: #8a9ac0;
	}
</style>
