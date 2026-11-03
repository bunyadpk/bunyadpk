import { useState, useEffect, type ReactNode } from 'react';
import {
  Building2,
  Compass,
  FileText,
  Layers,
  MapPin,
  Briefcase,
  PlusCircle,
  Info,
  Phone,
  ArrowUp
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME } from '@/lib/constants';

export type NavId =
  | 'home'
  | 'directory'
  | 'services'
  | 'suite'
  | 'lda-docs'
  | 'master-maps'
  | 'admin';

interface HudShellProps {
  children: ReactNode;
  active: NavId;
  onNav: (id: NavId) => void;
  onReplay?: () => void;
  onOpenModal?: (module: 'about' | 'terms' | 'add-property') => void;
}

export default function HudShell({ children, active, onNav, onReplay, onOpenModal }: HudShellProps) {
  const [showBackToHome, setShowBackToHome] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 250) {
        setShowBackToHome(true);
      } else {
        setShowBackToHome(false);
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleGoHome() {
    onNav('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSectionNav(id: NavId) {
    onNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const navItems: { id: NavId; label: string; icon: any }[] = [
    { id: 'home', label: 'Command', icon: Building2 },
    { id: 'directory', label: '38 Societies', icon: Layers },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'suite', label: 'Valuation', icon: Compass },
    { id: 'lda-docs', label: 'LDA Docs', icon: FileText },
    { id: 'master-maps', label: 'Master Maps', icon: MapPin },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Top Fixed Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-cyan/20 bg-obsidian/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGoHome}
              className="group flex items-center gap-2 text-left cursor-pointer"
              title="Return to Home (Command)"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan/40 bg-cyan/10 shadow-cyan-glow group-hover:scale-105 transition">
                <Building2 className="h-5 w-5 text-cyan" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-display text-sm font-black tracking-wider text-platinum">
                  <span>BUNYAD</span>
                  <span className="text-cyan text-xs font-bold font-sans">بنیاد</span>
                </div>
                <div className="text-[9px] font-mono text-platinum/50 uppercase">
                  PropTech &bull; CEO {CEO_NAME}
                </div>
              </div>
            </button>
          </div>

          {/* Central Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSectionNav(item.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-xs transition cursor-pointer ${
                    isActive
                      ? 'border border-cyan/40 bg-cyan/15 text-cyan shadow-cyan-glow font-bold'
                      : 'text-platinum/70 hover:border-cyan/20 hover:text-platinum'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenModal && onOpenModal('add-property')}
              className="btn-cyan flex items-center gap-1 py-1.5 px-3 text-xs font-bold shadow-cyan-glow cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5 text-obsidian" />
              <span className="hidden sm:inline">Add Property</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenModal && onOpenModal('about')}
              className="rounded-lg border border-cyan/30 bg-obsidian px-2.5 py-1.5 font-mono text-xs text-cyan hover:bg-cyan/10 transition cursor-pointer flex items-center gap-1"
            >
              <Info className="h-3.5 w-3.5" />
              <span className="hidden md:inline">About</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenModal && onOpenModal('terms')}
              className="rounded-lg border border-cyan/30 bg-obsidian px-2.5 py-1.5 font-mono text-xs text-cyan hover:bg-cyan/10 transition cursor-pointer flex items-center gap-1"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Terms</span>
            </button>

            <a
              href={`tel:${CEO_PHONE}`}
              className="hidden xl:flex items-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-950/30 px-2.5 py-1.5 font-mono text-xs text-emerald-400"
            >
              <Phone className="h-3 w-3" />
              <span>0321-9404812</span>
            </a>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto border-t border-cyan/10 px-4 py-1.5 gap-2 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSectionNav(item.id)}
              className={`whitespace-nowrap px-2.5 py-1 font-mono text-[11px] rounded-md transition ${
                active === item.id
                  ? 'bg-cyan/20 text-cyan border border-cyan/30 font-bold'
                  : 'text-platinum/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Page Body Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {children}
      </main>

      {/* Floating "Back to Home" Button */}
      {showBackToHome && (
        <button
          type="button"
          onClick={handleGoHome}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-cyan/50 bg-obsidian/95 px-4 py-2.5 text-xs font-mono font-bold text-cyan shadow-cyan-glow backdrop-blur-md transition-all hover:bg-cyan hover:text-obsidian hover:scale-105 cursor-pointer"
        >
          <ArrowUp className="h-4 w-4 animate-bounce" />
          <span>Back to Home</span>
        </button>
      )}
    </div>
  );
}
