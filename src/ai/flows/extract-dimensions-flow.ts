'use server';
/**
 * @fileOverview An AI agent for extracting building dimensions from blueprints.
 *
 * - extractDimensions - A function that handles the dimension extraction process.
 * - ExtractDimensionsInput - The input type for the extractDimensions function.
 * - ExtractDimensionsOutput - The return type for the extractDimensions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractDimensionsInputSchema = z.object({
  blueprintDataUri: z
    .string()
    .describe(
      "A photo of a building blueprint, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractDimensionsInput = z.infer<typeof ExtractDimensionsInputSchema>;

const ExtractDimensionsOutputSchema = z.object({
  roofLength: z.number().describe('The extracted length of the main roof of the building in meters.'),
  roofWidth: z.number().describe('The extracted width of the main roof of the building in meters.'),
});
export type ExtractDimensionsOutput = z.infer<typeof ExtractDimensionsOutputSchema>;


export async function extractDimensions(
  input: ExtractDimensionsInput
): Promise<ExtractDimensionsOutput> {
  return await extractDimensionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractDimensionsPrompt',
  input: { schema: ExtractDimensionsInputSchema },
  output: { schema: ExtractDimensionsOutputSchema },
  prompt: `You are an expert architect who can read building blueprints. Your task is to analyze the provided blueprint image and extract the overall rooftop dimensions.

Identify the main roof of the building. Determine its total length and width in meters. Return only these two values.

Blueprint Image: {{media url=blueprintDataUri}}`,
});

const extractDimensionsFlow = ai.defineFlow(
  {
    name: 'extractDimensionsFlow',
    inputSchema: ExtractDimensionsInputSchema,
    outputSchema: ExtractDimensionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error('Failed to get a response from the AI model.');
    }
    return output;
  }
);
