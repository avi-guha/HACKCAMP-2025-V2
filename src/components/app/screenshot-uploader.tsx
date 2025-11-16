'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { UploadCloud, FileImage, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ScreenshotUploaderProps {
  onFileSelect: (file: File | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  screenshotPreview: string | null;
}

export function ScreenshotUploader({
  onFileSelect,
  onAnalyze,
  isAnalyzing,
  screenshotPreview,
}: ScreenshotUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload an image file (e.g., PNG, JPG).',
        });
        return;
      }
      onFileSelect(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <label
        htmlFor="screenshot-upload"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200',
          isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/80 hover:bg-gray-50'
        )}
      >
        <input
          ref={fileInputRef}
          id="screenshot-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        <div className="text-center p-4">
          <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-primary/90">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </label>

      {screenshotPreview && (
        <div className="w-full max-w-sm p-2 border rounded-lg bg-white shadow-inner">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 px-1">
            <FileImage className="h-4 w-4 text-gray-500" />
            <span>Preview</span>
          </div>
          <Image
            src={screenshotPreview}
            alt="Screenshot preview"
            width={400}
            height={400}
            className="rounded-md object-contain w-full h-auto max-h-80"
          />
        </div>
      )}

      <Button
        onClick={onAnalyze}
        disabled={!screenshotPreview || isAnalyzing}
        size="lg"
        className="w-full sm:w-auto"
      >
        {isAnalyzing ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-5 w-5" />
        )}
        Analyze Tone
      </Button>
    </div>
  );
}
