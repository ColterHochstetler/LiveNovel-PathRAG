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
  expandedWorldDescription: string;
  expandedThemeDescription: string;
  expandedPlotTeaser: string;
  storyThreads: StoryThread[];
  playerData: PlayerData;
  worldGenerationData: WorldGenerationData;
  scenes: Scene[];
  currentWorldTurn: number;
  playerNotesForDm: string;
  vibes: string[];
  latestEventHook: string;
  currentStage: GameState;
}

export type GameState =
  | { stage: 'home' }
  | { stage: 'building_world', step: WorldGenerationStage, message: string, worldData: WorldGenerationData, characterData: CharacterCreationData}
  | { stage: 'scene_preparation', options: StoryOption[] }
  | { stage: 'in_scene', scene: Scene, pendingPlayerAction: PendingAction | null; nextActionSuggestions: string[] }
  | { stage: 'end_scene', summary: string, options: StoryOption[] };

export type StoryOption ={
  title: string;
  summary: string;
}

// Used in world creation, stored permanently only so that the user can resume world creation
export type WorldGenerationData = {
  worldHooks: StoryOption[];
  characterHooks: StoryOption[];
  plotHooks: StoryOption[];
  firstSceneHooks: StoryOption[];
  selectedVibes: string[];
  selectedWorldSummary: StoryOption | null;
  selecetedCharacterSummary: StoryOption | null;
  selectedPlotHook: StoryOption | null;
  selectedFirstSceneHook: StoryOption | null;
}

export type CharacterCreationData = {
  liveStats: Record<string,number>
  availablePoints: number;
  spentPoints: number;
  baseStats: Record<string, number>;
  suggestedName: string;
  suggestedSpecies: string;
}

export type WorldGenerationStage = 
  'vibe_selection' | 
  'choose_next_hook_screen' |
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

// An object representing the selection of a story hook
export type WorldHookChoicePayload = {
  type: 'world_hook_selection';
  payload: StoryOption; // The selected hook
};

// An object representing the submission of the three key summaries
export type SummariesApprovalPayload = {
  type: 'summaries_approval';
  payload: {
    world: string;
    story: string;
    character: string;
  };
};

// An object representing the submission of final character details
export type CharacterDetailsPayload = {
  type: 'character_details_submission';
  payload: {
    // Only include fields the player can actually edit on this screen
    name: string;
    species: string;
    age: number;
    gender: string;
    traits: string[];
    // The point-buy stats are managed by the server, but we send the final stats up
    stats: Record<string, number>;
  };
};

// An object representing the selection of the first scene hook
export type FirstSceneHookPayload = {
    type: 'first_scene_hook_selection';
    payload: StoryOption;
}

// The Discriminating Union: A WorldCreationChoice can be any of the above
export type WorldCreationChoice =
  | WorldHookChoicePayload
  | SummariesApprovalPayload
  | CharacterDetailsPayload
  | FirstSceneHookPayload;