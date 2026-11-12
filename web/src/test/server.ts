import { setupServer } from 'msw/node';
import { handlers } from './mockApi';

export const server = setupServer(...handlers);

const requests: Request[] = [];

server.events.on('request:start', ({ request }) => {
  requests.push(request);
});

export function clearRequests() {
  requests.length = 0;
}

export function findRequests(method: string, pathname: string | RegExp): Request[] {
  return requests.filter((request) => {
    const path = new URL(request.url).pathname;
    const matchesPath = typeof pathname === 'string' ? path === pathname : pathname.test(path);
    return request.method === method && matchesPath;
  });
}

export function lastContentsQuery(): URLSearchParams | undefined {
  const last = findRequests('GET', '/contents').at(-1);
  return last && new URL(last.url).searchParams;
}
