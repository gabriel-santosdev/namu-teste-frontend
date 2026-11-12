import '@testing-library/jest-dom';
import { resetMockApi } from './mockApi';
import { clearRequests, server } from './server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  window.scrollTo = jest.fn();
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

beforeEach(() => {
  resetMockApi();
  clearRequests();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
