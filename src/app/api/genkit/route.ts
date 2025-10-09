import { genkit } from '@/ai/genkit';
import { nextJSHandler } from '@genkit-ai/next';
import { suggestFairWeights } from '@/ai/flows/suggest-fair-weights';
import { explainAISuggestion } from '@/ai/flows/explain-ai-suggestion';


export const POST = nextJSHandler({
  flows: [suggestFairWeights, explainAISuggestion],
});