import { describe, expect, it } from '@jest/globals';
import { ApiError, GENERIC_ERROR_MESSAGE, getErrorMessage, isClientError } from '../api/errors';
import { MAX_RETRIES, shouldRetryRequest } from '../api/retry';

describe('getErrorMessage', () => {
  it('usa a mensagem do ApiError', () => {
    expect(getErrorMessage(new ApiError('Falhou', 500))).toBe('Falhou');
  });

  it('usa a mensagem genérica para erros desconhecidos', () => {
    expect(getErrorMessage(new Error('boom'))).toBe(GENERIC_ERROR_MESSAGE);
  });
});

describe('isClientError', () => {
  it('identifica apenas erros 4xx', () => {
    expect(isClientError(new ApiError('Não encontrado', 404))).toBe(true);
    expect(isClientError(new ApiError('Erro interno', 500))).toBe(false);
    expect(isClientError(new ApiError('Sem conexão', 0))).toBe(false);
  });
});

describe('shouldRetryRequest', () => {
  it('não tenta novamente em erros 4xx', () => {
    expect(shouldRetryRequest(0, new ApiError('Inválido', 400))).toBe(false);
  });

  it('tenta novamente em erros de servidor até o limite', () => {
    const error = new ApiError('Erro interno', 500);
    expect(shouldRetryRequest(0, error)).toBe(true);
    expect(shouldRetryRequest(MAX_RETRIES, error)).toBe(false);
  });
});
