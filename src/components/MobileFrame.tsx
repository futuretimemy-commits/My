import React, { ReactNode } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  // Get current time formatted for mobile status bar (e.g., 09:41)
  const formatTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-[#080b11] flex items-center justify-center p-0 md:p-6 select-none overflow-x-hidden">
      {/* Outer Widescreen Phone Wrapper */}
      <div className="relative w-full max-w-md md:h-[840px] md:rounded-[48px] bg-[#0b0f17] border-0 md:border-8 md:border-[#1e293b] md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden md:aspect-[9/19.5]">
        
        {/* Widescreen Phone Status Bar / Notch */}
        <div className="hidden md:flex absolute top-0 inset-x-0 h-8 justify-center z-50 pointer-events-none">
          <div className="w-36 h-4 bg-[#1e293b] rounded-b-2xl" />
        </div>

        {/* Dynamic Mobile Status Bar (Always visible) */}
        <div className="flex justify-between items-center px-6 pt-3 pb-1 text-[11px] font-medium tracking-tight text-gray-400 bg-[#0b0f17] z-40 shrink-0">
          <span className="font-mono text-xs">{formatTime()}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <Battery className="w-4 h-4 rotate-0" />
            </div>
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Widescreen Phone Home Indicator */}
        <div className="hidden md:flex justify-center items-center pb-2 bg-[#0b0f17] shrink-0">
          <div className="w-32 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
