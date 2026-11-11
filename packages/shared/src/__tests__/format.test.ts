import { describe, expect, it } from '@jest/globals';
import { formatContentType, formatDuration, formatPublishedAt } from '../format';

describe('formatDuration', () => {
  it.each([
    [30, '1 min'],
    [600, '10 min'],
    [3600, '1 h'],
    [5400, '1 h 30 min'],
  ])('formata %i segundos como %s', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });
});

describe('formatContentType', () => {
  it('traduz o tipo do conteúdo', () => {
    expect(formatContentType('audio')).toBe('Áudio');
    expect(formatContentType('video')).toBe('Vídeo');
    expect(formatContentType('article')).toBe('Artigo');
  });
});

describe('formatPublishedAt', () => {
  it('formata a data em pt-BR sem deslocamento de fuso', () => {
    expect(formatPublishedAt('2024-03-01T00:00:00.000Z')).toBe('1 de março de 2024');
  });
});
