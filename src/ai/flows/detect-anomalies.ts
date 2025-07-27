
'use server';
/**
 * @fileOverview Detects anomalies by analyzing multimodal input.
 *
 * - detectAnomalies - A function that handles the anomaly detection process.
 * - DetectAnomaliesInput - The input type for the detectAnomalies function.
 * - DetectAnomaliesOutput - The return type for the detectAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomaliesInputSchema = z.object({
  image: z
    .string()
    .describe(
      "An image capturing the potential anomaly, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  sensorData: z.string().describe('A text description of sensor readings (e.g., noise levels, temperature).'),
  socialChatter: z.string().describe('A text summary of relevant social media posts.'),
});
export type DetectAnomaliesInput = z.infer<typeof DetectAnomaliesInputSchema>;

const DetectAnomaliesOutputSchema = z.object({
  anomalyType: z.string().describe('The type of anomaly detected (e.g., Fire, Disturbance, Medical, None).'),
  severity: z.string().describe('The estimated severity of the anomaly (e.g., Low, Medium, High, Critical).'),
  recommendedAction: z.string().describe('The recommended immediate action for the event staff.'),
});
export type DetectAnomaliesOutput = z.infer<typeof DetectAnomaliesOutputSchema>;

export async function detectAnomalies(input: DetectAnomaliesInput): Promise<DetectAnomaliesOutput> {
  return detectAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomaliesPrompt',
  input: {schema: DetectAnomaliesInputSchema},
  output: {schema: DetectAnomaliesOutputSchema},
  prompt: `You are an expert security analyst in an event command center. Your task is to detect anomalies by analyzing multimodal data.

Correlate the information from the image, sensor data, and social media chatter to identify any potential incidents.

1.  **Image Analysis**: Look for visual cues of distress, danger, or unusual activity (e.g., smoke, fire, large crowds running, medical emergencies).
2.  **Sensor Data**: Correlate sensor readings with other inputs. Loud noises could indicate a disturbance or panic. Temperature spikes could indicate a fire.
3.  **Social Chatter**: Analyze text for keywords indicating panic, danger, or specific incidents.

Based on your combined analysis, determine the anomaly type, its severity, and recommend an action. If no clear anomaly is detected, state "None".

**Data Feeds:**
-   **Image:** {{media url=image}}
-   **Sensor Data:** {{{sensorData}}}
-   **Social Chatter:** {{{socialChatter}}}
`,
});

const detectAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAnomaliesFlow',
    inputSchema: DetectAnomaliesInputSchema,
    outputSchema: DetectAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
