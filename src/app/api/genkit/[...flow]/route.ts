import { createApiHandler } from '@genkit-ai/next/server';
import '@/ai/genkit';

export const { GET, POST } = createApiHandler();
