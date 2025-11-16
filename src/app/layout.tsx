import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'ToneLens',
  description: 'Analyze the tone of your text message conversations.',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="35" cy="35" r="25" stroke="%23a8c5db" stroke-width="5" fill="none"/><rect x="22" y="26" width="26" height="16" rx="3" fill="%23a8c5db"/><path d="M 30 42 L 28 46 L 32 42 Z" fill="%23a8c5db"/><circle cx="28" cy="34" r="1.5" fill="%235a6088"/><circle cx="35" cy="34" r="1.5" fill="%235a6088"/><circle cx="42" cy="34" r="1.5" fill="%235a6088"/><line x1="52" y1="52" x2="72" y2="72" stroke="%23a8c5db" stroke-width="5" stroke-linecap="round"/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
