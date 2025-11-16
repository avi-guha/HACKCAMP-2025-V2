'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/app/header';
import { ScreenshotUploader } from '@/components/app/screenshot-uploader';
import { AnalysisResults } from '@/components/app/analysis-results';
import { AnalysisSkeleton } from '@/components/app/skeletons';
import type { AnalysisResult } from '@/lib/types';
import { analyzeScreenshotAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isAnalyzing, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFileSelect = (file: File | null) => {
    if (result) setResult(null);
    if (error) setError(null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setScreenshotPreview(null);
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

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8">
      <AppHeader />
      <main className="w-full max-w-2xl mx-auto flex flex-col gap-8 mt-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Conversation Analysis</CardTitle>
             <CardDescription>
              Upload a screenshot of a text message conversation to get started, or try the interactive playground.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScreenshotUploader
              onFileSelect={handleFileSelect}
              onAnalyze={handleAnalysis}
              isAnalyzing={isAnalyzing}
              screenshotPreview={screenshotPreview}
            />
             <div className="flex justify-center">
              <Button asChild variant="outline">
                <Link href="/playground">
                  <Edit className="mr-2 h-4 w-4" /> Go to Tone Playground
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {isAnalyzing && <AnalysisSkeleton />}
        
        {result && <AnalysisResults result={result} />}
        
      </main>
    </div>
  );
}
