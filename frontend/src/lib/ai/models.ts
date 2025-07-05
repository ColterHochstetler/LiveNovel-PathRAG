export const DEFAULT_CHAT_MODEL: string = 'gemini-flash';

interface ChatModel {
	id: string;
	name: string;
	description: string;
}

export const chatModels: Array<ChatModel> = [
	{
		id: 'gemini-flash',
		name: 'Gemini Flash',
		description: 'Fast and versatile model from Google.'
	},
	{
		id: 'gemini-pro',
		name: 'Gemini Pro',
		description: 'Advanced reasoning from Google.'
	},
    {
		id: 'chat-model',
		name: 'Chat model',
		description: 'Primary model for all-purpose chat'
	},
	{
		id: 'chat-model-reasoning',
		name: 'Reasoning model',
		description: 'Uses advanced reasoning'
	}
];