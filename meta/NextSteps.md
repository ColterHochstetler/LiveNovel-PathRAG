Here are the detailed notes on our plan for the next development session. This markdown file captures our goal, the current context of our technical decisions, and a concrete plan for building the first "vertical slice" of the game creation feature.

-----

# Next Steps: Game Creation Vertical Slice

## 🎯 Goal

The immediate goal is to implement a complete, end-to-end "vertical slice" of the game creation flow. This means creating a minimal user interface that can successfully communicate with a new backend API endpoint to create a game session and transition the application to the first step of the world-building process.

This will prove that our core architecture—from frontend state management to backend API handling—is working correctly before we invest time in building out the full, polished UI.

-----

## kontekst

This plan is based on the following architectural decisions we've already made:

1.  **Top-Level Session ID**: The `storyId` is treated as a high-level session identifier, managed by a `$state` rune (`currentstoryId`) in `game-state.svelte.ts`. It is kept separate from the `gameState` object itself, which represents the content *within* the session. [cite\_start]This provides a clean separation of concerns[cite: 5].
2.  **Unified `advanceWorldCreation` Action**: Instead of creating unique API payloads for each step of the world-building process, we will use a single, unified function called `advanceWorldCreation`. [cite\_start]This function sends the entire `WorldGenerationData` object to the backend, which is responsible for processing it and advancing the game to the next state[cite: 5].
3.  **Direct State Interaction**: Frontend components will interact directly with the `WorldGenerationData` object passed down as props. For instant UI feedback on temporary selections (like a highlighted tile), components will use their own local `$state` variables. [cite\_start]This simplifies state management and leverages Svelte's reactivity efficiently[cite: 5].
4.  **Ephemeral "Suggestion Box"**: The "brainstorm with the DM" feature will be treated as a one-way suggestion box, not a two-way chat. The UI will call a dedicated `requestNewSuggestions` function, and the backend will respond by pushing a new `GameState` with regenerated options. [cite\_start]No chat history will be stored[cite: 5].

-----

## 📝 Plan: The Vertical Slice

We will connect a minimal frontend UI to a new backend endpoint. This will validate our core loop: **UI -\> `gameStore` -\> API -\> `gameStore` -\> UI**.

### Part 1: Backend (`/api/game` Endpoint)

The first step is to create the API that our frontend will call.

**File to Create:** `src/routes/api/game/+server.ts`

**Tasks:**

1.  **Create the `POST` Handler:**

      * This handler will receive a JSON body containing an array of `vibes` (e.g., `{ "vibes": ["cyberpunk", "noir", "rainy"] }`).
      * It should be typed using `RequestHandler` from `./$types`.

2.  **Implement Game Creation Logic:**

      * **Generate a unique `storyId`:** Use `crypto.randomUUID()` for this.
      * **Create the `initialGameState`:**
          * The state should be `{ stage: 'building_world', step: 'world_hook_generation', ... }`.
          * The `worldData` object within this state needs to be populated. For now, we can use **mock data**. Call a placeholder function like `generateMockHooks(vibes)` that returns a hardcoded array of `StoryOption` objects for the `worldHooks` property.
      * **Persist the game:** For the prototype, we can store the new game object in a simple, server-side `Map` or `object` keyed by the `storyId`.

3.  **Construct the Response:**

      * The handler must return a JSON response with the following structure, as we previously decided:
        ```json
        {
          "storyId": "...",
          "initialGameState": { ... }
        }
        ```
      * Use the `json` helper from `@sveltejs/kit` to create the `Response` object.

### Part 2: Frontend (`VibeSelection.svelte`)

Next, we'll build a minimal UI to interact with this new endpoint.

**File to Edit:** `src/lib/components/stages/world-builder/VibeSelection.svelte`

**Tasks:**

1.  **Create a Simple Input Form:**

      * Add a standard text `<input>` for the user to type a single vibe.
      * Add a `<button>` labeled "Begin Creating World".

2.  **Manage Local State:**

      * Use a local `$state` variable to bind to the text input's value (`let vibe = $state('');`).

3.  **Connect to the `gameStore`:**

      * On button click, call the `gameStore.createNewGame()` function.
      * Pass the vibe from the input, wrapped in an array (e.g., `gameStore.createNewGame([vibe])`).
      * For now, we'll just send one vibe. We can expand this to a list later.

### Verification of Success

This task is complete when we can:

1.  Run the application.
2.  See the initial `VibeSelection.svelte` component.
3.  Type a word into the input field.
4.  Click the "Begin Creating World" button.
5.  Observe the UI automatically transition to the `WorldHookSelection` component, displaying the message for the `world_hook_generation` step and the mock data we returned from our new API.