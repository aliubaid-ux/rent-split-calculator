'use server';

/**
 * @fileOverview A flow to explain the AI's weight distribution suggestions for rent splitting.
 *
 * - explainAISuggestion - A function that takes room details and AI suggested weights, and returns explanations for the suggestions.
 * - ExplainAISuggestionInput - The input type for the explainAISuggestion function.
 * - ExplainAISuggestionOutput - The return type for the explainAISuggestion function.
 */

import { genkit } from 'genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Consistent Room schema, matching suggest-fair-weights.ts
const RoomSchema = z.object({
  name: z.string().describe('Name of the room'),
  size: z.number().describe('Size of the room in square feet'),
  hasPrivateBathroom: z.boolean().describe('Whether the room has a private bathroom'),
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
});

const ExplainAISuggestionInputSchema = z.object({
  apiKey: z.string().optional(),
  rooms: z.array(RoomSchema).describe('Array of room objects with their details'),
  sizeWeight: z.number(),
  featureWeight: z.number(),
  comfortWeight: z.number(),
});
export type ExplainAISuggestionInput = z.infer<typeof ExplainAISuggestionInputSchema>;

const ExplainAISuggestionOutputSchema = z.object({
  explanation: z.string(),
});
export type ExplainAISuggestionOutput = z.infer<typeof ExplainAISuggestionOutputSchema>;

function getCustomAi(apiKey?: string) {
  if (!apiKey) {
    throw new Error('Gemini API key not found.');
  }

  return genkit({
    plugins: [googleAI({ apiKey })],
  });
}

export async function explainAISuggestion(input: ExplainAISuggestionInput): Promise<ExplainAISuggestionOutput> {
  const customAi = getCustomAi(input.apiKey);

  const prompt = customAi.definePrompt({
    name: 'explainAISuggestionPrompt',
    input: { schema: ExplainAISuggestionInputSchema },
    output: { schema: ExplainAISuggestionOutputSchema },
    prompt: `You are an AI assistant that explains why certain weight distributions were suggested for a rent splitting tool.

You are given the following room details:

{{{JSON.stringify rooms}}}

The AI suggested the following weights:
Size Weight: {{sizeWeight}}
Feature Weight: {{featureWeight}}
Comfort Weight: {{comfortWeight}}

Explain in a short, friendly, and to-the-point paragraph why these weights were suggested. Provide specific reasons for each weight based on the room details. For example, if one room is much larger or has a unique feature like a private bathroom, mention it.
`,
  });

  const { output } = await prompt(input);
  return output!;
}
