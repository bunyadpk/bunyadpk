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
import { Briefcase, ShieldCheck } from 'lucide-react';
import {
  supabase, isSupabaseConfigured, type MaterialRates, DEFAULT_RATES,
} from '@/lib/supabase';

export default function App() {
  const [introDone, setIntroDone] = useState(true);
  const [active, setActive] = useState<NavId>('home');
  const [rates, setRates] = useState<MaterialRates>(DEFAULT_RATES);

  const loadRates = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('material_rates').select('*').eq('id', 1).maybeSingle();
      if (data) setRates(data as MaterialRates);
    }
  }, []);

  useEffect(() => { loadRates(); }, [loadRates]);

  // track scroll position to update active nav
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
    <div className="min-h-screen bg-obsidian" style={{ pointerEvents: 'auto' }}>
      {!introDone && <CinematicIntro onComplete={() => setIntroDone(true)} />}

      <Ticker rates={rates} />

      <HudShell onReplay={() => setIntroDone(false)} active={active} onNav={setActive}>
        {/* Command Deck / Home */}
        <section id="home" className="scroll-mt-24">
          <Overview materialCount={4} onOpenAI={openAI} />
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <LeadForm />
            <div className="glass rounded-xl p-5">
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
      </HudShell>

      <AIWidget />
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="my-8 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
  );
}
