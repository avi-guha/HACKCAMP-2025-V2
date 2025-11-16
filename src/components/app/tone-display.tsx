import { Badge } from "@/components/ui/badge";
import { Smile, Frown, Meh, MessageSquareQuote, HelpCircle } from "lucide-react";
import type { Tone } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ToneDisplayProps {
  tone: Tone;
  className?: string;
}

const toneConfig = {
  positive: {
    label: 'Positive',
    Icon: Smile,
    className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  },
  negative: {
    label: 'Negative',
    Icon: Frown,
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  },
  neutral: {
    label: 'Neutral',
    Icon: Meh,
    className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
  },
  sarcastic: {
    label: 'Sarcastic',
    Icon: MessageSquareQuote,
    className: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  },
  unknown: {
    label: 'Unknown',
    Icon: HelpCircle,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  },
};

export function ToneDisplay({ tone, className }: ToneDisplayProps) {
  const config = toneConfig[tone] || toneConfig.unknown;

  return (
    <Badge variant="outline" className={cn("capitalize text-xs font-medium px-2 py-1", config.className, className)}>
      <config.Icon className="h-3.5 w-3.5 mr-1.5" />
      {config.label}
    </Badge>
  );
}
