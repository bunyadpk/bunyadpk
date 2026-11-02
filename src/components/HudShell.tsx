import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import {
  Phone, RotateCw, Menu, X, LayoutGrid, Map, Calculator, Briefcase, Shield, Home,
} from 'lucide-react';
import { CEO_NAME, CEO_PHONE, waLink } from '@/lib/constants';

export type NavId = 'home' | 'directory' | 'services' | 'suite' | 'lda-docs' | 'master-maps' | 'admin';

type NavItem = { id: NavId; label: string; icon: typeof Home };

const NAV: NavItem[] = [
  { id: 'home', label: 'Command', icon: Home },
  { id: 'directory', label: '38 Societies', icon: Map },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'suite', label: 'Valuation', icon: Calculator },
  { id: 'lda-docs', label: 'LDA Docs', icon: LayoutGrid },
  { id: 'master-maps', label: 'Master Maps', icon: Map },
  { id: 'admin', label: 'CEO Desk', icon: Shield },
];

const HEADER_OFFSET = 90;

function scrollToId(id: NavId) {
  const element = document.getElementById(id);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export default function HudShell({
  onReplay, active, onNav, children,
}: {
  onReplay: () => void;
  active: NavId;
  onNav: (id: NavId) => void;
  children: ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  function handleNav(id: NavId) {
    onNav(id);
    scrollToId(id);
    setIsMenuOpen(false);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-obsidian text-platinum">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 grid-bg opacity-40 animate-grid-pan" />
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan/5 blur-[120px]" />
        <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-cobalt/20 blur-[90px]" />
        <motion.div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/10" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan shadow-cyan-glow" />
        </motion.div>
        <motion.div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/5" animate={{ rotate: -360 }} transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}>
          <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cobalt" />
        </motion.div>
      </div>

      <header className="sticky top-0 z-50 border-b border-cyan/20 bg-[#050b14]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 max-w-[44px] max-h-[44px] shrink-0 items-center justify-center rounded-xl border border-cyan-400/50 bg-[#060b13] p-1 shadow-cyan-glow">
              {!logoFailed ? (
                <img
                  src="./assets/images/bunyad.pk%20logo.jpg"
                  alt="BUNYAD logo"
                  className="h-full w-full rounded-lg object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className="font-display text-2xl font-black italic text-cyan neon-text">B</span>
              )}
            </div>
            <div className="min-w-0 leading-tight">
              <h1 className="truncate font-display text-base font-black tracking-wider text-cyan neon-text sm:text-lg">
                BUNYAD <span className="text-cyan/70">بنیاد</span>
              </h1>
              <p className="truncate font-mono text-[8px] tracking-[0.08em] text-cyan/60 sm:text-[9px]">
                Bin Taha Associates &amp; Builders • CEO {CEO_NAME}
              </p>
            </div>
          </div>

          {/* Desktop & Laptop Navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`z-10 flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition ${
                  active === item.id
                    ? 'bg-cyan/15 text-cyan border border-cyan/40 shadow-cyan-glow'
                    : 'text-platinum/70 hover:bg-cyan/5 hover:text-cyan'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" /> {item.label}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onReplay}
              className="hidden cursor-pointer items-center gap-1.5 rounded-md border border-cyan/30 px-2.5 py-1.5 text-xs text-cyan transition hover:bg-cyan/10 sm:flex"
            >
              <RotateCw className="h-3.5 w-3.5" /> Replay
            </button>
            <a
              href={waLink(`Asalam o Alaikum, I'm interested in BUNYAD. Please connect me with CEO ${CEO_NAME}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="z-10 flex cursor-pointer items-center gap-1.5 rounded-md bg-cyan/90 px-3 py-1.5 text-xs font-semibold text-obsidian transition hover:bg-cyan hover:shadow-cyan-glow"
            >
              <Phone className="h-3.5 w-3.5" /> CEO
            </a>
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((value) => !value)}
              className="z-[70] cursor-pointer rounded-md p-1.5 md:hidden text-cyan hover:bg-cyan/10"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-out drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-3 top-[calc(100%+8px)] z-[60] w-[min(88vw,320px)] rounded-2xl border border-cyan/30 bg-[#060b13] p-3 shadow-2xl shadow-cyan/20 md:hidden"
                aria-label="Mobile navigation"
              >
                {NAV.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active === item.id ? 'bg-cyan/15 text-cyan font-bold' : 'text-platinum/80 hover:bg-cyan/10 hover:text-cyan'
                    }`}
                  >
                    <item.icon className="h-4 w-4" /> {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    onReplay();
                    setIsMenuOpen(false);
                  }}
                  className="mt-2 flex w-full cursor-pointer items-center gap-3 border-t border-cyan/15 px-3 py-2.5 text-sm text-cyan/80 hover:text-cyan"
                >
                  <RotateCw className="h-4 w-4" /> Replay Intro
                </button>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>

      <div className="relative z-10 flex justify-center px-4 pt-3">
        <span className="chip border border-cyan/30 bg-cyan/5 px-3 py-1 rounded-full text-xs text-cyan/90 font-mono tracking-wider">
          POWERED BY BIN TAHA ASSOCIATES &amp; BUILDERS · بن طہٰ ایسوسی ایٹس
        </span>
      </div>
      <main className="relative z-10 mx-auto max-w-[1400px] px-4 py-6">{children}</main>
      <footer className="relative z-10 mt-8 border-t border-cyan/15 px-4 py-6 text-center">
        <p className="font-mono text-[11px] text-cyan/50">
          BUNYAD.PK · CEO {CEO_NAME} (طہٰ مبین بھٹہ) · {CEO_PHONE} · Block J, LDA Avenue 1, Lahore
        </p>
        <p className="mt-1 font-mono text-[10px] text-platinum/40">
          © 2026 Bin Taha Associates &amp; Builders · All rights reserved
        </p>
      </footer>
    </div>
  );
}
