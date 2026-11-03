import { useState, useCallback, useEffect } from 'react';
import CinematicIntro from '@/components/CinematicIntro';
import Ticker from '@/components/Ticker';
import HudShell, { type NavId } from '@/components/HudShell';
import Overview from '@/components/Overview';
import SocietyDirectory from '@/components/SocietyDirectory';
import UtilitySuite from '@/components/UtilitySuite';
import AdminPanel from '@/components/AdminPanel';
import AgentPortal from '@/components/AgentPortal';
import AIWidget from '@/components/AIWidget';
import LeadForm from '@/components/LeadForm';
import LdaDocsHub from '@/components/LdaDocsHub';
import MasterMaps from '@/components/MasterMaps';
import PortalModules from '@/components/PortalModules';
import { Briefcase, ShieldCheck, CheckCircle2 } from 'lucide-react';
import {
  supabase, isSupabaseConfigured, type MaterialRates, DEFAULT_RATES,
} from '@/lib/supabase';
import { CEO_PHONE, CEO_NAME } from '@/lib/constants';

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [active, setActive] = useState<NavId>('home');
  const [rates, setRates] = useState<MaterialRates>(DEFAULT_RATES);
  const [activeModal, setActiveModal] = useState<'about' | 'terms' | 'add-property' | null>(null);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo(0, 0);
  }, []);

  function handleIntroComplete() {
    setIntroDone(true);
    window.scrollTo(0, 0);
  }

  function handleReplayIntro() {
    setIntroDone(false);
    window.scrollTo(0, 0);
  }

  const loadRates = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('material_rates').select('*').eq('id', 1).maybeSingle();
      if (data) setRates(data as MaterialRates);
    }
  }, []);

  useEffect(() => { loadRates(); }, [loadRates]);

  useEffect(() => {
    const sections: NavId[] = ['home', 'directory', 'services', 'suite', 'lda-docs', 'master-maps', 'admin'];
    function onScroll() {
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) { setActive(sections[i]); break; }
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function openAI() {
    window.dispatchEvent(new Event('bunyad:open-ai'));
  }

  return (
    <div className="min-h-screen bg-obsidian text-platinum" style={{ pointerEvents: 'auto' }}>
      {!introDone && <CinematicIntro onComplete={handleIntroComplete} />}

      <Ticker rates={rates} />

      <HudShell onReplay={handleReplayIntro} active={active} onNav={setActive}>
        {/* Command Deck / Home */}
        <section id="home" className="scroll-mt-24">
          <Overview materialCount={4} onOpenAI={openAI} />
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <LeadForm />
            <div className="glass rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-cyan">Why Bunyad?</h3>
                <ul className="mt-3 space-y-2 text-sm text-platinum/70">
                  <li>• 38+ Lahore housing societies with live DC rates &amp; FBR valuations</li>
                  <li>• Real-time civil material rates (cement, steel, bricks, crush)</li>
                  <li>• Gemini-powered AI architectural consultant</li>
                  <li>• 100% escrow milestone protection</li>
                  <li>• Direct access to CEO Taha Mubeen Bhutta</li>
                  <li>• Authorized agent network with verified badges</li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-cyan/15 flex items-center justify-between text-xs font-mono text-cyan/70">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> PEC Category C Registered
                </span>
                <span>LDA Avenue 1, Lahore</span>
              </div>
            </div>
          </div>
        </section>

        {/* 38 Societies Directory */}
        <section id="directory" className="scroll-mt-24">
          <SectionDivider />
          <SocietyDirectory />
        </section>

        {/* Turnkey Services */}
        <section id="services" className="scroll-mt-24">
          <SectionDivider />
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-cyan" />
              <h2 className="font-display text-base font-bold text-platinum">Turnkey Services Suite</h2>
            </div>
          </div>
          <AgentPortal />
        </section>

        {/* PropTech Valuation & Tax */}
        <section id="suite" className="scroll-mt-24">
          <SectionDivider />
          <UtilitySuite rates={rates} />
        </section>

        {/* LDA Docs Hub */}
        <section id="lda-docs" className="scroll-mt-24">
          <SectionDivider />
          <LdaDocsHub />
        </section>

        {/* Avenue 1 Master Maps */}
        <section id="master-maps" className="scroll-mt-24">
          <SectionDivider />
          <MasterMaps />
        </section>

        {/* CEO Executive Desk / Admin */}
        <section id="admin" className="scroll-mt-24">
          <SectionDivider />
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan" />
              <h2 className="font-display text-base font-bold text-platinum">CEO Executive Desk</h2>
            </div>
          </div>
          <AdminPanel rates={rates} onRatesChange={setRates} />
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-cyan/15 text-xs text-platinum/60 space-y-4 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-cyan">
            <button type="button" onClick={() => setActiveModal('about')} className="hover:underline cursor-pointer">
              About BUNYAD.PK
            </button>
            <span>•</span>
            <button type="button" onClick={() => setActiveModal('add-property')} className="hover:underline cursor-pointer">
              Add Property Listing
            </button>
            <span>•</span>
            <button type="button" onClick={() => setActiveModal('terms')} className="hover:underline cursor-pointer">
              Terms &amp; LDA Bylaws
            </button>
            <span>•</span>
            <a href={`tel:${CEO_PHONE}`} className="hover:underline">
              CEO Hotline: 0321-9404812
            </a>
          </div>

          <p className="text-[11px] text-platinum/40">
            &copy; 2026 BUNYAD.PK (بنیاد). All Rights Reserved. Supervised by CEO {CEO_NAME} • Block J, Commercial Broadway, LDA Avenue 1, Lahore.
          </p>
        </footer>
      </HudShell>

      {/* Dynamic Popups for About, Terms & Add Property */}
      <PortalModules activeModule={activeModal} onClose={() => setActiveModal(null)} />

      <AIWidget />
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="my-8 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
  );
}
