import { useEffect, useRef } from 'react';
import { SkipForward } from 'lucide-react';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Force sound ON and play
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        // Agar browser autoplay sound block kare, tabhi muted play kare
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050b14]">
      {/* 10-Second Cinematic Video with Permanent Sound */}
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="./assets/videos/bunyad_intro.mp4"
        autoPlay
        playsInline
        onEnded={onComplete}
      />

      {/* Cyber Ambient Shadow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050b14]/90 via-transparent to-[#050b14]/40" />

      {/* HUD Scanner Status */}
      <div className="absolute bottom-12 left-6 flex items-center gap-3">
        <span className="h-3 w-3 animate-ping rounded-full bg-cyan-400" />
        <p className="font-mono text-xs font-bold tracking-[0.25em] text-cyan-400">
          BUNYAD COMMAND CENTER INITIALIZING...
        </p>
      </div>

      {/* Skip Button */}
      <div className="absolute bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={onComplete}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-400 bg-cyan-500/20 px-4 py-2 font-mono text-xs font-bold text-cyan-200 shadow-cyan-glow backdrop-blur-md transition hover:bg-cyan-400 hover:text-black"
        >
          <SkipForward className="h-4 w-4" /> Skip Intro
        </button>
      </div>
    </div>
  );
}
