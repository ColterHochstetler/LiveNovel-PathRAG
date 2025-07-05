

### **Agent Architecture for Narrative TTRPG Prototype**

This document outlines the various "atomic agents" (specialized prompts with their own context and schemas) required to power the narrative chat game. They are grouped by their function within the game's lifecycle: **Campaign Initialization**, the **Scene Turn** (the real-time gameplay loop), and the **World Turn** (the between-scene evolution of the game state).


### **Phase 1: Campaign Initialization Agents**

These agents are used once at the beginning of a new campaign to establish the foundational lore and player character, which is then stored in the PathRAG database.



1. **Story Hooks Agent**
    * **Role:** Engages the player in a dialogue to understand their narrative preferences.
    * **Process:** Asks the player a series of questions about desired themes, challenges, allies, and antagonists based on their initial inspirations.
    * **Output:** A structured summary of the player's preferences (campaignPlan).
2. **World Generation Agents (Thematic & Factual)**
    * **Role:** A series of chained agents that build the core components of the game world based on the campaignPlan.
    * **Sub-Agents:**
        * **Theme Agent:** Proposes and refines a list of 5 core narrative themes.
        * **Magic System Agent:** Determines the logical impacts of the world's magic system on society and the environment.
        * **Faction Agent:** Creates 5 distinct factions with motives, philosophies, and cultural notes.
        * **Major NPC Agent:** Populates each faction with 3 key characters (leader and others) with their own goals and fears.
    * **Output:** Structured data about the world's themes, magic, factions, and major NPCs to be ingested by PathRAG.
3. **Character Creation Agent**
    * **Role:** Guides the player through creating their character.
    * **Process:** Asks a series of questions to define the character's history, personality, and appearance.
    * **Output:** A detailed character sheet (characterDetails).
4. **Player Origin Agent**
    * **Role:** Connects the newly created player character to the established world.
    * **Process:** Reviews the characterDetails and factions to propose three potential origin stories for the player to choose from.
    * **Output:** The selected player origin story, which is added to the PathRAG database.
5. **Opening Scene Agent**
    * **Role:** Designs the initial scene of the game.
    * **Process:** Uses the campaign themes, plot hooks, and player origin to generate a compelling opening scenario.
    * **Output:** A structured scene plan (scenePlan) and the first descriptive post of the game.


### **Phase 2: The Scene Turn (Intra-Scene Loop)**

This is the core, real-time loop that runs continuously during a scene. These agents work in sequence and parallel to generate the DM's response to player actions.



1. **Player Input Appropriateness Agent**
    * **Role:** The first gatekeeper for player input.
    * **Process:** Checks if the player's described action is thematically appropriate for the world.
    * **Output:** A pass/fail flag. If it fails, it suggests alternatives to the player.
2. **Player Input Permissibility Agent**
    * **Role:** The second gatekeeper, focused on character abilities.
    * **Process:** Checks if the player's character can realistically perform the described action.
    * **Output:** A pass/fail flag with an explanation and an override option.
3. **Action Difficulty Agent**
    * **Role:** Determines the challenge of a permissible action.
    * **Process:** Evaluates the action and assigns a difficulty (easy, medium, hard, nearly impossible).
    * **Output:** The difficulty level and the ability to be tested, triggering a "skill check" prompt to the player if necessary.
4. **Scene Planning Agent**
    * **Role:** (Runs in parallel with NPC agent) Plans the DM's next move based on the current scene and player action.
    * **Process:** Takes the current scenePlan and player's confirmed action to outline the immediate consequences and next narrative beats.
    * **Output:** A short-term plan for the DM-Voice Agent.
5. **NPC Emotion/Action Agent**
    * **Role:** (Runs in parallel with Scene Planning agent) Determines the reactions of non-player characters in the scene.
    * **Process:** Considers the player's action, the NPCs' personalities, and their relationship to the player to decide how they feel and if they will speak or act.
    * **Output:** A list of NPC actions and potential dialogue lines.
6. **DM-Voice Agent**
    * **Role:** The primary narrative voice of the game.
    * **Process:** Synthesizes the outputs from the Scene Planning and NPC agents, along with context from PathRAG, to generate the final narrative response to the player.
    * **Output:** The DM's descriptive text and dialogue.
7. **Punch-Up Agent (Optional)**
    * **Role:** A final quality-control step.
    * **Process:** Reviews the output from the DM-Voice Agent and attempts to rewrite it for stronger impact, better pacing, or more evocative language.
    * **Output:** The final, polished post that is sent to the player.


### **Phase 3: The World Turn (Inter-Scene Loop)**

These agents run *between* scenes. They process the events of the completed scene, update the world state, and prepare the next scene to "jump to the good stuff."



1. **Conversational Summary Agent**
    * **Role:** Manages the short-term memory of the scene that just concluded.
    * **Process:** Creates a detailed summary of the conversation and key events.
    * **Output:** A text summary that is stored and used as context for future turns.
2. **World Revision Agent**
    * **Role:** The "living world" engine that incorporates player actions into the game's canon.
    * **Process:** Analyzes the scene summary to identify new "facts" introduced by the player (e.g., caving in the ceiling of the tournament hall). If they pass an appropriateness check, it updates the PathRAG database with this new information and its consequences.
    * **Output:** Updates to the PathRAG knowledge graph (e.g., the tournament is rescheduled, the location is now "ruined").
3. **Next Scene Planning Agent**
    * **Role:** Determines the next logical scene to advance the story.
    * **Process:** Reviews the updated world state, unresolved plot hooks, and character motivations to propose and design the next compelling scenario.
    * **Output:** A new scenePlan for the upcoming scene.
4. **Scene Transition Handler Agent**
    * **Role:** Manages the "downtime" between scenes.
    * **Process:** Based on the end of the last scene and a teaser for the next, it generates 3 meaningful "preparation" or "downtime" actions for the player (e.g., "Rest and recover," "Go shopping for a new shotgun," "Scout the upcoming location"). The player can select 1 or 2.
    * **Output:** A short narrative snippet describing the outcome of the player's choices, leading into the start of the next scene.


### **Core Utility Agents**

These are foundational services used by agents across multiple phases.



1. **RAG Context Agent (Implicit)**
    * **Role:** Retrieves relevant information from the PathRAG database.
    * **Process:** This will be implemented as a "Context Provider" within Atomic Agents. It takes keywords or concepts from the current game state and fetches relevant lore, character details, or location descriptions.
    * **Output:** Contextual information provided to other agents.