// frontend/src/lib/types/game.ts

/**
 * Represents the player's character.
 * This is the data that will populate the right-hand panel of the UI.
 */
export interface PlayerCharacter {
  name: string;
  description: string;
  stats: Record<string, number>;
}

/**
 * Represents a single message in the chat history.
 * We've designed this to be flexible to handle the different reply types you mentioned.
 */
export interface GameMessage {
  id: string; // A unique ID for each message
  role: 'dm' | 'player' | 'system';
  
  // This is the core content of the message.
  content: {
    type: 'narrative' | 'dice_roll' | 'warning' | 'prompt';
    text: string;
    // Optional data for specific message types
    data?: {
      difficulty?: 'easy' | 'medium' | 'hard';
      reason?: string;
      roll?: { needed: number; rolled: number; success: boolean };
    };
  };
}

/**
 * Represents the entire state of the current gameplay scene.
 */
export interface Scene {
  id: string;
  description: string;
  history: GameMessage[];
}