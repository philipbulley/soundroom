import { ErrorType } from './error-type';

const DEFAULT_MAPPINGS: { [status: number]: ErrorType } = {
	401: ErrorType.UNAUTHORIZED,
	404: ErrorType.NOT_FOUND,
	500: ErrorType.SERVER
};

export function errorTypeFactory(
	status: number,
	customMappings?: { [status: number]: ErrorType }
): ErrorType {
	const types = customMappings
		? { ...DEFAULT_MAPPINGS, ...customMappings }
		: DEFAULT_MAPPINGS;

	return types[status] ? types[status] : ErrorType.UNKNOWN;
}
