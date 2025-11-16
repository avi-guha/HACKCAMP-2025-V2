'use server';

/**
 * @fileOverview This file defines a Genkit flow for decoding the tone of a message.
 *
 * It includes:
 * - `decodeMessageTone`: A function to decode the tone of a message.
 * - `DecodeMessageToneInput`: The input type for the `decodeMessageTone` function.
 * - `DecodeMessageToneOutput`: The output type for the `decodeMessageTone` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DecodeMessageToneInputSchema = z.object({
  message: z.string().describe('The text message to decode the tone of.'),
});
export type DecodeMessageToneInput = z.infer<typeof DecodeMessageToneInputSchema>;

const DecodeMessageToneOutputSchema = z.object({
  tone: z
    .string()
    .describe(
      'The tone of the message (e.g., positive, negative, neutral, sarcastic).' + ' Return only one of these options.'
    ),
});
export type DecodeMessageToneOutput = z.infer<typeof DecodeMessageToneOutputSchema>;

export async function decodeMessageTone(input: DecodeMessageToneInput): Promise<DecodeMessageToneOutput> {
  return decodeMessageToneFlow(input);
}

const decodeMessageTonePrompt = ai.definePrompt({
  name: 'decodeMessageTonePrompt',
  input: {schema: DecodeMessageToneInputSchema},
  output: {schema: DecodeMessageToneOutputSchema},
  prompt: `What is the tone of the following message? Options are: positive, negative, neutral, sarcastic.

Message: {{{message}}}`,
});

const decodeMessageToneFlow = ai.defineFlow(
  {
    name: 'decodeMessageToneFlow',
    inputSchema: DecodeMessageToneInputSchema,
    outputSchema: DecodeMessageToneOutputSchema,
  },
  async input => {
    const {output} = await decodeMessageTonePrompt(input);
    return output!;
  }
);
