'use server';

import { extractTextFromScreenshot } from '@/ai/flows/extract-text-from-screenshot';
import { decodeMessageTone } from '@/ai/flows/decode-message-tone';
import type { AnalysisResult, Tone } from '@/lib/types';

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

    // 3. Concurrently decode tones for each message
    const tonesResults = await Promise.allSettled(
        messageLines.map(line => decodeMessageTone({ message: line }))
      );

    const messagesWithTones = messageLines.map((text, index) => {
      const toneResult = tonesResults[index];
      let tones: Tone[] = [];

      if (toneResult.status === 'fulfilled' && toneResult.value?.tones) {
        tones = toneResult.value.tones;
      } else {
        console.error(`Failed to decode tone for message: "${text}"`);
      }
      
      return { text, tones };
    });

    return {
      success: true,
      data: {
        messages: messagesWithTones,
      },
    };
  } catch (error) {
    console.error('An error occurred during screenshot analysis:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
