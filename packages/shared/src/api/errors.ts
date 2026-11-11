export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

export const NETWORK_ERROR_MESSAGE =
  'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
export const TIMEOUT_ERROR_MESSAGE = 'O servidor demorou demais para responder. Tente novamente.';
export const GENERIC_ERROR_MESSAGE = 'Algo deu errado. Tente novamente em instantes.';

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isClientError(error: unknown): boolean {
  return isApiError(error) && error.status >= 400 && error.status < 500;
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  return GENERIC_ERROR_MESSAGE;
}
