
'use server';
/**
 * @fileOverview Predicts potential crowd bottlenecks based on various data points.
 *
 * - predictBottlenecks - A function that handles bottleneck prediction.
 * - PredictBottlenecksInput - The input type for the function.
 * - PredictBottlenecksOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictBottlenecksInputSchema = z.object({
  currentDensity: z.string().describe('A description of the current crowd density in different zones.'),
  historicalData: z.string().describe('A summary of crowd behavior from past similar events or times.'),
  eventSchedule: z.string().describe('What is currently happening and what is scheduled to happen soon.'),
});
export type PredictBottlenecksInput = z.infer<typeof PredictBottlenecksInputSchema>;

const PredictionSchema = z.object({
    location: z.string().describe("The specific zone or area where a bottleneck is predicted."),
    riskLevel: z.string().describe("The risk level of the bottleneck (e.g., Low, Medium, High, Critical)."),
    timeframe: z.string().describe("The estimated time until the bottleneck occurs (e.g., 'in 15-30 minutes')."),
});

const PredictBottlenecksOutputSchema = z.object({
  predictions: z.array(PredictionSchema).describe("A list of potential bottleneck predictions."),
  recommendation: z.string().describe("A high-level recommendation to mitigate the highest risk bottleneck."),
});
export type PredictBottlenecksOutput = z.infer<typeof PredictBottlenecksOutputSchema>;

export async function predictBottlenecks(
  input: PredictBottlenecksInput
): Promise<PredictBottlenecksOutput> {
  return predictBottlenecksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictBottlenecksPrompt',
  input: {schema: PredictBottlenecksInputSchema},
  output: {schema: PredictBottlenecksOutputSchema},
  prompt: `You are a crowd dynamics expert AI for a large event. Your task is to forecast potential bottlenecks.

Analyze the following data:
- Current Crowd Density: {{{currentDensity}}}
- Historical Data & Trends: {{{historicalData}}}
- Event Schedule: {{{eventSchedule}}}

Based on this information, predict where and when bottlenecks are likely to form in the near future. Provide a risk level for each prediction and a top-level recommendation to proactively manage the situation.
`,
});

const predictBottlenecksFlow = ai.defineFlow(
  {
    name: 'predictBottlenecksFlow',
    inputSchema: PredictBottlenecksInputSchema,
    outputSchema: PredictBottlenecksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
