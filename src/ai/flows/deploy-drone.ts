
'use server';
/**
 * @fileOverview Simulates deploying a drone for visual inspection.
 *
 * - deployDrone - A function that handles the drone deployment process.
 * - DeployDroneInput - The input type for the function.
 * - DeployDroneOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DeployDroneInputSchema = z.object({
  droneId: z.string().describe('The ID of the drone to be deployed.'),
  location: z.string().describe('The target location for the drone to inspect.'),
  contextImage: z.string().describe("An image of the area for context, as a data URI."),
});
export type DeployDroneInput = z.infer<typeof DeployDroneInputSchema>;

const DeployDroneOutputSchema = z.object({
  confirmation: z.string().describe("A confirmation message that the drone is en route."),
  flightTime: z.string().describe("Estimated flight time to the location."),
});
export type DeployDroneOutput = z.infer<typeof DeployDroneOutputSchema>;

export async function deployDrone(
  input: DeployDroneInput
): Promise<DeployDroneOutput> {
  return deployDroneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'deployDronePrompt',
  input: {schema: DeployDroneInputSchema},
  output: {schema: DeployDroneOutputSchema},
  prompt: `You are a drone fleet command system. You have received a request to deploy a drone.

- Drone to deploy: {{{droneId}}}
- Target Location: {{{location}}}
- Visual Context: {{media url=contextImage}}

Acknowledge the command and provide an estimated flight time. Keep the response brief and professional.
`,
});

const deployDroneFlow = ai.defineFlow(
  {
    name: 'deployDroneFlow',
    inputSchema: DeployDroneInputSchema,
    outputSchema: DeployDroneOutputSchema,
  },
  async input => {
    // In a real application, this would trigger a drone control API.
    // For this prototype, we just get a confirmation from the AI.
    const {output} = await prompt(input);
    return output!;
  }
);
