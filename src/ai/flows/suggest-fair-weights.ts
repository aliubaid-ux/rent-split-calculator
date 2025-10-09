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
  explanation: z.string().describe('Explanation of why these weights are suggested'),
});

export type SuggestFairWeightsOutput = z.infer<typeof SuggestFairWeightsOutputSchema>;

export async function suggestFairWeights(input: SuggestFairWeightsInput): Promise<SuggestFairWeightsOutput> {
  return suggestFairWeightsFlow(input);
}

const suggestFairWeightsPrompt = ai.definePrompt({
  name: 'suggestFairWeightsPrompt',
  input: {schema: SuggestFairWeightsInputSchema},
  output: {schema: SuggestFairWeightsOutputSchema},
  prompt: `You are an expert in fair rent distribution among roommates. Analyze the following room details and suggest fair weights (0-100) for size, features, and comfort, explaining your reasoning. The weights should sum to 100.

Rooms: {{{JSON.stringify rooms}}}

Consider these factors when assigning weights:

*   **Size:** Larger rooms generally warrant a higher rent.
*   **Features:** Private bathrooms, closets, balconies, and air conditioning add value.
*   **Comfort:** Lower noise levels and more natural light improve comfort.

Output the weights and explain the logic of how you assigned the weights. Give a thorough explanation that a user can understand.

Ensure that sizeWeight + featureWeight + comfortWeight add up to 100.

Example Output:
{
  "sizeWeight": 50,
  "featureWeight": 30,
  "comfortWeight": 20,
  "explanation": "Size is the most significant factor, so it receives the highest weight. Features contribute moderately, and comfort factors are less important in this scenario."
}
`,
});

const suggestFairWeightsFlow = ai.defineFlow(
  {
    name: 'suggestFairWeightsFlow',
    inputSchema: SuggestFairWeightsInputSchema,
    outputSchema: SuggestFairWeightsOutputSchema,
  },
  async input => {
    const {output} = await suggestFairWeightsPrompt(input);
    return output!;
  }
);
