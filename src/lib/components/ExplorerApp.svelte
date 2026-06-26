<script lang="ts">
	import ExplorerShell from './explorer/ExplorerShell.svelte';
	import WorkGrid from './WorkGrid.svelte';
	import ProjectsGrid from './ProjectsGrid.svelte';
	import CertificatesGrid from './CertificatesGrid.svelte';

	type Section = 'work' | 'projects' | 'certificates';

	let {
		section,
		onSectionChange = () => {}
	}: { section: Section; onSectionChange?: (section: Section) => void } = $props();

	const address = $derived(
		section === 'work'
			? 'C:\\Rey\\Work'
			: section === 'projects'
				? 'C:\\Rey\\Projects'
				: 'C:\\Rey\\Certificates'
	);
</script>

<ExplorerShell {address} activeSection={section} {onSectionChange}>
	{#if section === 'work'}
		<WorkGrid />
	{:else if section === 'projects'}
		<ProjectsGrid />
	{:else}
		<CertificatesGrid />
	{/if}
</ExplorerShell>
