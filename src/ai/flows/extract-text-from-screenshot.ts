'use server';

/**
 * @fileOverview Extracts text from a screenshot image using AI.
 *
 * - extractTextFromScreenshot - Extracts text from a screenshot and returns it.
 * - ExtractTextFromScreenshotInput - The input type for the extractTextFromScreenshot function.
 * - ExtractTextFromScreenshotOutput - The return type for the extractTextFromScreenshot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextFromScreenshotInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A screenshot of a text message conversation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromScreenshotInput = z.infer<
  typeof ExtractTextFromScreenshotInputSchema
>;

const ExtractTextFromScreenshotOutputSchema = z.object({
  extractedText: z
    .string()
    .describe('The extracted text from the screenshot.'),
});
export type ExtractTextFromScreenshotOutput = z.infer<
  typeof ExtractTextFromScreenshotOutputSchema
>;

export async function extractTextFromScreenshot(
  input: ExtractTextFromScreenshotInput
): Promise<ExtractTextFromScreenshotOutput> {
  return extractTextFromScreenshotFlow(input);
}

const extractTextFromScreenshotPrompt = ai.definePrompt({
  name: 'extractTextFromScreenshotPrompt',
  input: {schema: ExtractTextFromScreenshotInputSchema},
  output: {schema: ExtractTextFromScreenshotOutputSchema},
  prompt: `You are an AI assistant that extracts text from images.

  Extract the text from the following image of a text message conversation:

  {{media url=photoDataUri}}
  `,
});

const extractTextFromScreenshotFlow = ai.defineFlow(
  {
    name: 'extractTextFromScreenshotFlow',
    inputSchema: ExtractTextFromScreenshotInputSchema,
    outputSchema: ExtractTextFromScreenshotOutputSchema,
  },
  async input => {
    const {output} = await extractTextFromScreenshotPrompt(input);
    return output!;
  }
);
