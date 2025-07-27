'use server';
/**
 * @fileOverview Analyzes a video frame to determine crowd density and flow.
 *
 * - analyzeCrowdFlow - A function that handles the crowd flow analysis process.
 * - AnalyzeCrowdFlowInput - The input type for the analyzeCrowdFlow function.
 * - AnalyzeCrowdFlowOutput - The return type for the analyzeCrowdFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCrowdFlowInputSchema = z.object({
  videoFrame: z
    .string()
    .describe(
      "A single frame from a video feed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCrowdFlowInput = z.infer<typeof AnalyzeCrowdFlowInputSchema>;

const AnalyzeCrowdFlowOutputSchema = z.object({
  density: z.string().describe('A description of the crowd density (e.g., low, moderate, high).'),
  flow: z.string().describe('A description of the crowd movement patterns (e.g., static, slow, fast).'),
  bottlenecks: z.string().describe('A description of any identified bottlenecks or points of congestion.'),
});
export type AnalyzeCrowdFlowOutput = z.infer<typeof AnalyzeCrowdFlowOutputSchema>;

export async function analyzeCrowdFlow(input: AnalyzeCrowdFlowInput): Promise<AnalyzeCrowdFlowOutput> {
  return analyzeCrowdFlowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCrowdFlowPrompt',
  input: {schema: AnalyzeCrowdFlowInputSchema},
  output: {schema: AnalyzeCrowdFlowOutputSchema},
  prompt: `You are a security expert analyzing a live video feed from an event.

Analyze the provided image to assess the crowd situation. Identify the crowd density, the general flow of movement, and any potential bottlenecks where people are getting stuck.

Provide your analysis based on this image: {{media url=videoFrame}}`,
});

const analyzeCrowdFlowFlow = ai.defineFlow(
  {
    name: 'analyzeCrowdFlowFlow',
    inputSchema: AnalyzeCrowdFlowInputSchema,
    outputSchema: AnalyzeCrowdFlowOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
