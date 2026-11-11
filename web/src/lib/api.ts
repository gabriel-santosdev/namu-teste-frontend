import { createApiClient } from '@namu/shared';
import { API_URL } from '@/config/env';

export const api = createApiClient({ baseUrl: API_URL });
