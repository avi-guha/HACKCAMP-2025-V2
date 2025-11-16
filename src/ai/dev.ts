import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-conversation-sentiment.ts';
import '@/ai/flows/decode-message-tone.ts';
import '@/ai/flows/extract-text-from-screenshot.ts';