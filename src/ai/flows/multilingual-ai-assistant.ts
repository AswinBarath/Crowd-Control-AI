// src/ai/flows/multilingual-ai-assistant.ts
'use server';

/**
 * @fileOverview A multilingual AI assistant that can answer questions in multiple languages.
 *
 * - multilingualAssistant - A function that handles the multilingual AI assistant process.
 * - MultilingualAssistantInput - The input type for the multilingualAssistant function.
 * - MultilingualAssistantOutput - The return type for the multilingualAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualAssistantInputSchema = z.object({
  query: z.string().describe('The user query in any language.'),
});
export type MultilingualAssistantInput = z.infer<typeof MultilingualAssistantInputSchema>;

const MultilingualAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query in the same language.'),
});
export type MultilingualAssistantOutput = z.infer<typeof MultilingualAssistantOutputSchema>;

export async function multilingualAssistant(input: MultilingualAssistantInput): Promise<MultilingualAssistantOutput> {
  return multilingualAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'multilingualAssistantPrompt',
  input: {schema: MultilingualAssistantInputSchema},
  output: {schema: MultilingualAssistantOutputSchema},
  prompt: `You are a multilingual AI assistant that can answer questions about directions, event information, and available services in the user's language.

  User Query: {{{query}}}

  Answer in the same language as the user's query:
  `,
});

const multilingualAssistantFlow = ai.defineFlow(
  {
    name: 'multilingualAssistantFlow',
    inputSchema: MultilingualAssistantInputSchema,
    outputSchema: MultilingualAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
