
'use server';
/**
 * @fileOverview Simulates an evacuation plan for a given scenario.
 *
 * - simulateEvacuation - A function that handles the evacuation simulation.
 * - SimulateEvacuationInput - The input type for the function.
 * - SimulateEvacuationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateEvacuationInputSchema = z.object({
  scenario: z.string().describe('The emergency scenario (e.g., "fire-main-stage", "power-outage-all-zones").'),
  crowdData: z.string().describe('A summary of current crowd distribution.'),
});
export type SimulateEvacuationInput = z.infer<typeof SimulateEvacuationInputSchema>;

const SimulateEvacuationOutputSchema = z.object({
  planTitle: z.string().describe("A short, descriptive title for the evacuation plan."),
  steps: z.array(z.string()).describe("A step-by-step list of actions for the evacuation."),
  estimatedTimeToEvacuate: z.string().describe("A rough estimation of the time needed to evacuate all zones."),
  keyConsiderations: z.string().describe("Key challenges or points to consider for this specific scenario."),
});
export type SimulateEvacuationOutput = z.infer<typeof SimulateEvacuationOutputSchema>;

export async function simulateEvacuation(
  input: SimulateEvacuationInput
): Promise<SimulateEvacuationOutput> {
  return simulateEvacuationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateEvacuationPrompt',
  input: {schema: SimulateEvacuationInputSchema},
  output: {schema: SimulateEvacuationOutputSchema},
  prompt: `You are an event safety and logistics expert. Your task is to create a smart evacuation plan based on a given scenario.

Event exits are located at: Gate A (North), Gate B (West), Gate C (West), Gate D (South).

Scenario: {{{scenario}}}
Current Crowd Data: {{{crowdData}}}

Generate a clear, step-by-step evacuation plan. Prioritize safety and clarity. Consider the scenario's impact on exit availability and crowd movement. Provide an estimated time to full evacuation and list key considerations for the command staff.
`,
});

const simulateEvacuationFlow = ai.defineFlow(
  {
    name: 'simulateEvacuationFlow',
    inputSchema: SimulateEvacuationInputSchema,
    outputSchema: SimulateEvacuationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
