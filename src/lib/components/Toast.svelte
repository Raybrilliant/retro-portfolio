<script lang="ts">
	let { message }: { message: string } = $props();
</script>

<div class="toast anim-rise">
	<div class="toast-title">
		<span>Achievement</span>
	</div>
	<div class="toast-body">{message}</div>
</div>

<style>
	.toast {
		width: 240px;
		background: var(--face);
		border-top: 2px solid #fff;
		border-left: 2px solid #fff;
		border-right: 2px solid #404040;
		border-bottom: 2px solid #404040;
		box-shadow: inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf, 3px 3px 8px rgba(0, 0, 0, 0.3);
		font-family: var(--win-font);
	}
	.toast-title {
		background: linear-gradient(90deg, #000080, #1084d0);
		color: #fff;
		font-size: 11px;
		font-weight: 700;
		padding: 2px 6px;
	}
	.toast-body {
		padding: 8px 10px;
		font-size: 12px;
		color: #000;
		line-height: 1.4;
	}
</style>
