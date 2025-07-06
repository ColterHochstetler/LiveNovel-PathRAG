import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
// Import the types we need to construct our state object
import type { GameState, WorldGenerationStage } from '$lib/game/types';

// Extract the specific state type we are creating for better type safety
type BuildingWorldState = Extract<GameState, { stage: 'building_world' }>;

export const load: PageServerLoad = async ({ params }) => {
	const { storyId } = params;

	// By explicitly typing the object here, we tell TypeScript to check
	// that it has the right shape and that it is mutable.
	const mockGameState: BuildingWorldState = {
		stage: 'building_world',
		step: 'vibe_selection',
		message: "Welcome! Let's create your world.",
		worldData: {
			selectedVibes: [],
			worldHooks: [],
			characterHooks: [],
			plotHooks: [],
			firstSceneHooks: [],
			selectedWorldSummary: null,
			selecetedCharacterSummary: null, // Note: Typo in original types.ts, should be "selected"
			selectedPlotHook: null,
			selectedFirstSceneHook: null,
		},
		characterData: {
			liveStats: {},
			availablePoints: 10,
			spentPoints: 0,
			baseStats: {},
			suggestedName: 'Aethel',
			suggestedSpecies: 'Human',
		}
	};

	return {
		storyId: storyId,
		initialGameState: mockGameState
	};
};