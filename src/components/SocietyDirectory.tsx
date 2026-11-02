import { memo, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { Search, MapPin, BadgeCheck, X, ChevronLeft, MessageCircle, ShieldCheck, FileText } from 'lucide-react';
import { SOCIETIES, type Society } from '@/data/societies';
import { waLink, CEO_PHONE } from '@/lib/constants';

function SocietyDirectory() {
  const [query, setQuery] = useState('');
  const [corridor, setCorridor] = useState<'all' | 'Raiwind Road & Canal' | 'Southern, Central & Cantt'>('all');
  const [active, setActive] = useState<Society | null>(null);

  const filtered = useMemo(() => {
    return SOCIETIES.filter((s) => {
      const q = query.toLowerCase();
      const matchQ = !q || s.name.toLowerCase().includes(q) || (s.nameUr || '').includes(query);
      const matchC = corridor === 'all' || s.corridor === corridor;
      return matchQ && matchC;
    });
  }, [query, corridor]);

  return (
    <div className="space-y-4">
      {/* controls */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 38+ societies..."
              className="w-full rounded-md border border-cyan/20 bg-obsidian/60 py-2 pl-10 pr-3 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none"
            />
          </div>
          <div className="flex gap-1 rounded-md border border-cyan/20 p-1">
            {(['all', 'Raiwind Road & Canal', 'Southern, Central & Cantt'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCorridor(c)}
                className={`rounded px-3 py-1 text-xs font-medium transition ${
                  corridor === c ? 'bg-cyan/20 text-cyan' : 'text-platinum/60 hover:text-cyan'
                }`}
              >
                {c === 'all' ? 'All' : c.includes('Raiwind') ? 'Raiwind' : 'Southern'}
              </button>
            ))}
          </div>
          <span className="font-mono text-xs text-cyan/60">{filtered.length} / {SOCIETIES.length}</span>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <motion.button
            key={s.id}
            layout
            onClick={() => setActive(s)}
            whileHover={{ y: -3 }}
            className="glass group relative overflow-hidden rounded-xl p-4 text-left transition hover:neon-border"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-platinum group-hover:neon-text transition">{s.name}</h3>
                {s.nameUr && <p className="font-mono text-[11px] text-cyan/50">{s.nameUr}</p>}
              </div>
              {s.featured && <span className="chip">Flagship</span>}
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-platinum/60">{s.plan}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-cyan/70">
                <MapPin className="h-3 w-3" /> {s.noc}
              </span>
              <span className="text-[11px] font-mono text-platinum/50">{s.dcRatePerMarla.split(' – ')[0]} / Marla</span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && <SocietyModal society={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  );
}

function SocietyModal({ society, onClose }: { society: Society; onClose: () => void }) {
  const waMsg = `Asalam o Alaikum CEO Taha Mubeen Bhutta, I'm interested in ${society.name} (${society.nameUr || ''}). Please share plot availability and pricing.`;

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
        className="glass-strong relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-cyan/30 p-6 sm:rounded-2xl"
      >
        {/* sticky back button */}
        <div className="sticky -mx-6 -top-6 z-10 mb-4 flex items-center justify-between bg-obsidian/80 px-6 py-2 backdrop-blur">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-md border border-cyan/30 px-3 py-1.5 text-xs text-cyan transition hover:bg-cyan/10"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Wapas / Back
          </button>
          <button onClick={onClose} className="text-cyan/60 hover:text-cyan">
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

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InfoCard icon={FileText} title="Master Plan" body={society.plan} />
          <InfoCard icon={ShieldCheck} title="NOC / Approval" body={society.noc} />
          <InfoCard icon={MapPin} title="2026 DC Rate / Marla" body={society.dcRatePerMarla} />
          <InfoCard icon={FileText} title="FBR Valuation / Marla" body={society.fbrEstimate} />
        </div>

        <h3 className="mt-5 font-display text-sm font-bold uppercase tracking-wider text-cyan">Pricing Brackets</h3>
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
          className="btn-cyan mt-5 w-full"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp CEO {CEO_PHONE}
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
