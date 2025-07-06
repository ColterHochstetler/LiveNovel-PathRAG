<script lang="ts">
	import type { WorldGenerationStage } from '$lib/game/types';

	let { currentStep }: { currentStep: WorldGenerationStage } = $props();

	// This defines the order of our steps
	const allSteps: WorldGenerationStage[] = [
		'vibe_selection',
		'world_hook_generation',
		'world_hook_selection',
		'character_hook_creation',
		// ... add all other stages in order
		'first_scene_generation'
	];

	const currentIndex = $derived(allSteps.indexOf(currentStep));
</script>

<div>
	<p class="text-sm font-medium text-gray-600">Progress:</p>
	<div class="flex items-center space-x-2 mt-1">
		{#each allSteps as step, i}
			<div
				class="w-4 h-4 rounded-full transition-colors"
				class:bg-green-500={i <= currentIndex}
				class:bg-gray-300={i > currentIndex}
				title={step.replace(/_/g, ' ')}
			></div>
		{/each}
	</div>
</div>