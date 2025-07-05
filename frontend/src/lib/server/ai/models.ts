import { createXai } from '@ai-sdk/xai';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
import { XAI_API_KEY, GROQ_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY } from '$env/static/private';

// --- Base Provider Instances ---
const google = createGoogleGenerativeAI({ apiKey: GOOGLE_GENERATIVE_AI_API_KEY });
const xai = createXai({ apiKey: XAI_API_KEY });
const groq = createGroq({ apiKey: GROQ_API_KEY });

// --- Custom Provider Definition ---
export const myProvider = customProvider({
  // Define only the models you want to override or alias.
  languageModels: {
    'gemini-flash': google('models/gemini-1.5-flash-latest'),
    'gemini-pro': google('models/gemini-1.5-pro-latest'),

    // This is a special case with middleware, so we define it explicitly.
    'chat-model-reasoning': wrapLanguageModel({
        model: groq('deepseek-r1-distill-llama-70b'),
        middleware: extractReasoningMiddleware({ tagName: 'think' })
    }),
  },
  // Use the xai provider as the default for any model not listed above.
  fallbackProvider: xai
});