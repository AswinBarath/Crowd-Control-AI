// src/ai/flows/identify-staff-roles.ts
'use server';
/**
 * @fileOverview Identifies staff members in a video frame based on T-shirt color.
 *
 * - identifyStaffRoles - A function that handles the staff identification process.
 * - IdentifyStaffRolesInput - The input type for the identifyStaffRoles function.
 * - IdentifyStaffRolesOutput - The return type for the identifyStaffRoles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StaffMemberSchema = z.object({
  role: z.string().describe('The role of the staff member (e.g., Security, Volunteer, Medical).'),
  color: z.string().describe('The color of their T-shirt (e.g., blue, green, white).'),
  location: z.object({
    x: z.number().describe('The x-coordinate of the center of the bounding box (from 0 to 1).'),
    y: z.number().describe('The y-coordinate of the center of the bounding box (from 0 to 1).'),
    width: z.number().describe('The width of the bounding box (from 0 to 1).'),
    height: z.number().describe('The height of the bounding box (from 0 to 1).'),
  }).describe('The bounding box of the detected staff member.'),
});

const IdentifyStaffRolesInputSchema = z.object({
  videoFrame: z
    .string()
    .describe(
      "A single frame from a video feed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyStaffRolesInput = z.infer<typeof IdentifyStaffRolesInputSchema>;

const IdentifyStaffRolesOutputSchema = z.object({
  staff: z.array(StaffMemberSchema).describe('A list of identified staff members.'),
});
export type IdentifyStaffRolesOutput = z.infer<typeof IdentifyStaffRolesOutputSchema>;

export async function identifyStaffRoles(input: IdentifyStaffRolesInput): Promise<IdentifyStaffRolesOutput> {
  return identifyStaffRolesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyStaffRolesPrompt',
  input: {schema: IdentifyStaffRolesInputSchema},
  output: {schema: IdentifyStaffRolesOutputSchema},
  prompt: `You are a computer vision expert. Analyze the provided image to identify all staff members.

Staff roles are determined by their T-shirt color:
- Security: Blue T-shirt
- Volunteer: Green T-shirt
- Medical: White T-shirt with a red cross (treat as white for simplicity)

For each staff member you find, provide their role, T-shirt color, and a normalized bounding box (x, y, width, height) for their location in the image.

Analyze this image: {{media url=videoFrame}}`,
});

const identifyStaffRolesFlow = ai.defineFlow(
  {
    name: 'identifyStaffRolesFlow',
    inputSchema: IdentifyStaffRolesInputSchema,
    outputSchema: IdentifyStaffRolesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
