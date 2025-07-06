export interface ItemData {
  id: string;
  name: string;
  quantity: number;
  description: string;
  statsModified: Record<string, number>;
}

export interface PlayerData {
  id: string;
  name: string;
  description: string;
  stats: Record<string, number>;
  inventory: ItemData[];
  level: number;
}

export interface Story{
  id: string;
  worldDescription: string;
  themeDescription: string;
  storyThreads: StoryThread[];
  playerData: PlayerData;
  scenes: Scene[];
  currentWorldTurn: number;
  playerNotesForDm: string;
  vibes: string[];
  latestEventHook: string;
  currentStage: GameState;
}

export type GameState =
  | { stage: 'home' }
  | { stage: 'building_world', step: WorldGenerationStage, message: string }
  | { stage: 'scene_preparation', options: string[] }
  | { stage: 'in_scene', scene: Scene, pendingPlayerAction: PendingAction | null; }
  | { stage: 'end_scene', summary: string };

export type WorldGenerationStage = 
  'vibe_selection' | 
  'world_hook_generation' | 
  'world_hook_selection' | 
  'character_hook_creation' | 
  'character_hook_selection' | 
  'plot_hook_generation' | 
  'plot_hook_selection' | 
  'theme_creation' | 
  'major_conflict_possibilites_creation' | 
  'faction_creation' | 
  'major_npc_creation' | 
  'world_pathRAG_ingestion' |
  'first_scene_hook_creation' | 
  'first_scene_hook_selection' | 
  'first_scene_generation';

export interface StoryThread{
  name: string;
  state: "active" | "discontinued" | "resolved";
  description: string;
  relevantNarrativeMessages: GameMessage[]
}

export interface Scene{
  id: string;
  scenePlan: string;
  narrativeMessages: GameMessage[]
  rollingMessageSummaries: RollingMessagesSummary[];
  sceneConclusion: string;
}

export interface RollingMessagesSummary{
  SummarizedMessageIds: string[]
  summary: string;
}

export interface GameMessage {
  id: string;
  sender: 'player' | 'dm' | 'game';
  content: string; 
  timestamp: string;
}

export type EvaluationResult =
  | { type: 'inappropriate'; message: string }
  | { type: 'impermissible'; message: string }
  | { type: 'skill_check'; message: string; skill: string; difficulty: number}
  | { type: 'success'; };

/**
 * Represents the player's action while it is being evaluated by the backend.
 * This is the state that drives the `InteractionBox` component.
 */
export interface PendingAction {
  content: string; // The original text of the player's action.
  status: 'evaluating' | 'needs_input' | 'success';
  results: EvaluationResult[]; 
}
