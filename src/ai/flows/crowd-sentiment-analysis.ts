// src/ai/flows/crowd-sentiment-analysis.ts
'use server';
/**
 * @fileOverview A crowd sentiment analysis AI agent.
 *
 * - analyzeCrowdSentiment - A function that handles the crowd sentiment analysis process.
 * - AnalyzeCrowdSentimentInput - The input type for the analyzeCrowdSentiment function.
 * - AnalyzeCrowdSentimentOutput - The return type for the analyzeCrowdSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCrowdSentimentInputSchema = z.object({
  socialMediaChatter: z
    .string()
    .describe("Real-time social media chatter related to the event."),
});
export type AnalyzeCrowdSentimentInput = z.infer<typeof AnalyzeCrowdSentimentInputSchema>;

const AnalyzeCrowdSentimentOutputSchema = z.object({
  overallSentiment: z
    .string()
    .describe("The overall sentiment of the crowd (e.g., positive, negative, mixed)."),
  keyIssues: z
    .string()
    .describe("A summary of the key issues or concerns identified in the chatter."),
  sentimentBreakdown: z
    .string()
    .describe("A more detailed breakdown of the sentiment, including specific topics and their associated sentiment."),
});
export type AnalyzeCrowdSentimentOutput = z.infer<typeof AnalyzeCrowdSentimentOutputSchema>;

export async function analyzeCrowdSentiment(input: AnalyzeCrowdSentimentInput): Promise<AnalyzeCrowdSentimentOutput> {
  return analyzeCrowdSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCrowdSentimentPrompt',
  input: {schema: AnalyzeCrowdSentimentInputSchema},
  output: {schema: AnalyzeCrowdSentimentOutputSchema},
  prompt: `You are an AI assistant that analyzes crowd sentiment from social media chatter.

  Analyze the following social media chatter to determine the overall sentiment of the crowd, identify key issues or concerns, and provide a detailed breakdown of the sentiment.

  Social Media Chatter:
  {{socialMediaChatter}}

  Overall Sentiment:
  Key Issues:
  Sentiment Breakdown: `,
});

const analyzeCrowdSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeCrowdSentimentFlow',
    inputSchema: AnalyzeCrowdSentimentInputSchema,
    outputSchema: AnalyzeCrowdSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
