<script lang="ts">
	import { gameStore } from '$lib/game/game-state.svelte';

	let suggestion = $state('');

	function submitSuggestion() {
		if (!suggestion.trim()) return;
		gameStore.requestNewSuggestions(suggestion);
		suggestion = '';
	}
</script>

<div class="p-4 bg-gray-50 rounded-lg">
	<label for="suggestion" class="block text-sm font-medium text-gray-700">Suggestion Box for the DM</label>
	<div class="mt-1 flex space-x-2">
		<input
			type="text"
			id="suggestion"
			class="flex-grow block w-full rounded-md border-gray-300 shadow-sm"
			placeholder="e.g., 'More ancient ruins...'"
			bind:value={suggestion}
			onkeydown={(e) => e.key === 'Enter' && submitSuggestion()}
		/>
		<button
			onclick={submitSuggestion}
			class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
		>
			Suggest
		</button>
	</div>
</div>