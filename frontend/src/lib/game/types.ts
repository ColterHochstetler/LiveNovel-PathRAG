export interface PlayerData{
  id: string;
  name: string;
  description: string;
  stats: {statName: string, statValue: number};
  inventory: ItemData[]
  level: number
}

export interface ItemData{
  id: string;
  name: string;
  quantity: number;
  description: string;
  statsModified: {statName: string, modifier: number};
}

export interface Story{
  worldDescription: string[];
  themeDescription: string;
  playerData: PlayerData;
  scenes: Scene[];
  currentWorldTurn: number;
  playerNotesForDm: string;
}

export interface Scene{
  id: string;
  scenePlan: String;
  narrativeMessages: GameMessage[]
  rollingSummaries: rollingSummary[];
  sceneConclusion: string;
}

export interface rollingSummary{
  SummarizedMessageIds: string[]
  summary: string;
}



export type GameMessage =
	| {
			type: 'narrative';
			text: string;
	  }
	| {
			type: 'dice_roll_prompt';
			prompt: string;
			sides: number;
			bonus: number;
	  }
	| {
			type: 'proceed_warning';
			message: string;
	  };
