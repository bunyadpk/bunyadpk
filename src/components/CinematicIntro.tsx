import { useState, useRef } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { SkipForward, Volume2, VolumeX } from 'lucide-react';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [mounted, setMounted] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);

  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setMounted(false);
    onComplete();
  }

  function toggleSound() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center bg-[#050b14]"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {!useFallback ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={`${import.meta.env.BASE_URL}assets/videos/bunyad_intro.mp4`}
            autoPlay
            muted={isMuted}
            playsInline
            onEnded={finish}
            onError={() => {
              // Video fail ho toh fallback GIF dikhaye, band na kare
              setUseFallback(true);
            }}
          />
        ) : (
          <img
            src={`${import.meta.env.BASE_URL}assets/videos/bunyad_intro.gif`}
            alt="BUNYAD Intro"
            className="h-full w-full object-cover"
          />
        )}

        {/* Ambient Dark Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050b14]/80 via-transparent to-[#050b14]/30" />

        {/* HUD Scanner Label */}
        <div className="absolute bottom-14 left-6 flex items-center gap-3">
          <span className="h-2.5 w-2.5 animate-ping rounded-full bg-cyan-400" />
          <p className="font-mono text-xs font-semibold tracking-[0.25em] text-cyan-400">
            BUNYAD COMMAND CENTER INITIALIZING...
          </p>
        </div>

        {/* Action Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          {!useFallback && (
            <button
              type="button"
              onClick={toggleSound}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-400/40 bg-[#060b13]/85 px-3 py-1.5 font-mono text-xs text-cyan-300 backdrop-blur-md transition hover:border-cyan-400 hover:bg-cyan-400/20"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-cyan-400" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
              {isMuted ? 'Sound OFF' : 'Sound ON'}
            </button>
          )}

          <button
            type="button"
            onClick={finish}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-400/60 bg-cyan-400/10 px-4 py-1.5 font-mono text-xs font-bold text-cyan-300 backdrop-blur-md transition hover:bg-cyan-400 hover:text-black shadow-cyan-glow"
          >
            <SkipForward className="h-4 w-4" /> Skip Intro
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
