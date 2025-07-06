<script lang="ts">
	import type { GameState } from '$lib/game/types';

	// Import placeholder components we'll create next
	import ProgressIndicator from './world-builder/ProgressIndicator.svelte';
	import SuggestionBox from './world-builder/SuggestionBox.svelte';

	// Import step-specific components
	import VibeSelection from './world-builder/VibeSelection.svelte';
	import WorldHookSelection from './world-builder/WorldHookSelection.svelte';
	// ... import other step components as we build them

	type WorldBuilderState = Extract<GameState, { stage: 'building_world' }>;
	let { state }: { state: WorldBuilderState } = $props();

	// Use derived runes for cleaner access in the template
	const step = $derived(state.step);
	const worldData = $derived(state.worldData);
	const characterData = $derived(state.characterData);
</script>

<div class="space-y-6">
	<ProgressIndicator currentStep={step} />

	<div class="p-6 bg-white rounded-lg shadow-md">
		<h2 class="text-xl font-semibold text-gray-700">{state.message}</h2>

		<div class="mt-4">
			{#if step === 'vibe_selection'}
				<VibeSelection {worldData} />
			{:else if step === 'world_hook_generation' || step === 'world_hook_selection'}
				<WorldHookSelection {worldData} />
			{:else}
			{/if}
		</div>
	</div>

	<SuggestionBox />
</div>