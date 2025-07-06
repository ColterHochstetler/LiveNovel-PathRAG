<script lang="ts">
	import type { GameState } from '$lib/game/types';

	type InSceneState = Extract<GameState, { stage: 'end_scene' }>;

	let { state }: { state: InSceneState } = $props();
</script>

<div class="p-4 border-2 border-green-500 rounded">
	<h1 class="text-2xl font-bold">End Scene</h1>
</div>