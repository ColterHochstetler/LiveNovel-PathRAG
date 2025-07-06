<script lang="ts">
	import { gameStore } from '$lib/game/game-state.svelte';
	import type { WorldGenerationData } from '$lib/game/types';

	// Accept worldData as a regular prop.
	let { worldData } = $props<{ worldData: WorldGenerationData }>();

	// Use a local $state rune for the input field's value.
	let newVibe = $state('');

	function addVibe() {
		const vibeToAdd = newVibe.trim();
		if (vibeToAdd && !worldData.selectedVibes.includes(vibeToAdd)) {
			// This is the key: we can mutate the prop directly.
			// Because it's a reactive proxy, the UI will update instantly.
			worldData.selectedVibes.push(vibeToAdd);
		}
		newVibe = ''; // Clear the input
	}

	function removeVibe(vibe: string) {
		worldData.selectedVibes = worldData.selectedVibes.filter((v: string) => v !== vibe);
	}

	function beginCreation() {
		// When the user is done, we send the mutated object
		// to the gameStore to advance the state.
		gameStore.advanceWorldCreation(worldData);
	}

	const canProceed = $derived(worldData.selectedVibes.length > 0);
</script>

<div class="space-y-4">
	<div class="flex space-x-2">
		<input
			type="text"
			class="flex-grow block w-full rounded-md border-gray-300 shadow-sm"
			placeholder="Type a vibe, e.g., 'ancient mystery'"
			bind:value={newVibe}
			onkeydown={(e) => e.key === 'Enter' && addVibe()}
		/>
		<button onclick={addVibe} class="px-4 py-2 border rounded-md"> Add </button>
	</div>

	{#if worldData.selectedVibes.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each worldData.selectedVibes as vibe (vibe)}
				<span class="flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
					{vibe}
					<button onclick={() => removeVibe(vibe)} class="ml-2 text-indigo-500 hover:text-indigo-700">
						&times;
					</button>
				</span>
			{/each}
		</div>
	{/if}

	<div class="text-center pt-4">
		<button
			onclick={beginCreation}
			disabled={!canProceed}
			class="px-6 py-2 font-semibold rounded-md text-white transition-colors"
			class:bg-green-600={canProceed}
			class:hover:bg-green-700={canProceed}
			class:bg-gray-400={!canProceed}
			class:cursor-not-allowed={!canProceed}
		>
			Begin Creating World
		</button>
	</div>
</div>