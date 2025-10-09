'use server';

/**
 * @fileOverview AI-powered weight suggestion flow for fair rent splitting.
 *
 * This file exports:
 * - `suggestFairWeights`: A function to suggest fair weight distributions using the Gemini API.
 * - `SuggestFairWeightsInput`: The input type for the `suggestFairWeights` function.
 * - `SuggestFairWeightsOutput`: The output type for the `suggestFairWeights` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { cookies } from 'next/headers';
import { googleAI } from '@genkit-ai/google-genai';

const SuggestFairWeightsInputSchema = z.object({
  rooms: z.array(
    z.object({
      name: z.string().describe('Name of the room'),
      size: z.number().describe('Size of the room in square feet'),
      hasPrivateBathroom: z
        .boolean()
        .describe('Whether the room has a private bathroom'),
      hasCloset: z.boolean().describe('Whether the room has a closet'),
      hasBalcony: z.boolean().describe('Whether the room has a balcony'),
      airConditioning: z.boolean().describe('Whether the room has air conditioning'),
      noiseLevel: z.number().min(1).max(5).describe('Noise level of the room (1-5)'),
      naturalLight: z.number().min(1).max(5).describe('Natural light in the room (1-5)'),
      customFeatures: z.array(
        z.object({
          name: z.string().describe('Name of the custom feature'),
          importance: z.number().describe('Importance level of the custom feature'),
        })
      ).optional().describe('Custom features of the room')
    })
  ).describe('Array of room objects with their details'),
});

export type SuggestFairWeightsInput = z.infer<typeof SuggestFairWeightsInputSchema>;

const SuggestFairWeightsOutputSchema = z.object({
  sizeWeight: z.number().describe('Suggested weight for room size (0-100)'),
  featureWeight: z.number().describe('Suggested weight for room features (0-100)'),
  comfortWeight: z.number().describe('Suggested weight for room comfort (0-100)'),
});

export type SuggestFairWeightsOutput = z.infer<typeof SuggestFairWeightsOutputSchema>;

function getCustomAi() {
  const cookieStore = cookies();
  const apiKey = cookieStore.get('gemini_api_key')?.value;

  if (!apiKey) {
    throw new Error('Gemini API key not found.');
  }

  return genkit({
    plugins: [googleAI({ apiKey })],
  });
}

export async function suggestFairWeights(input: SuggestFairWeightsInput): Promise<SuggestFairWeightsOutput> {
  const customAi = getCustomAi();

  const suggestFairWeightsPrompt = customAi.definePrompt({
    name: 'suggestFairWeightsPrompt',
    input: {schema: SuggestFairWeightsInputSchema},
    output: {schema: SuggestFairWeightsOutputSchema},
    prompt: `You are an expert in fair rent distribution. Analyze the room details and suggest fair weights (0-100) for size, features, and comfort. The weights must sum to 100.

Rooms: {{{JSON.stringify rooms}}}

Consider these factors:
*   **Size:** Larger rooms get higher rent.
*   **Features:** Private bathrooms, balconies, etc., add value.
*   **Comfort:** Lower noise and more light are better.

Output only the weights.
`,
  });

  const {output} = await suggestFairWeightsPrompt(input);
  return output!;
}
