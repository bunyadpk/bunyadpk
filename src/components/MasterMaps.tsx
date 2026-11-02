import { memo } from 'react';
import { motion } from '@/lib/motion';
import { MapPin, ZoomIn, ShieldCheck, Map } from 'lucide-react';
import { waLink, CEO_PHONE } from '@/lib/constants';

const SECTORS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

function MasterMaps() {
  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-cyan" />
          <h2 className="font-display text-base font-bold text-platinum">LDA Avenue 1 Master Maps</h2>
        </div>
        <p className="mt-1 text-xs text-platinum/60">
          High-resolution sector layout A–M with plot divisions, parks, and commercial zones.
        </p>
      </div>

      {/* interactive sector grid */}
      <div className="glass rounded-xl p-5">
        <h3 className="font-display text-sm font-bold text-cyan">Sector Layout (A–M)</h3>
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {SECTORS.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -2, scale: 1.05 }}
              className="aspect-square rounded-lg border border-cyan/20 bg-obsidian/40 text-center font-display text-lg font-bold text-cyan/70 transition hover:border-cyan hover:text-cyan hover:neon-border"
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* master plan summary */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="glass rounded-xl p-4">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-cyan">
            <MapPin className="h-4 w-4" /> Sector Breakdown
          </h3>
          <div className="mt-3 space-y-2">
            <Row label="Total Sectors" value="A to M (13)" />
            <Row label="Plot Sizes" value="5 Marla, 10 Marla, 1 Kanal" />
            <Row label="Commercial Zones" value="Main Boulevard & Sector Markets" />
            <Row label="Parks & Green Areas" value="Sector-center parks + belt" />
            <Row label="Road Network" value="Grid-pattern, 30–80 ft" />
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-cyan">
            <ShieldCheck className="h-4 w-4" /> Verification & NOC
          </h3>
          <div className="mt-3 space-y-2">
            <Row label="NOC Status" value="LDA Approved" />
            <Row label="2026 DC Rate / Marla" value="PKR 9.5 – 14 Lakh" />
            <Row label="FBR Valuation / Marla" value="PKR 11 – 16 Lakh" />
            <Row label="Transfer Method" value="LDA Transfer Desk" />
            <Row label="Possession" value="Available for developed plots" />
          </div>
          <a
            href={waLink('Asalam o Alaikum, I need the LDA Avenue 1 master map and sector details.')}
            target="_blank" rel="noopener noreferrer"
            className="btn-cyan mt-4 w-full"
          >
            <ZoomIn className="h-4 w-4" /> Request Full Map · {CEO_PHONE}
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-cyan/15 bg-obsidian/40 px-3 py-2">
      <span className="text-xs text-platinum/60">{label}</span>
      <span className="text-xs font-medium text-platinum">{value}</span>
    </div>
  );
}

export default memo(MasterMaps);
