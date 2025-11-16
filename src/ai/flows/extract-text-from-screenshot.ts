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
    .describe('A newline-separated string of the extracted text messages in chronological order.'),
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

  Your task is to analyze the provided screenshot of a text message conversation and extract only the text content of the messages themselves.

  - Identify each individual message bubble.
  - Extract the text from each bubble.
  - Order the messages chronologically based on their position in the image (top to bottom).
  - Exclude all other information, such as timestamps, dates, sender/recipient information ("You replied"), and reaction icons.
  - Format the output as a single string, with each message separated by a newline character (\n).

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
