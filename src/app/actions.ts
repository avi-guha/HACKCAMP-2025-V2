'use server';

import { extractTextFromScreenshot } from '@/ai/flows/extract-text-from-screenshot';
import { decodeMessageTone } from '@/ai/flows/decode-message-tone';
import { summarizeConversationSentiment } from '@/ai/flows/summarize-conversation-sentiment';
import type { AnalysisResult, Tone } from '@/lib/types';

function sanitizeTone(rawTone: string): Tone {
  if (!rawTone) return 'unknown';
  const lowerTone = rawTone.toLowerCase().trim().replace(/[.,]/g, '');

  if (lowerTone.includes('positive')) return 'positive';
  if (lowerTone.includes('negative')) return 'negative';
  if (lowerTone.includes('neutral')) return 'neutral';
  if (lowerTone.includes('sarcastic')) return 'sarcastic';
  
  return 'unknown';
}


export async function analyzeScreenshotAction(
  photoDataUri: string
): Promise<{ success: true; data: AnalysisResult } | { success: false; error: string }> {
  try {
    // 1. Extract text from the screenshot
    const extractionResult = await extractTextFromScreenshot({ photoDataUri });
    const fullText = extractionResult?.extractedText;

    if (!fullText || fullText.trim().length === 0) {
      return { success: false, error: 'Could not extract any text from the image. Please try a clearer screenshot.' };
    }

    // 2. Split text into individual messages, filtering out empty lines
    const messageLines = fullText.split('\n').filter(line => line.trim() !== '');
    if (messageLines.length === 0) {
        return { success: false, error: 'No individual message lines found in the extracted text.' };
    }

    // 3. Concurrently get summary and decode tones
    const [summaryResult, tonesResults] = await Promise.all([
      summarizeConversationSentiment({ conversationText: fullText }),
      Promise.allSettled(
        messageLines.map(line => decodeMessageTone({ message: line }))
      ),
    ]);

    const summary = summaryResult?.sentimentSummary || 'Could not generate a summary.';

    const messagesWithTones = messageLines.map((text, index) => {
      const toneResult = tonesResults[index];
      let tone: Tone = 'unknown';

      if (toneResult.status === 'fulfilled' && toneResult.value?.tone) {
        tone = sanitizeTone(toneResult.value.tone);
      } else {
        console.error(`Failed to decode tone for message: "${text}"`);
      }
      
      return { text, tone };
    });

    return {
      success: true,
      data: {
        summary,
        messages: messagesWithTones,
      },
    };
  } catch (error) {
    console.error('An error occurred during screenshot analysis:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
