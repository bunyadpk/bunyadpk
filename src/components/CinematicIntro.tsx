import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { SkipForward, Volume2, VolumeX } from 'lucide-react';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [mounted, setMounted] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    // 12 second safety cutoff
    const safety = setTimeout(() => {
      finish();
    }, 12000);
    return () => clearTimeout(safety);
  }, []);

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
        transition={{ duration: 0.5 }}
      >
        {!videoFailed ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="./assets/videos/bunyad_intro.mp4"
            autoPlay
            muted={isMuted}
            playsInline
            onEnded={finish}
            onError={() => setVideoFailed(true)}
          />
        ) : (
          <img
            src="./assets/videos/bunyad_intro.gif"
            alt="BUNYAD Intro"
            className="h-full w-full object-cover"
          />
        )}

        {/* Ambient Overlay & Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050b14]/80 via-transparent to-[#050b14]/40" />

        {/* HUD Loading Status */}
        <div className="absolute bottom-14 left-6 flex items-center gap-3">
          <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
          <p className="font-mono text-xs tracking-[0.25em] text-cyan-400">
            INITIALIZING BUNYAD COMMAND CENTER...
          </p>
        </div>

        {/* Controls: Audio Toggle & Skip */}
        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          {!videoFailed && (
            <button
              type="button"
              onClick={toggleSound}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-[#060b13]/80 px-3 py-1.5 font-mono text-[11px] text-cyan-400 backdrop-blur-md transition hover:bg-cyan-400/10 hover:border-cyan-400"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {isMuted ? 'Enable Sound' : 'Sound ON'}
            </button>
          )}

          <button
            type="button"
            onClick={finish}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-cyan-400/50 bg-[#060b13]/90 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-cyan-300 backdrop-blur-md transition hover:bg-cyan-400 hover:text-black shadow-cyan-glow"
          >
            <SkipForward className="h-3.5 w-3.5" /> Skip Intro
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
