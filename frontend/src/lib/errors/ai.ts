import { TaggedError } from './tagged-error';

export class AIInternalError extends TaggedError<'AIInternalError'> {
	constructor(message = 'Internal AI error', options: ErrorOptions = {}) {
		super(message, options);
	}
}

export type AIError = AIInternalError;
