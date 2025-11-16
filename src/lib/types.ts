export type Tone = 'positive' | 'negative' | 'neutral' | 'sarcastic' | 'unknown';

export type AnalysisResult = {
  summary: string;
  messages: {
    text: string;
    tone: Tone;
  }[];
};
