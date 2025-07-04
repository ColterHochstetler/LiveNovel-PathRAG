export const DEFAULT_CHAT_MODEL: string = 'local-model';

interface ChatModel {
	id: string;
	name: string;
	description: string;
}

export const chatModels: Array<ChatModel> = [
	{
		id: 'local-model',
		name: 'LM Studios (Local)',
		description: 'Whatever local model you have running.'
	},
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
		id: 'open-router',
		name: 'Open Router',
		description: 'Whatever you have set in the code lol'
	},
];