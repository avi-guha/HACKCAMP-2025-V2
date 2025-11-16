'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Home, Loader2 } from 'lucide-react';
import { AppHeader } from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToneDisplay } from '@/components/app/tone-display';
import { analyzeMessageAction } from '@/app/actions';
import type { Tone } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Simple debounce function
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

export default function PlaygroundPage() {
  const [message, setMessage] = useState('');
  const [tones, setTones] = useState<Tone[]>([]);
  const [isAnalyzing, startTransition] = useTransition();
  const { toast } = useToast();

  const analyzeMessage = useCallback((text: string) => {
    startTransition(async () => {
      const res = await analyzeMessageAction(text);
      if (res.success) {
        setTones(res.tones);
      } else {
        setTones([]);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: res.error,
        });
      }
    });
  }, [toast]);

  const debouncedAnalysis = useCallback(debounce(analyzeMessage, 500), [analyzeMessage]);

  useEffect(() => {
    if (message.trim().length > 0) {
      debouncedAnalysis(message);
    } else {
      setTones([]);
    }
  }, [message, debouncedAnalysis]);


  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8">
      <AppHeader />
      <main className="w-full max-w-2xl mx-auto flex flex-col gap-8 mt-8">
        <div className="flex justify-start">
            <Button asChild variant="outline">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Tone Playground</CardTitle>
            <CardDescription>
              Type a message below and see its tone analyzed in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] text-base"
            />
            <div className="min-h-[60px] flex flex-col justify-center">
              {isAnalyzing ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tones.map((tone, toneIndex) => (
                    <ToneDisplay key={toneIndex} tone={tone} />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
