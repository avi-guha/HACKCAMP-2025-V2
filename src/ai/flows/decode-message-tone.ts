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

const ToneDescriptorSchema = z.object({
  word: z.string().describe('A single word that describes the tone of the message (e.g., Joyful, Anxious, Sarcastic).'),
  confidence: z.number().min(0).max(1).describe('A confidence score from 0.0 to 1.0 indicating how strongly the word aligns with the message\'s tone.'),
});

const DecodeMessageToneOutputSchema = z.object({
  tones: z.array(ToneDescriptorSchema).min(2).max(3).describe("An array of 2-3 words that best describe the message's tone, along with a confidence score for each word.")
});
export type DecodeMessageToneOutput = z.infer<typeof DecodeMessageToneOutputSchema>;

export async function decodeMessageTone(input: DecodeMessageToneInput): Promise<DecodeMessageToneOutput> {
  return decodeMessageToneFlow(input);
}

const decodeMessageTonePrompt = ai.definePrompt({
  name: 'decodeMessageTonePrompt',
  input: {schema: DecodeMessageToneInputSchema},
  output: {schema: DecodeMessageToneOutputSchema},
  prompt: `Analyze the tone of the following message. Provide 2-3 descriptive words (e.g., "Excited", "Worried", "Formal") that best capture the tone. For each word, provide a confidence score from 0.0 to 1.0.

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
