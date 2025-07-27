
'use server';
/**
 * @fileOverview Generates a gamified "nudge" message to influence crowd flow.
 *
 * - generateNudge - A function that handles nudge generation.
 * - GenerateNudgeInput - The input type for the function.
 * - GenerateNudgeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNudgeInputSchema = z.object({
  congestedZone: z.string().describe('The area that is currently too crowded.'),
  targetZone: z.string().describe('The less crowded area we want to guide people to.'),
  incentiveType: z.string().describe('The type of incentive to offer (e.g., "discount", "giveaway", "special-access").'),
});
export type GenerateNudgeInput = z.infer<typeof GenerateNudgeInputSchema>;

const GenerateNudgeOutputSchema = z.object({
  message: z.string().describe("The catchy, gamified message to be sent to visitors."),
  targetAudience: z.string().describe("A description of the target audience for this message (e.g., 'Visitors currently located in the Congested Zone')."),
});
export type GenerateNudgeOutput = z.infer<typeof GenerateNudgeOutputSchema>;

export async function generateNudge(
  input: GenerateNudgeInput
): Promise<GenerateNudgeOutput> {
  return generateNudgeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNudgePrompt',
  input: {schema: GenerateNudgeInputSchema},
  output: {schema: GenerateNudgeOutputSchema},
  prompt: `You are a marketing AI for a large festival. Your goal is to create a "nudge" notification to encourage people to move from a crowded area to a less crowded one. The tone should be fun, exciting, and brief.

Create a message to move people from the {{{congestedZone}}} to the {{{targetZone}}}.
The incentive is a {{{incentiveType}}}.
`,
});

const generateNudgeFlow = ai.defineFlow(
  {
    name: 'generateNudgeFlow',
    inputSchema: GenerateNudgeInputSchema,
    outputSchema: GenerateNudgeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
