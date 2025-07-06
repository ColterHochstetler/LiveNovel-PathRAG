<script lang="ts">
	import { gameStore } from '$lib/game/game-state.svelte';

	// Stage Components
	// We'll create these as placeholders in the next step.
	import WorldBuilder from './stages/WorldBuilder.svelte';
	import InScene from './stages/InScene.svelte';
	//import EndScene from './stages/EndScene.svelte';
	//import ScenePreparation from './stages/ScenePreparation.svelte';

	// It's cleaner to get a reference to the whole state object.
	// We can then pass the correct slice of it to each child component.
	const gameState = $derived(gameStore.state);
</script>

{#if gameState.stage === 'building_world'}
	<WorldBuilder state={gameState} />
{:else if gameState.stage === 'in_scene'}
	<InScene state={gameState} />
<!-- {:else if gameState.stage === 'end_scene'}
	<EndScene state={gameState} />
{:else if gameState.stage === 'scene_preparation'}
	<ScenePreparation state={gameState} /> -->
{:else}
	<p>Error: Unknown game stage.</p>
{/if}