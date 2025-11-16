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
    <div className={cn("min-w-[280px] rounded-2xl bg-[#5a6088]/80 p-4 shadow-sm", className)}>
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-[#a8c5db] capitalize text-lg">{tone.word}</span>
        <span className="text-[#a8c5db] font-semibold text-lg">{confidencePercentage}%</span>
      </div>
      <div className="h-2 bg-[#3d4464]/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[hsl(271_81%_56%)] to-[hsl(197_71%_73%)] rounded-full transition-all duration-300"
          style={{ width: `${confidencePercentage}%` }}
        />
      </div>
    </div>
  );
}
