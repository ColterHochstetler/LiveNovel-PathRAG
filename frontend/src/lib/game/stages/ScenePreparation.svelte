<script lang="ts">
	import type { GameState } from '$lib/game/types';

	type ScenePreparation = Extract<GameState, { stage: 'scene_preparation' }>;

	let { state }: { state: ScenePreparation } = $props();
</script>

<div class="p-4 border-2 border-green-500 rounded">
	<h1 class="text-2xl font-bold">In Scene</h1>
</div>