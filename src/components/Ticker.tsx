import { useEffect, useState } from 'react';
import { Building2, Clock, Coins, Phone } from 'lucide-react';
import { CEO_PHONE, CEO_PHONE_ALT } from '@/lib/constants';

import type { MaterialRates } from '@/lib/supabase';
type Rates = Pick<MaterialRates, 'cement_bag' | 'steel_kg' | 'bricks_pc' | 'crush_cft'>;

function nowParts(tz: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', timeZone: tz, hour12: false,
    }).format(new Date());
  } catch {
    return '--:--';
  }
}

const CITIES: { code: string; tz: string }[] = [
  { code: 'PK', tz: 'Asia/Karachi' },
  { code: 'DXB', tz: 'Asia/Dubai' },
  { code: 'LDN', tz: 'Europe/London' },
  { code: 'NY', tz: 'America/New_York' },
];

const FX: { from: string; to: string; rate: number }[] = [
  { from: 'PKR', to: 'USD', rate: 0.0036 },
  { from: 'PKR', to: 'AED', rate: 0.0132 },
  { from: 'PKR', to: 'GBP', rate: 0.0028 },
];

export default function Ticker({ rates }: { rates: Rates }) {
  const [clocks, setClocks] = useState(CITIES.map((c) => ({ code: c.code, time: nowParts(c.tz) })));

  useEffect(() => {
    const id = setInterval(() => {
      setClocks(CITIES.map((c) => ({ code: c.code, time: nowParts(c.tz) })));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const items: { icon: typeof Building2; text: string }[] = [
    { icon: Building2, text: `Cement PKR ${rates.cement_bag.toLocaleString()} / Bag` },
    { icon: Building2, text: `Grade-60 Steel Saria PKR ${rates.steel_kg.toLocaleString()} / Kg` },
    { icon: Building2, text: `Awwal Bricks PKR ${rates.bricks_pc.toLocaleString()} / Pc` },
    { icon: Building2, text: `Margalla Crush PKR ${rates.crush_cft.toLocaleString()} / CFT` },
    ...clocks.map((c) => ({ icon: Clock, text: `${c.code} ${c.time}` })),
    { icon: Coins, text: '1 PKR = $0.0036 · د.إ 0.0132 · £ 0.0028' },
    ...FX.map((f) => ({ icon: Coins, text: `PKR → ${f.to}: ${f.rate.toFixed(4)}` })),
    { icon: Phone, text: `CEO Helpline ${CEO_PHONE}` },
    { icon: Phone, text: `Alt ${CEO_PHONE_ALT}` },
    { icon: Building2, text: 'APK · iOS · PC' },
  ];

  const loop = [...items, ...items];

  return (
    <div className="relative flex h-7 w-full overflow-hidden border-b border-cyan/20 bg-obsidian-2/80 backdrop-blur">
      <div className="flex whitespace-nowrap animate-ticker will-change-transform">
        {loop.map((it, i) => (
          <span key={i} className="flex items-center gap-1.5 px-4 font-mono text-[11px] text-cyan/80">
            <it.icon className="h-3 w-3 shrink-0 text-cyan/60" />
            {it.text}
            <span className="ml-2 text-cyan/20">|</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-obsidian-2 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-obsidian-2 to-transparent" />
    </div>
  );
}
