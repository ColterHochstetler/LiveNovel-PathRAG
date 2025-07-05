import type { , Scene } from '$lib/game/types';

interface GameState {
  player: PlayerCharacter | null;
  scene: Scene | null;
}

// Load initial state from localStorage if it exists
const savedState = typeof window !== 'undefined' ? localStorage.getItem('gameState') : null;

// Create the global, reactive state object using $state 
export const gameState = $state<GameState>(savedState ? JSON.parse(savedState) : {
  player: null,
  scene: null,
});

// Use an $effect to persist state changes to localStorage 
$effect(() => {
  if (gameState.player || gameState.scene) {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }
});