import type { AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ToneDisplay } from './tone-display';
import { MessageCircle } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <MessageCircle className="h-6 w-6 text-accent-foreground" />
            Conversation Breakdown
          </CardTitle>
          <CardDescription>The decoded tone of each message in the conversation.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full pr-4">
            <div className="space-y-6">
              {result.messages.map((message, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <p className="text-sm text-gray-800 flex-grow">{message.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {message.tones.map((tone, toneIndex) => (
                      <ToneDisplay key={toneIndex} tone={tone} />
                    ))}
                  </div>
                  {index < result.messages.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
