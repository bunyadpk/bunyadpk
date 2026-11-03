import { memo, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import {
  Search, MapPin, BadgeCheck, X, ChevronLeft, MessageCircle, ShieldCheck,
  FileText, Filter, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import { SOCIETIES, type Society } from '@/data/societies';
import { waLink, CEO_PHONE } from '@/lib/constants';

type TierCategory = 'all' | 'A' | 'B' | 'C';
type PlotSizeFilter = 'all' | '5 Marla' | '10 Marla' | '1 Kanal';

function SocietyDirectory() {
  const [query, setQuery] = useState('');
  const [corridor, setCorridor] = useState<'all' | 'Raiwind Road & Canal' | 'Southern, Central & Cantt'>('all');
  const [tier, setTier] = useState<TierCategory>('all');
  const [plotSize, setPlotSize] = useState<PlotSizeFilter>('all');
  const [onlyApproved, setOnlyApproved] = useState(false);
  const [active, setActive] = useState<Society | null>(null);

  const filtered = useMemo(() => {
    return SOCIETIES.filter((s) => {
      const q = query.toLowerCase().trim();
      const matchQ = !q || s.name.toLowerCase().includes(q) || (s.nameUr || '').includes(query);
      const matchC = corridor === 'all' || s.corridor === corridor;

      // LDA / NOC Approval filter
      const isApproved = s.noc.toLowerCase().includes('approved') || s.noc.toLowerCase().includes('lda');
      const matchNoc = !onlyApproved || isApproved;

      // Plot size matching in pricing brackets
      const matchSize = plotSize === 'all' || s.pricing.some((p) => p.size.toLowerCase().includes(plotSize.toLowerCase()));

      // Dynamic Tier assignment based on pricing & featured flagship status
      const isTierA = s.featured || s.pricing.some((p) => p.price.toLowerCase().includes('crore'));
      const isTierB = !isTierA && s.pricing.some((p) => p.price.toLowerCase().includes('lakh') && parseInt(p.price.replace(/\D/g, '') || '0', 10) > 40);
      const isTierC = !isTierA && !isTierB;

      let matchTier = true;
      if (tier === 'A') matchTier = isTierA;
      if (tier === 'B') matchTier = isTierB;
      if (tier === 'C') matchTier = isTierC;

      return matchQ && matchC && matchNoc && matchSize && matchTier;
    });
  }, [query, corridor, tier, plotSize, onlyApproved]);

  return (
    <div className="space-y-4">
      {/* Search & Comprehensive Multi-Filter Bar */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 38+ societies by English or Urdu name..."
              className="w-full rounded-lg border border-cyan/20 bg-obsidian/60 py-2 pl-10 pr-3 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan/50 hover:text-cyan"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Corridor Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'Raiwind Road & Canal', 'Southern, Central & Cantt'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCorridor(c)}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition cursor-pointer ${
                  corridor === c ? 'bg-cyan/20 text-cyan border border-cyan/40' : 'text-platinum/60 hover:text-cyan border border-transparent'
                }`}
              >
                {c === 'all' ? 'All Corridors' : c.includes('Raiwind') ? 'Raiwind & Canal' : 'Southern & Cantt'}
              </button>
            ))}
          </div>

          <span className="font-mono text-xs text-cyan/70 whitespace-nowrap self-end lg:self-center">
            Found: <strong className="text-cyan">{filtered.length}</strong> / {SOCIETIES.length}
          </span>
        </div>

        {/* Secondary Filters: Tier, Plot Size & Approval Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-cyan/10 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-cyan/60">
              <SlidersHorizontal className="h-3 w-3" /> Filters:
            </span>

            {/* Category / Tier Filter */}
            <div className="flex items-center gap-1 rounded-md bg-obsidian/40 p-0.5 border border-cyan/15 text-xs">
              {(['all', 'A', 'B', 'C'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`rounded px-2.5 py-0.5 font-mono text-[11px] transition cursor-pointer ${
                    tier === t ? 'bg-cyan text-black font-bold' : 'text-platinum/60 hover:text-cyan'
                  }`}
                >
                  {t === 'all' ? 'All Tiers' : `Cat ${t}`}
                </button>
              ))}
            </div>

            {/* Plot Size Filter */}
            <div className="flex items-center gap-1 rounded-md bg-obsidian/40 p-0.5 border border-cyan/15 text-xs">
              {(['all', '5 Marla', '10 Marla', '1 Kanal'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setPlotSize(s)}
                  className={`rounded px-2.5 py-0.5 font-mono text-[11px] transition cursor-pointer ${
                    plotSize === s ? 'bg-cyan/20 text-cyan font-bold border border-cyan/30' : 'text-platinum/60 hover:text-cyan'
                  }`}
                >
                  {s === 'all' ? 'All Sizes' : s}
                </button>
              ))}
            </div>
          </div>

          {/* LDA Approved Only Switch */}
          <button
            onClick={() => setOnlyApproved(!onlyApproved)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 font-mono text-xs transition cursor-pointer ${
              onlyApproved
                ? 'border-emerald-400/50 bg-emerald-950/30 text-emerald-300'
                : 'border-cyan/20 text-platinum/60 hover:border-cyan/40 hover:text-cyan'
            }`}
          >
            <ShieldCheck className={`h-3.5 w-3.5 ${onlyApproved ? 'text-emerald-400' : 'text-cyan/60'}`} />
            LDA / Verified Only
          </button>
        </div>
      </div>

      {/* Societies Grid */}
      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="font-mono text-sm text-platinum/50">No societies found matching your active filter criteria.</p>
          <button
            onClick={() => { setQuery(''); setCorridor('all'); setTier('all'); setPlotSize('all'); setOnlyApproved(false); }}
            className="btn-cyan mt-3 py-1.5 text-xs cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <motion.button
              key={s.id}
              layout
              onClick={() => setActive(s)}
              whileHover={{ y: -3 }}
              className="glass group relative overflow-hidden rounded-xl p-4 text-left transition hover:neon-border cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-platinum group-hover:neon-text transition">{s.name}</h3>
                  {s.nameUr && <p className="font-mono text-[11px] text-cyan/50">{s.nameUr}</p>}
                </div>
                {s.featured && <span className="chip">Flagship</span>}
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-platinum/60">{s.plan}</p>
              <div className="mt-3 flex items-center justify-between border-t border-cyan/10 pt-2.5">
                <span className="flex items-center gap-1 text-[11px] text-cyan/80">
                  <MapPin className="h-3 w-3" /> {s.noc}
                </span>
                <span className="text-[11px] font-mono font-semibold text-cyan/90">
                  {s.dcRatePerMarla.split(' – ')[0]} / M
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {active && <SocietyModal society={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  );
}

function SocietyModal({ society, onClose }: { society: Society; onClose: () => void }) {
  const waMsg = `Asalam o Alaikum CEO Taha Mubeen Bhutta, I am interested in ${society.name} (${society.nameUr || ''}). Please share available plot files and current DC valuation.`;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-obsidian/80 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="glass-strong relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-cyan/30 p-6 sm:rounded-2xl shadow-cyan-glow"
      >
        {/* Sticky Back Header */}
        <div className="sticky -mx-6 -top-6 z-10 mb-4 flex items-center justify-between bg-obsidian/90 px-6 py-2.5 backdrop-blur border-b border-cyan/15">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-md border border-cyan/30 px-3 py-1.5 text-xs text-cyan transition hover:bg-cyan/10 cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Back / بند کریں
          </button>
          <button onClick={onClose} className="text-cyan/60 hover:text-cyan cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-start justify-between pr-8">
          <div>
            <h2 className="font-display text-2xl font-black text-platinum">{society.name}</h2>
            {society.nameUr && <p className="font-mono text-sm text-cyan/60">{society.nameUr}</p>}
          </div>
          <span className="chip"><BadgeCheck className="h-3 w-3" /> {society.noc}</span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoCard icon={FileText} title="Master Plan & Specs" body={society.plan} />
          <InfoCard icon={ShieldCheck} title="NOC / Legal Clearance" body={society.noc} />
          <InfoCard icon={MapPin} title="Official DC Rate / Marla" body={society.dcRatePerMarla} />
          <InfoCard icon={FileText} title="FBR Valuation Estimate" body={society.fbrEstimate} />
        </div>

        <h3 className="mt-5 font-display text-xs font-bold uppercase tracking-wider text-cyan">
          Live Pricing Brackets by Plot Size
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {society.pricing.map((p) => (
            <div key={p.size} className="rounded-lg border border-cyan/15 bg-obsidian/40 p-3">
              <p className="font-mono text-[10px] uppercase text-cyan/60">{p.size}</p>
              <p className="mt-1 text-sm font-semibold text-platinum">{p.price}</p>
            </div>
          ))}
        </div>

        <a
          href={waLink(waMsg)} target="_blank" rel="noopener noreferrer"
          className="btn-cyan mt-5 w-full cursor-pointer flex items-center justify-center gap-2 py-2.5 text-sm font-bold shadow-cyan-glow"
        >
          <MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp CEO Taha Mubeen Bhutta ({CEO_PHONE})
        </a>
      </motion.div>
    </motion.div>
  );
}

export default memo(SocietyDirectory);

function InfoCard({ icon: Icon, title, body }: { icon: typeof MapPin; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-cyan/15 bg-obsidian/40 p-3">
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-cyan/60">
        <Icon className="h-3 w-3" /> {title}
      </p>
      <p className="mt-1 text-sm text-platinum/90">{body}</p>
    </div>
  );
}
