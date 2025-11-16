import { Progress } from "@/components/ui/progress";
import type { Tone } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ToneDisplayProps {
  tone: Tone;
  className?: string;
}

export function ToneDisplay({ tone, className }: ToneDisplayProps) {
  const confidencePercentage = Math.round(tone.confidence * 100);

  return (
    <div className={cn("w-36 rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs", className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-gray-700 capitalize">{tone.word}</span>
        <span className="text-gray-500">{confidencePercentage}%</span>
      </div>
      <Progress value={confidencePercentage} className="h-1.5" />
    </div>
  );
}
