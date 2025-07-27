'use server';
/**
 * @fileOverview Generates concise, natural language summaries of the current crowd situation.
 *
 * - generateSituationalSummary - A function that handles the generation of situational summaries.
 * - GenerateSituationalSummaryInput - The input type for the generateSituationalSummary function.
 * - GenerateSituationalSummaryOutput - The return type for the generateSituationalSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSituationalSummaryInputSchema = z.object({
  crowdDensity: z.string().describe('A description of the current crowd density in different zones.'),
  crowdFlow: z.string().describe('A description of the crowd flow and movement patterns.'),
  incidentReports: z.string().describe('A summary of recent incident reports, including type and location.'),
  socialMediaSentiment: z.string().describe('An analysis of social media sentiment related to the event.'),
});
export type GenerateSituationalSummaryInput = z.infer<typeof GenerateSituationalSummaryInputSchema>;

const GenerateSituationalSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, natural language summary of the current crowd situation.'),
});
export type GenerateSituationalSummaryOutput = z.infer<typeof GenerateSituationalSummaryOutputSchema>;

export async function generateSituationalSummary(
  input: GenerateSituationalSummaryInput
): Promise<GenerateSituationalSummaryOutput> {
  return generateSituationalSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSituationalSummaryPrompt',
  input: {schema: GenerateSituationalSummaryInputSchema},
  output: {schema: GenerateSituationalSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with generating concise situational summaries for event commanders.

  Based on the following information, create a brief summary (under 200 words) of the current crowd situation, highlighting key issues and potential concerns.

  Crowd Density: {{{crowdDensity}}}
  Crowd Flow: {{{crowdFlow}}}
  Incident Reports: {{{incidentReports}}}
  Social Media Sentiment: {{{socialMediaSentiment}}}

  Summary:`,
});

const generateSituationalSummaryFlow = ai.defineFlow(
  {
    name: 'generateSituationalSummaryFlow',
    inputSchema: GenerateSituationalSummaryInputSchema,
    outputSchema: GenerateSituationalSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
