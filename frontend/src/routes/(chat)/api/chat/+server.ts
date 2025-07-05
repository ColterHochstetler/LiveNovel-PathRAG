import { myProvider } from '$lib/server/ai/models';
import { systemPrompt } from '$lib/server/ai/prompts.js';
import { generateTitleFromUserMessage } from '$lib/server/ai/utils';
import { deleteChatById, getChatById, saveChat, saveMessages } from '$lib/server/db/queries.js';
import type { Chat } from '$lib/server/db/schema';
import { getMostRecentUserMessage, getTrailingMessageId } from '$lib/utils/chat.js';
import { allowAnonymousChats } from '$lib/utils/constants.js';
import { error } from '@sveltejs/kit';
import {
	appendResponseMessages,
	createDataStreamResponse,
	smoothStream,
	streamText,
	type UIMessage
} from 'ai';
import { ok, safeTry, fromPromise } from 'neverthrow';

import { AIInternalError } from '$lib/errors/ai';

export async function POST({ request, locals: { user }, cookies }) {
	// TODO: zod?
	const { id, messages }: { id: string; messages: UIMessage[] } = await request.json();
	const selectedChatModel = cookies.get('selected-model');

	if (!user && !allowAnonymousChats) {
		error(401, 'Unauthorized');
	}

	if (!selectedChatModel) {
		error(400, 'No chat model selected');
	}

	const userMessage = getMostRecentUserMessage(messages);

	if (!userMessage) {
		error(400, 'No user message found');
	}

	if (user) {
	const result = await safeTry(async function* () {
		let chat: Chat;
		const chatResult = await getChatById({ id });

		if (chatResult.isErr()) {
		if (chatResult.error._tag !== 'DbEntityNotFoundError') {
			// Forwarding the specific database error
			return err(new Error(`Database error: ${chatResult.error.message}`));
		}
		const titleResult = await fromPromise(
			generateTitleFromUserMessage({ message: userMessage }),
			(e) => new AIInternalError("Failed inpost attempted in api/chat/servers.ts: ", { cause: e }) 
		);

		if (titleResult.isErr()) {
			// Specific error for title generation failure
			return err(new Error('Failed to generate chat title from AI.'));
		}

		chat = yield* saveChat({ id, userId: user.id, title: titleResult.value });
		} else {
		chat = chatResult.value;
		}

		if (chat.userId !== user.id) {
		// Using a specific error for forbidden access
		return err(new Error('Forbidden: You do not have access to this chat.'));
		}

		yield* saveMessages({
		messages: [
			{
			chatId: id,
			id: userMessage.id,
			role: 'user',
			parts: userMessage.parts,
			attachments: userMessage.experimental_attachments ?? [],
			createdAt: new Date()
			}
		]
		});

		return ok(undefined);
	});

	if (result.isErr()) {
		// Now, instead of a generic message, we use the specific error message
		error(500, result.error.message);
	}
	}
	return createDataStreamResponse({
		execute: (dataStream) => {
			const result = streamText({
				model: myProvider.languageModel(selectedChatModel),
				system: systemPrompt({ selectedChatModel }),
				messages,
				maxSteps: 5,
				experimental_activeTools: [],
				// TODO
				// selectedChatModel === 'chat-model-reasoning'
				// 	? []
				// 	: ['getWeather', 'createDocument', 'updateDocument', 'requestSuggestions'],
				experimental_transform: smoothStream({ chunking: 'word' }),
				experimental_generateMessageId: crypto.randomUUID.bind(crypto),
				// TODO
				// tools: {
				// 	getWeather,
				// 	createDocument: createDocument({ session, dataStream }),
				// 	updateDocument: updateDocument({ session, dataStream }),
				// 	requestSuggestions: requestSuggestions({
				// 		session,
				// 		dataStream
				// 	})
				// },
				onFinish: async ({ response }) => {
					if (!user) return;
					const assistantId = getTrailingMessageId({
						messages: response.messages.filter((message) => message.role === 'assistant')
					});

					if (!assistantId) {
						throw new Error('No assistant message found!');
					}

					const [, assistantMessage] = appendResponseMessages({
						messages: [userMessage],
						responseMessages: response.messages
					});

					await saveMessages({
						messages: [
							{
								id: assistantId,
								chatId: id,
								role: assistantMessage.role,
								parts: assistantMessage.parts,
								attachments: assistantMessage.experimental_attachments ?? [],
								createdAt: new Date()
							}
						]
					});
				},
				experimental_telemetry: {
					isEnabled: true,
					functionId: 'stream-text'
				}
			});

			result.consumeStream();

			result.mergeIntoDataStream(dataStream, {
				sendReasoning: true
			});
		},
		onError: (e) => {
			console.error(e);
			return 'Oops!';
		}
	});
}

export async function DELETE({ locals: { user }, request }) {
	// TODO: zod
	const { id }: { id: string } = await request.json();
	if (!user) {
		error(401, 'Unauthorized');
	}

	return await getChatById({ id })
		.andTee((chat) => {
			if (chat.userId !== user.id) {
				error(403, 'Forbidden');
			}
		})
		.andThen(deleteChatById)
		.match(
			() => new Response('Chat deleted', { status: 200 }),
			() => error(500, 'An error occurred while processing your request')
		);
}
