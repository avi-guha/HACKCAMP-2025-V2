export type Tone = 'positive' | 'negative' | 'neutral' | 'sarcastic' | 'unknown';

export type AnalysisResult = {
  messages: {
    text: string;
    tone: Tone;
  }[];
};
