<script lang="ts">
	import { gameState } from '$lib/game/state.svelte';
	import type { PlayerCharacter } from '$lib/game/types';

	function loadMockPlayer() {
		gameState.player = {
			name: 'Svelty',
			description: 'A brave developer.',
			stats: { Vigor: 14 }
		};
	}
</script>

<h1>State Test</h1>

{#if gameState.player}
	<p>Player: {gameState.player.name}</p>
	<p>Vigor: {gameState.player.stats.Vigor}</p>
{:else}
	<p>No player loaded.</p>
{/if}

<button onclick={loadMockPlayer}>Load Mock Player</button>
<button onclick={() => gameState.player = null}>Clear Player</button>

<hr />
<p>Refresh the page. The state should persist.</p>