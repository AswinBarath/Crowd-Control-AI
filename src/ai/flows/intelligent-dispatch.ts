
'use server';
/**
 * @fileOverview Simulates intelligent dispatch of the nearest unit to an incident.
 *
 * - intelligentDispatch - A function that handles the dispatch process.
 * - IntelligentDispatchInput - The input type for the function.
 * - IntelligentDispatchOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentDispatchInputSchema = z.object({
  incidentType: z.string().describe('The type of incident (e.g., Medical, Disturbance).'),
  location: z.string().describe('The location of the incident.'),
});
export type IntelligentDispatchInput = z.infer<typeof IntelligentDispatchInputSchema>;

const IntelligentDispatchOutputSchema = z.object({
  unit: z.string().describe('The ID or name of the dispatched unit (e.g., "Medical Team Alpha", "Security Patrol 3").'),
  eta: z.string().describe('The estimated time of arrival for the unit (e.g., "3 minutes").'),
  route: z.string().describe('A brief description of the suggested route for the unit.'),
});
export type IntelligentDispatchOutput = z.infer<typeof IntelligentDispatchOutputSchema>;

// This is a mock function simulating finding the nearest unit.
// In a real app, this would query a database of staff locations.
const findNearestUnit = (incidentType: string) => {
    if (incidentType === 'Medical') {
        return { id: 'Medical Team Alpha', location: 'Zone B' };
    }
    return { id: 'Security Patrol 3', location: 'Zone C' };
}

export async function intelligentDispatch(
  input: IntelligentDispatchInput
): Promise<IntelligentDispatchOutput> {
  return intelligentDispatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentDispatchPrompt',
  input: {schema: z.object({
      incidentType: z.string(),
      incidentLocation: z.string(),
      unitId: z.string(),
      unitLocation: z.string(),
  })},
  output: {schema: IntelligentDispatchOutputSchema},
  prompt: `You are a dispatch system AI. An incident has occurred.

- Incident Type: {{{incidentType}}}
- Incident Location: {{{incidentLocation}}}
- Nearest Available Unit: {{{unitId}}} at {{{unitLocation}}}

Calculate a quick ETA and a simple route for the unit to reach the incident. Assume walking speed of 1.5 m/s and use straight-line estimations if necessary. The event map is a standard grid layout.
`,
});

const intelligentDispatchFlow = ai.defineFlow(
  {
    name: 'intelligentDispatchFlow',
    inputSchema: IntelligentDispatchInputSchema,
    outputSchema: IntelligentDispatchOutputSchema,
  },
  async ({ incidentType, location }) => {
    // In a real app, this would involve a Google Maps API call and GPS tracking.
    // For this prototype, we simulate finding the nearest unit.
    const nearestUnit = findNearestUnit(incidentType);

    const {output} = await prompt({
        incidentType: incidentType,
        incidentLocation: location,
        unitId: nearestUnit.id,
        unitLocation: nearestUnit.location,
    });
    return output!;
  }
);
