export type Tone = {
  word: string;
  confidence: number;
};

export type AnalysisResult = {
  messages: {
    text: string;
    tones: Tone[];
  }[];
};
