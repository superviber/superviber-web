'use client';

import { forwardRef } from 'react';

interface VideoPlayerProps {
  className?: string;
}

export const VideoPlayer = forwardRef<HTMLDivElement, VideoPlayerProps>(
  function VideoPlayer({ className = '' }, ref) {
    return (
      <div className={`relative w-full ${className}`}>
        {/* 16:9 aspect ratio container with proper iframe containment */}
        <div className="relative w-full pt-[56.25%] bg-black lg:rounded-lg overflow-hidden">
          <div
            ref={ref}
            className="absolute inset-0 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:!w-full [&>iframe]:!h-full"
          />
        </div>
      </div>
    );
  }
);
