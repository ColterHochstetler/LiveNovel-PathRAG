import { createXai } from '@ai-sdk/xai';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
import { GOOGLE_GENERATIVE_AI_API_KEY, OPENROUTER_API_KEY } from '$env/static/private';

import { createOpenRouter } from '@openrouter/ai-sdk-provider';


const lmstudio = createOpenAICompatible({
	name: 'lmstudio',
	baseURL: 'http://localhost:1234/v1',
});

// --- Base Provider Instances ---
const openrouter = createOpenRouter({apiKey: 'OPENROUTER_API_KEY',});
const google = createGoogleGenerativeAI({ apiKey: GOOGLE_GENERATIVE_AI_API_KEY });


// --- Custom Provider Definition ---
export const myProvider = customProvider({
  // Define only the models you want to override or alias.
  languageModels: {
	'open-router': openrouter('openrouter'),
    'gemini-flash': google('gemini-1.5-flash-latest'),
    'gemini-pro': google('gemini-1.5-pro-latest'),
	'local-model': lmstudio('google/gemma-3-12b'),


  },

  fallbackProvider: google
});