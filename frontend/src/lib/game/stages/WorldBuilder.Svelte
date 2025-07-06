<script lang="ts">
	import type { GameState, WorldCreationChoice } from '$lib/game/types';

	// This extracts the specific type for the 'building_world' stage from the GameState union
	type WorldBuilderState = Extract<GameState, { stage: 'building_world' }>;

	// Now, TypeScript knows `state.step`, `state.worldData`, etc. all exist here.
	let { state }: { state: WorldBuilderState } = $props();
</script>

<div class="p-4 border-2 border-blue-500 rounded">
	<h1 class="text-2xl font-bold">Building World...</h1>
	<p class="mt-2">Current Step: <span class="font-mono bg-blue-100 p-1 rounded">{state.step}</span></p>
	<p class="mt-2 text-sm text-gray-600">{state.message}</p>
</div>