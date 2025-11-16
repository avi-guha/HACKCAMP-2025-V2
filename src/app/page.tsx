'use client';

import { useState, useTransition, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/app/header';
import { ScreenshotUploader } from '@/components/app/screenshot-uploader';
import { AnalysisResults } from '@/components/app/analysis-results';
import { AnalysisSkeleton } from '@/components/app/skeletons';
import { ToneDisplay } from '@/components/app/tone-display';
import type { AnalysisResult, Tone } from '@/lib/types';
import { analyzeScreenshotAction, analyzeMessageAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Loader2 } from 'lucide-react';

// Debounce function
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

type ViewMode = 'input' | 'text-analysis' | 'image-analysis';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('input');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isAnalyzing, startTransition] = useTransition();
  const [textInput, setTextInput] = useState('');
  const [tones, setTones] = useState<Tone[]>([]);
  const [isAnalyzingText, startTextTransition] = useTransition();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Real-time text analysis
  const analyzeText = useCallback((text: string) => {
    startTextTransition(async () => {
      const res = await analyzeMessageAction(text);
      if (res.success) {
        setTones(res.tones);
      } else {
        setTones([]);
      }
    });
  }, []);

  const debouncedAnalysis = useCallback(debounce(analyzeText, 500), [analyzeText]);

  useEffect(() => {
    if (textInput.trim().length > 0) {
      debouncedAnalysis(textInput);
      if (viewMode === 'input') {
        setViewMode('text-analysis');
      }
    } else {
      setTones([]);
    }
  }, [textInput, debouncedAnalysis, viewMode]);

  // Auto-focus textarea when switching to text-analysis view
  useEffect(() => {
    if (viewMode === 'text-analysis' && textareaRef.current) {
      const textarea = textareaRef.current;
      const length = textarea.value.length;
      textarea.focus();
      textarea.setSelectionRange(length, length);
    }
  }, [viewMode]);

  const handleFileSelect = (file: File | null) => {
    if (result) setResult(null);
    if (error) setError(null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
        setViewMode('image-analysis');
        setTextInput(''); // Clear text input when uploading image
      };
      reader.readAsDataURL(file);
    } else {
      setScreenshotPreview(null);
      setViewMode('input');
    }
  };

  const handleAnalysis = () => {
    if (!screenshotPreview) return;

    setError(null);
    setResult(null);

    startTransition(async () => {
      const res = await analyzeScreenshotAction(screenshotPreview);
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.error);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: res.error,
        });
      }
    });
  };

  const handleBack = () => {
    setViewMode('input');
    setTextInput('');
    setTones([]);
    setScreenshotPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#3d4464]">
      {/* Back button - show when not on input view */}
      {viewMode !== 'input' && (
        <button 
          onClick={handleBack}
          className="absolute top-6 left-6 text-white hover:text-[hsl(197_71%_73%)] transition-colors"
          aria-label="Go back"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

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

      {/* Input View */}
      {viewMode === 'input' && (
        <main className="w-full max-w-md mx-auto flex flex-col items-center gap-12">
          {/* Title */}
          <h1 className="text-4xl font-light text-center text-[#a8c5db] tracking-wide">
            analyze your<br />text
          </h1>

          {/* Input Container */}
          <div className="w-full relative">
            <textarea
              ref={textareaRef}
              placeholder="Write or paste your text here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full min-h-[200px] bg-[#5a6088] border-none rounded-3xl p-6 text-white placeholder:text-[#a8c5db]/60 resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(197_71%_73%)]"
            />
            
            {/* Message icon in bottom right of textarea */}
            <div className="absolute bottom-4 right-4">
              <svg className="w-6 h-6 text-[#a8c5db]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>

          {/* Screenshot Upload Option */}
          <div className="w-full">
            <p className="text-[#a8c5db]/80 text-center mb-4 text-sm">or upload a screenshot</p>
            <ScreenshotUploader
              onFileSelect={handleFileSelect}
              onAnalyze={handleAnalysis}
              isAnalyzing={isAnalyzing}
              screenshotPreview={screenshotPreview}
            />
          </div>
        </main>
      )}

      {/* Text Analysis View */}
      {viewMode === 'text-analysis' && (
        <main className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
          <h1 className="text-4xl font-light text-center text-[#a8c5db] tracking-wide">
            tone analysis
          </h1>

          {/* Input Container */}
          <div className="w-full relative">
            <textarea
              ref={textareaRef}
              placeholder="Write or paste your text here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full min-h-[200px] bg-[#5a6088] border-none rounded-3xl p-6 text-white placeholder:text-[#a8c5db]/60 resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(197_71%_73%)]"
            />
            
            <div className="absolute bottom-4 right-4">
              <svg className="w-6 h-6 text-[#a8c5db]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>

          {/* Tone Results */}
          <div className="w-full min-h-[100px] flex flex-col items-center justify-center">
            {isAnalyzingText ? (
              <div className="flex items-center gap-2 text-[#a8c5db]">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : tones.length > 0 ? (
              <div className="w-full space-y-4">
                <p className="text-[#a8c5db] text-center text-sm">Detected tones:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {tones.map((tone, index) => (
                    <ToneDisplay key={index} tone={tone} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </main>
      )}

      {/* Image Analysis View */}
      {viewMode === 'image-analysis' && (
        <main className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
          <h1 className="text-4xl font-light text-center text-[#a8c5db] tracking-wide">
            screenshot<br />analysis
          </h1>

          <ScreenshotUploader
            onFileSelect={handleFileSelect}
            onAnalyze={handleAnalysis}
            isAnalyzing={isAnalyzing}
            screenshotPreview={screenshotPreview}
          />

          {isAnalyzing && <AnalysisSkeleton />}
          {result && <AnalysisResults result={result} />}
        </main>
      )}
    </div>
  );
}
