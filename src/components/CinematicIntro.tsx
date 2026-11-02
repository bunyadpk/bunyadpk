import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { SkipForward } from 'lucide-react';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [mounted, setMounted] = useState(true);
  const finishedRef = useRef(false);

  // Single safety timeout — fires once, never loops.
  useEffect(() => {
    const safety = setTimeout(() => {
      finish();
    }, 14000);
    return () => clearTimeout(safety);
  }, []);

  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setMounted(false);
    onComplete();
  }

  // Permanently unmount — return null, never re-render.
  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center bg-obsidian"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={() => {
          if (!mounted) return;
        }}
      >
        <video
          className="h-full w-full object-cover"
          src="/assets/videos/fainal_bunyaad_intro.mp4"
          autoPlay
          muted
          playsInline
          onEnded={finish}
          onError={finish}
        />
        {/* subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-obsidian/30" />
        {/* loading label */}
        <motion.p
          className="absolute bottom-14 font-mono text-xs tracking-[0.3em] text-cyan/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          INITIALIZING BUNYAD HUD...
        </motion.p>
        {/* skip button */}
        <button
          onClick={finish}
          className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-md border border-cyan/30 px-3 py-1.5 font-mono text-[11px] text-cyan/70 transition hover:border-cyan hover:bg-cyan/10 hover:text-cyan"
        >
          <SkipForward className="h-3.5 w-3.5" /> Skip Intro
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
