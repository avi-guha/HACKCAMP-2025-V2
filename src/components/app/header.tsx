export function AppHeader() {
  return (
    <header className="flex items-center justify-center w-full">
      <div className="flex items-center gap-3 text-center">
        <svg 
          className="w-10 h-10" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Magnifying glass circle */}
          <circle 
            cx="35" 
            cy="35" 
            r="25" 
            stroke="hsl(271 81% 56%)" 
            strokeWidth="5" 
            fill="none"
          />
          {/* Message bubble inside */}
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
          {/* Message dots */}
          <circle cx="28" cy="34" r="1.5" fill="hsl(271 81% 56%)" />
          <circle cx="35" cy="34" r="1.5" fill="hsl(271 81% 56%)" />
          <circle cx="42" cy="34" r="1.5" fill="hsl(271 81% 56%)" />
          {/* Magnifying glass handle */}
          <line 
            x1="52" 
            y1="52" 
            x2="72" 
            y2="72" 
            stroke="hsl(271 81% 56%)" 
            strokeWidth="5" 
            strokeLinecap="round"
          />
        </svg>
        <h1 className="text-3xl sm:text-4xl font-bold font-headline tracking-tight bg-gradient-to-r from-[hsl(271_81%_56%)] to-[hsl(197_71%_73%)] bg-clip-text text-transparent">
          ToneLens
        </h1>
      </div>
    </header>
  );
}
