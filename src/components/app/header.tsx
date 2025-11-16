import { Feather } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="flex items-center justify-center w-full">
      <div className="flex items-center gap-3 text-center">
        <Feather className="w-8 h-8 text-primary-foreground/80" />
        <h1 className="text-3xl sm:text-4xl font-bold font-headline tracking-tight text-gray-800">
          ToneScribe
        </h1>
      </div>
    </header>
  );
}
