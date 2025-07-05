import type { PlayerData, Scene, StoryThread, Story, GameState } from '$lib/game/types';

// This would be populated by API calls
let activeStoryId = $state<string | null>(null);
let player = $state<PlayerData | null>(null);
let currentScene = $state<Scene | null>(null);
let allScenes= $state<Scene[] | null>(null);

// UI-specific state derived from the UI description
let gameState = $state<GameState>({ stage: 'home' });
let selectedVibes = $state<string[]>([]);
let progressStep = $state(0);

// Example of a derived state for UI logic
let canBeginCreatingWorld = $derived(selectedVibes.length > 2);

// We export functions to modify the state, which will be called
// by our components after they get data from the backend.
export function initializeStory(story: Story) {
  activeStoryId = story.id;
  player = story.playerData;
  allScenes = story.scenes

  if (story.currentStage == "in_scene" && allScenes.length > 0) {
    currentScene = allScenes[allScenes.length - 1];
  } else {
    currentScene = null;
  };

}
export function updateGameState(newState: GameState) {
  gameState = newState;
}

export function getCurrentGameState() {
  return gameState;
}

// Export the reactive state itself for components to use
export const gameState = {
  get activeStoryId() { return activeStoryId },
  get player() { return player },
  get currentScene() { return currentScene },
  get currentStage() { return currentStage },
  get selectedVibes() { return selectedVibes },
  get canBeginCreatingWorld() { return canBeginCreatingWorld },
}