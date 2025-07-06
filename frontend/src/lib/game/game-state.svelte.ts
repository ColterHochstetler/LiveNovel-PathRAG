/**
 * Svelty-Pro Game State Management (v2)
 *
 * This file is the reactive heart of our application. It uses Svelte 5 runes
 * to manage a central state object and handles all real-time communication
 * with the backend via Server-Sent Events (SSE).
 */

import { browser } from '$app/environment';
import type { GameState, WorldCreationChoice } from '$lib/game/types';

// --- Core Reactive State ---

let gameState = $state<GameState>({ stage: 'home' });
let connectionStatus = $state<'connecting' | 'open' | 'closed' | 'error'>('closed');
let currentGameId = $state<string | null>(null);

let sse_connection: EventSource | null = null;

// --- Private SSE Handlers ---

function handle_state_update(event: MessageEvent) {
	try {
		const newState: GameState = JSON.parse(event.data);
		gameState = newState;
	} catch (e) {
		console.error('Failed to parse state update:', e);
	}
}

function handle_dm_chunk(event: MessageEvent) {
	if (gameState.stage !== 'in_scene') return;
	try {
		const chunk: { messageId: string; content: string } = JSON.parse(event.data);
		if (!chunk.messageId || !chunk.content) return;

		const message_to_update = gameState.scene.narrativeMessages.find((m) => m.id === chunk.messageId);
		if (message_to_update) {
			message_to_update.content += chunk.content;
		}
	} catch (e) {
		console.error('Failed to parse DM chunk:', e);
	}
}

// --- Public API ---


/**
 * Starts a new game world creation process based on initial vibes.
 * @param vibes An array of strings describing the desired feel.
 */
async function createNewGame(vibes: string[]) {
	// This will hit a new endpoint, e.g., POST /api/game
	const response = await fetch(`/api/game`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ vibes })
	});

	// After this, we expect the server to create the game,
	// and send us back the new game ID to initialize our connection.
	const { gameId } = await response.json();
	
	// We'll need the initial state data from the server response too
	// so we can initialize the store without waiting for the first SSE event.
	// Let's assume the API returns the full initial GameState.
	const initialData = await (await fetch(`/api/game/${gameId}`)).json();

	// Now we can initialize our reactive store and SSE connection
	initialize(initialData, gameId);
}

/**
 * Sends a player's choice during world generation to the backend.
 * @param choiceType The type of choice being made (e.g., 'world_hook', 'character_summary').
 * @param value The selected value.
 */
async function makeWorldCreationChoice(choice: WorldCreationChoice) {
	const gameId = currentGameId;
	if (!gameId) {
		console.error('Cannot make choice: gameId is not set.');
		return;
	}

	// The entire 'choice' object, with its type and payload, is sent.
	// This makes the backend endpoint much easier to parse and validate.
	await fetch(`/api/game/${gameId}/world-creation-choice`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(choice)
	});
}

/**
 * Initializes the game state from a server `load` function and establishes the SSE connection.
 * @param initialData The full GameState object from the initial page load.
 * @param gameId The unique ID of the game session.
 */
function initialize(initialData: GameState, gameId: string) {
	gameState = initialData;
	currentGameId = gameId;

	if (!browser) return;
	if (sse_connection) sse_connection.close();

	connectionStatus = 'connecting';
	const sse = new EventSource(`/api/game/${gameId}/events`);
	sse_connection = sse;

	sse.onopen = () => connectionStatus = 'open';
	sse.onerror = () => {
		connectionStatus = 'error';
		sse.close();
	};

	sse.addEventListener('state_update', handle_state_update);
	sse.addEventListener('dm_chunk', handle_dm_chunk);
}

/**
 * Disconnects from the game's event stream.
 */
function disconnect() {
	if (sse_connection) {
		sse_connection.close();
		sse_connection = null;
	}
	connectionStatus = 'closed';
	currentGameId = null;
}

/**
 * Sends a player's action to the backend.
 * @param content The text content of the player's action.
 */
async function performPlayerAction(content: string) {
	const gameId = currentGameId;
	if (!gameId) {
		console.error('Cannot perform action: gameId is not set.');
		return;
	}

	await fetch(`/api/game/${gameId}/action`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ content })
	});
}

/**
 * The exported "store" object that our Svelte components will interact with.
 */
export const gameStore = {
	get state(): Readonly<GameState> {
		return gameState;
	},
	get connectionStatus() {
		return connectionStatus;
	},
	initialize,
	disconnect,
	performPlayerAction,
  createNewGame,
	makeWorldCreationChoice
};