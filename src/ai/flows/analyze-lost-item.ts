
'use server';
/**
 * @fileOverview Analyzes an image and description of a lost item to categorize it and suggest next steps.
 *
 * - analyzeLostItem - A function that handles the lost item analysis process.
 * - AnalyzeLostItemInput - The input type for the analyzeLostItem function.
 * - AnalyzeLostItemOutput - The return type for the analyzeLostItem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLostItemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the found item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A text description of the item and where it was found.'),
});
export type AnalyzeLostItemInput = z.infer<typeof AnalyzeLostItemInputSchema>;

const AnalyzeLostItemOutputSchema = z.object({
  category: z.string().describe('The category of the item (e.g., Electronics, Clothing, Bag, Keys, Wallet).'),
  potentialOwnerInfo: z
    .string()
    .describe(
      'A summary of any identifying information from the description or image (like a name or contact info). If none, state "No identifying information found."'
    ),
  recommendedAction: z
    .string()
    .describe(
      'A recommended action, such as "Log item and hold at central Lost & Found." or "Attempt to contact owner with provided info."'
    ),
});
export type AnalyzeLostItemOutput = z.infer<typeof AnalyzeLostItemOutputSchema>;

export async function analyzeLostItem(input: AnalyzeLostItemInput): Promise<AnalyzeLostItemOutput> {
  return analyzeLostItemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeLostItemPrompt',
  input: {schema: AnalyzeLostItemInputSchema},
  output: {schema: AnalyzeLostItemOutputSchema},
  prompt: `You are an AI assistant for an event's Lost & Found department.
  
Analyze the provided image and description of a found item.
1. Categorize the item.
2. Extract any potential identifying information of the owner (e.g., name on a card, phone number).
3. Recommend the next action for the event staff.

Item Photo: {{media url=photoDataUri}}
Description: {{{description}}}
`,
});

const analyzeLostItemFlow = ai.defineFlow(
  {
    name: 'analyzeLostItemFlow',
    inputSchema: AnalyzeLostItemInputSchema,
    outputSchema: AnalyzeLostItemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
