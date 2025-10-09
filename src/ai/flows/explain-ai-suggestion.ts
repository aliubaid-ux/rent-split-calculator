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
  explanations: z.array(z.string()),
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

{% each roomDetails %}
Room Name: {{this.roomName}}
Size: {{this.size}}
Features: {{this.features}}
Noise Level: {{this.noiseLevel}}
Natural Light: {{this.naturalLight}}
Custom Features: {% each this.customFeatures %}{{this.name}} (Importance: {{this.importance}})
{% endeach %}
{% endeach %}

The AI suggested the following weights:
Size Weight: {{sizeWeight}}
Feature Weight: {{featureWeight}}
Comfort Weight: {{comfortWeight}}

Explain why these weights were suggested, providing specific reasons for each weight based on the room details. Provide justification for the suggested weights, with details. Focus on which rooms influenced the weight the most, and what were the important features. The explanation should be short and to the point.

Output format:
{
  "explanations": ["Explanation 1", "Explanation 2", ...]
}
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
