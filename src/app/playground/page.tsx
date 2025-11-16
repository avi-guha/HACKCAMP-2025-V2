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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#3d4464]">
      {/* Back button */}
      <button className="absolute top-6 left-6 text-white">
        <Link href="/">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </button>

      {/* Logo in top right */}
      <div className="absolute top-6 right-6">
        <svg 
          className="w-10 h-10" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle 
            cx="35" 
            cy="35" 
            r="25" 
            stroke="hsl(197 71% 73%)" 
            strokeWidth="5" 
            fill="none"
          />
          <rect 
            x="22" 
            y="26" 
            width="26" 
            height="16" 
            rx="3" 
            fill="hsl(197 71% 73%)"
          />
          <path 
            d="M 30 42 L 28 46 L 32 42 Z" 
            fill="hsl(197 71% 73%)"
          />
          <circle cx="28" cy="34" r="1.5" fill="hsl(271 81% 56%)" />
          <circle cx="35" cy="34" r="1.5" fill="hsl(271 81% 56%)" />
          <circle cx="42" cy="34" r="1.5" fill="hsl(271 81% 56%)" />
          <line 
            x1="52" 
            y1="52" 
            x2="72" 
            y2="72" 
            stroke="hsl(197 71% 73%)" 
            strokeWidth="5" 
            strokeLinecap="round"
          />
        </svg>
      </div>

      <main className="w-full max-w-md mx-auto flex flex-col items-center gap-12">
        {/* Title */}
        <h1 className="text-4xl font-light text-center text-[#a8c5db] tracking-wide">
          analyze your<br />text
        </h1>

        {/* Input Container */}
        <div className="w-full relative">
          <Textarea
            placeholder="Write or paste your text here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full min-h-[200px] bg-[#5a6088] border-none rounded-3xl p-6 text-white placeholder:text-[#a8c5db]/60 resize-none focus-visible:ring-2 focus-visible:ring-[hsl(197_71%_73%)] focus-visible:ring-offset-0"
          />
          
          {/* Message icon in bottom right of textarea */}
          <div className="absolute bottom-4 right-4">
            <svg className="w-6 h-6 text-[#a8c5db]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>

        {/* Results */}
        {isAnalyzing ? (
          <div className="flex items-center gap-2 text-[#a8c5db]">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Analyzing...</span>
          </div>
        ) : tones.length > 0 && (
          <div className="w-full flex flex-wrap gap-2 justify-center">
            {tones.map((tone, toneIndex) => (
              <ToneDisplay key={toneIndex} tone={tone} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
