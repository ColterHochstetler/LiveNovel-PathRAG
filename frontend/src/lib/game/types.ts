// src/lib/game.ts

/** The player's character sheet. */
export interface PlayerCharacter {
  name: string;
  description: string;
  stats: Record<string, number>; // Simple for now, e.g., { Vigor: 12, Guile: 14 }
}

/** Represents the state of a single game scene. */
export interface Scene {
  id: string;
  description: string; // The DM's description of the scene
  messages: GameMessage[]; // A history of all messages in the scene
}

// --- THIS IS THE MOST IMPORTANT TYPE ---
// A discriminated union for all possible message types.
// This allows our UI to be declarative and type-safe.

export type GameMessage =
  | {
      type: 'NARRATIVE';
      id: string;
      source: 'DM';
      content: string; // The DM's narration
    }
  | {
      type: 'PLAYER_ACTION';
      id: string;
      source: 'PLAYER';
      content: string; // What the player said or did
    }
  | {
      type: 'DICE_ROLL_PROMPT';
      id: string;
      source: 'DM';
      content: string; // e.g., "Roll to persuade the guard."
      stat: 'Vigor' | 'Guile' | 'Wits'; // The stat to roll against
      targetNumber: number;
    }
  | {
      type: 'SYSTEM_WARNING';
      id: string;
      source: 'SYSTEM';
      content: string; // e.g., "You can't do that right now."
    };