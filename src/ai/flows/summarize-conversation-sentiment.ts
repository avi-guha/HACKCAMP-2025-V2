'use server';
/**
 * @fileOverview Provides an overall sentiment summary of the entire conversation, highlighting key emotional shifts and the general emotional state.
 *
 * - summarizeConversationSentiment - A function that generates a sentiment summary for a given conversation.
 * - SummarizeConversationSentimentInput - The input type for the summarizeConversationSentiment function.
 * - SummarizeConversationSentimentOutput - The return type for the summarizeConversationSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConversationSentimentInputSchema = z.object({
  conversationText: z
    .string()
    .describe('The complete text of the conversation to summarize.'),
});
export type SummarizeConversationSentimentInput = z.infer<
  typeof SummarizeConversationSentimentInputSchema
>;

const SummarizeConversationSentimentOutputSchema = z.object({
  sentimentSummary: z
    .string()
    .describe(
      'A summary of the overall sentiment of the conversation, including key emotional shifts and the general emotional state.'
    ),
});
export type SummarizeConversationSentimentOutput = z.infer<
  typeof SummarizeConversationSentimentOutputSchema
>;

export async function summarizeConversationSentiment(
  input: SummarizeConversationSentimentInput
): Promise<SummarizeConversationSentimentOutput> {
  return summarizeConversationSentimentFlow(input);
}

const summarizeConversationSentimentPrompt = ai.definePrompt({
  name: 'summarizeConversationSentimentPrompt',
  input: {schema: SummarizeConversationSentimentInputSchema},
  output: {schema: SummarizeConversationSentimentOutputSchema},
  prompt: `You are an AI assistant designed to provide a summary of the overall sentiment of a conversation. Please read the following conversation and give a brief overview of the sentiment, key emotional shifts, and the general emotional state conveyed.  Be as concise as possible.

Conversation Text: {{{conversationText}}}`,
});

const summarizeConversationSentimentFlow = ai.defineFlow(
  {
    name: 'summarizeConversationSentimentFlow',
    inputSchema: SummarizeConversationSentimentInputSchema,
    outputSchema: SummarizeConversationSentimentOutputSchema,
  },
  async input => {
    const {output} = await summarizeConversationSentimentPrompt(input);
    return output!;
  }
);
