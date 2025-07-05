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
  | { stage: 'in_scene', scene: Scene }
  | { stage: 'end_scene', summary: string };

export type WorldGenerationStage = 'vibe_selection' | 'world_hook_generation' | 'world_hook_selection' | 'character_hook_creation' | 'character_hook_selection' | 'plot_hook_generation' | 'plot_hook_selection' | 'theme_creation' | 'major_conflict_possibilites_creation' | 'faction_creation' | 'major_npc_creation' | 'first_scene_hook_creation' | 'first_scene_hook_selection' | 'first_scene_generation'

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