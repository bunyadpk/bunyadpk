import { useState, type ReactNode } from 'react';
import {
  Building2,
  Compass,
  FileText,
  Layers,
  MapPin,
  ShieldAlert,
  Sparkles,
  Phone,
  RotateCcw,
  Briefcase,
  PlusCircle,
  Info
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';
import PortalModules from '@/components/PortalModules';

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
}

export default function HudShell({ children, active, onNav, onReplay }: HudShellProps) {
  const [activeModal, setActiveModal] = useState<'about' | 'terms' | 'add-property' | null>(null);

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
              onClick={() => onNav('home')}
              className="group flex items-center gap-2 text-left cursor-pointer"
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
                  onClick={() => onNav(item.id)}
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

          {/* Quick Action Buttons (Add Property, About, Terms) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveModal('add-property')}
              className="btn-cyan flex items-center gap-1 py-1.5 px-3 text-xs font-bold shadow-cyan-glow cursor-pointer"
              title="Add Property Listing"
            >
              <PlusCircle className="h-3.5 w-3.5 text-obsidian" />
              <span className="hidden sm:inline">Add Property</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('about')}
              className="rounded-lg border border-cyan/30 bg-obsidian px-2.5 py-1.5 font-mono text-xs text-cyan hover:bg-cyan/10 transition cursor-pointer flex items-center gap-1"
              title="About Us"
            >
              <Info className="h-3.5 w-3.5" />
              <span className="hidden md:inline">About</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="rounded-lg border border-cyan/30 bg-obsidian px-2.5 py-1.5 font-mono text-xs text-cyan hover:bg-cyan/10 transition cursor-pointer flex items-center gap-1"
              title="Terms & Bylaws"
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
              onClick={() => onNav(item.id)}
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

      {/* Dynamic Popups for About, Terms & Add Property */}
      <PortalModules activeModule={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
