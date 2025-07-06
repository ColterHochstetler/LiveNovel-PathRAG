<script lang="ts">
	import type { GameState } from '$lib/game/types';

	type InSceneState = Extract<GameState, { stage: 'in_scene' }>;

	let { state }: { state: InSceneState } = $props();
</script>

<div class="p-4 border-2 border-green-500 rounded">
	<h1 class="text-2xl font-bold">In Scene</h1>
	<p class="mt-2">Narrative Messages: {state.scene.narrativeMessages.length}</p>
</div>