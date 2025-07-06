<script lang="ts">
	import Game from '$lib/game/Game.svelte';
	import { gameStore } from '$lib/game/game-state.svelte';
	import { onDestroy } from 'svelte';

	let { data } = $props();

	// Initialize our reactive store when the component loads
	gameStore.initialize(data.initialGameState, data.storyId);

	// Disconnect when we leave the page to clean up the SSE connection
	onDestroy(() => {
		gameStore.disconnect();
	});
</script>

<svelte:head>
	<title>Live Novel</title>
</svelte:head>

<main class="container mx-auto p-4">
	<Game />
</main>