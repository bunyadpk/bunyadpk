import { useState, useRef } from 'react';
import { SkipForward, Volume2, VolumeX } from 'lucide-react';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleSound() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050b14]">
      {/* 10-Second Cinematic Video */}
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="./assets/videos/bunyad_intro.mp4"
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={onComplete}
      />

      {/* Cyber Ambient Shadow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050b14]/90 via-transparent to-[#050b14]/40" />

      {/* Futuristic Status Bar */}
      <div className="absolute bottom-12 left-6 flex items-center gap-3">
        <span className="h-3 w-3 animate-ping rounded-full bg-cyan-400" />
        <p className="font-mono text-xs font-bold tracking-[0.25em] text-cyan-400">
          BUNYAD COMMAND CENTER INITIALIZING...
        </p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3 z-50">
        <button
          type="button"
          onClick={toggleSound}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-400/50 bg-[#060b13]/90 px-3.5 py-2 font-mono text-xs text-cyan-300 shadow-lg backdrop-blur-md transition hover:border-cyan-400 hover:bg-cyan-400/20"
        >
          {isMuted ? <VolumeX className="h-4 w-4 text-cyan-400" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
          {isMuted ? 'Enable Audio' : 'Sound ON'}
        </button>

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
