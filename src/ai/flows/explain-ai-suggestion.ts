'use server';

/**
 * @fileOverview A flow to explain the AI's weight distribution suggestions for rent splitting.
 *
 * - explainAISuggestion - A function that takes room details and AI suggested weights, and returns explanations for the suggestions.
 * - ExplainAISuggestionInput - The input type for the explainAISuggestion function.
 * - ExplainAISuggestionOutput - The return type for the explainAISuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAISuggestionInputSchema = z.object({
  roomDetails: z.array(
    z.object({
      roomName: z.string(),
      size: z.number(),
      features: z.array(z.string()),
      noiseLevel: z.number(),
      naturalLight: z.number(),
      customFeatures: z.array(
        z.object({
          name: z.string(),
          importance: z.number(),
        })
      ),
    })
  ),
  sizeWeight: z.number(),
  featureWeight: z.number(),
  comfortWeight: z.number(),
});
export type ExplainAISuggestionInput = z.infer<typeof ExplainAISuggestionInputSchema>;

const ExplainAISuggestionOutputSchema = z.object({
  explanation: z.string(),
});
export type ExplainAISuggestionOutput = z.infer<typeof ExplainAISuggestionOutputSchema>;

export async function explainAISuggestion(input: ExplainAISuggestionInput): Promise<ExplainAISuggestionOutput> {
  return explainAISuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainAISuggestionPrompt',
  input: {schema: ExplainAISuggestionInputSchema},
  output: {schema: ExplainAISuggestionOutputSchema},
  prompt: `You are an AI assistant that explains why certain weight distributions were suggested for a rent splitting tool.

You are given the following room details:

{{{JSON.stringify roomDetails}}}

The AI suggested the following weights:
Size Weight: {{sizeWeight}}
Feature Weight: {{featureWeight}}
Comfort Weight: {{comfortWeight}}

Explain in a short, friendly, and to-the-point paragraph why these weights were suggested. Provide specific reasons for each weight based on the room details. For example, if one room is much larger or has a unique feature like a private bathroom, mention it.
`,
});

const explainAISuggestionFlow = ai.defineFlow(
  {
    name: 'explainAISuggestionFlow',
    inputSchema: ExplainAISuggestionInputSchema,
    outputSchema: ExplainAISuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    