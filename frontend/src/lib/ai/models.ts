export const DEFAULT_CHAT_MODEL: string = 'gemini-1.5-flash-latest';

import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Create an instance of the Google Generative AI provider
export const google = createGoogleGenerativeAI({});

// You can keep your UI definitions if you want, or manage them elsewhere.
// This part is for the model selector in the UI.
export const chatModels = [
	{
		id: 'gemini-flash',
		name: 'Gemini 1.5 Flash',
		description: 'Fast and versatile model for chat.'
	},
	{
	 	id: 'gemini-pro',
		name: 'Gemini 1.5 Pro',
		description: 'Most capable model for complex reasoning.'
	}
];