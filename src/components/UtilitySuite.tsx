import { useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import {
  Bot, Calculator, FileText, ShieldCheck, Download, MessageCircle, Coins,
  Hammer, Loader2, Send,
} from 'lucide-react';
import { askBunyadAI, isGeminiConfigured } from '@/lib/gemini';
import { CEO_PHONE, waLink } from '@/lib/constants';
import type { MaterialRates } from '@/lib/supabase';

type Tool = 'ai' | 'tax' | 'cost' | 'escrow' | 'forms' | 'contact';

const TOOLS: { id: Tool; label: string; icon: typeof Bot; desc: string }[] = [
  { id: 'ai', label: 'AI Architect Studio', icon: Bot, desc: 'Floor layouts & bylaw guidance from Gemini' },
  { id: 'tax', label: 'DC Rate / FBR Tax', icon: Coins, desc: 'Filer vs non-filer breakdown' },
  { id: 'cost', label: 'Cost Estimator', icon: Hammer, desc: 'Gray structure vs turnkey luxury' },
  { id: 'escrow', label: 'Escrow Tracker', icon: ShieldCheck, desc: 'Milestone protection system' },
  { id: 'forms', label: 'Property Forms', icon: FileText, desc: 'Transfer, NDC, affidavit templates' },
  { id: 'contact', label: 'WhatsApp Desk', icon: MessageCircle, desc: 'Direct line to CEO desk' },
];

export default function UtilitySuite({ rates }: { rates: MaterialRates }) {
  const [tool, setTool] = useState<Tool>('ai');

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-cyan" />
          <h2 className="font-display text-base font-bold text-platinum">PropTech Utility Suite</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => setTool(t.id)}
            className={`glass rounded-xl p-3 text-left transition ${tool === t.id ? 'neon-border' : 'hover:border-cyan/30'}`}>
            <t.icon className={`h-5 w-5 ${tool === t.id ? 'text-cyan' : 'text-cyan/60'}`} />
            <p className={`mt-2 text-xs font-semibold ${tool === t.id ? 'text-cyan' : 'text-platinum/80'}`}>{t.label}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tool} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {tool === 'ai' && <AIStudio />}
          {tool === 'tax' && <TaxEngine />}
          {tool === 'cost' && <CostEstimator rates={rates} />}
          {tool === 'escrow' && <EscrowTracker />}
          {tool === 'forms' && <FormsDesk />}
          {tool === 'contact' && <ContactDesk />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AIStudio() {
  const [dims, setDims] = useState('30x70');
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  async function ask() {
    setLoading(true);
    const q = prompt || `Plot dimensions ${dims} feet. Provide floor layout suggestion, LDA bylaw compliance, and structural guidance for a house in Lahore.`;
    const res = await askBunyadAI(q);
    setReply(res);
    setLoading(false);
  }

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display text-sm font-bold text-cyan">Gemini AI Architectural Studio</h3>
      {!isGeminiConfigured && (
        <p className="mt-1 font-mono text-[10px] text-yellow-400/70">Gemini key not set — using built-in fallback consultant.</p>
      )}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="font-mono text-[10px] uppercase text-cyan/60">Plot Dimensions (ft)</span>
          <input value={dims} onChange={(e) => setDims(e.target.value)} placeholder="30x70, 50x90..."
            className="mt-1 w-full rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum focus:border-cyan focus:outline-none" />
        </label>
        <div className="flex items-end">
          <button onClick={ask} disabled={loading} className="btn-cyan">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Generate
          </button>
        </div>
      </div>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Optional: add specifics (rooms, floors, basement...)"
        className="mt-2 w-full rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" rows={2} />
      {reply && (
        <div className="mt-4 rounded-lg border border-cyan/15 bg-obsidian/40 p-4">
          <pre className="whitespace-pre-wrap text-sm text-platinum/90 font-sans">{reply}</pre>
        </div>
      )}
    </div>
  );
}

function TaxEngine() {
  const [value, setValue] = useState(10000000);
  const [filer, setFiler] = useState(true);

  const v = value;
  const stampDuty = filer ? v * 0.05 : v * 0.08;
  const cvt = filer ? 0 : v * 0.02;
  const registry = v * 0.01;
  const transfer = filer ? v * 0.01 : v * 0.015;
  const total = stampDuty + cvt + registry + transfer;

  const rows = [
    { label: 'Stamp Duty', filer: v * 0.05, nonFiler: v * 0.08 },
    { label: 'CVT (Capital Value Tax)', filer: 0, nonFiler: v * 0.02 },
    { label: 'Registry Fee', filer: v * 0.01, nonFiler: v * 0.01 },
    { label: 'Transfer Dues', filer: v * 0.01, nonFiler: v * 0.015 },
  ];

  const fmt = (n: number) => `PKR ${Math.round(n).toLocaleString()}`;

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display text-sm font-bold text-cyan">Smart DC Rate &amp; FBR Tax Engine</h3>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="font-mono text-[10px] uppercase text-cyan/60">Property Value (PKR)</span>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum focus:border-cyan focus:outline-none" />
        </label>
        <div className="flex gap-1 rounded-md border border-cyan/20 p-1">
          <button onClick={() => setFiler(true)} className={`rounded px-4 py-1.5 text-xs font-medium ${filer ? 'bg-cyan/20 text-cyan' : 'text-platinum/60'}`}>Filer</button>
          <button onClick={() => setFiler(false)} className={`rounded px-4 py-1.5 text-xs font-medium ${!filer ? 'bg-cyan/20 text-cyan' : 'text-platinum/60'}`}>Non-Filer</button>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between rounded-lg border border-cyan/15 bg-obsidian/40 px-4 py-2">
            <span className="text-sm text-platinum/80">{r.label}</span>
            <span className="font-mono text-sm text-cyan">{fmt(filer ? r.filer : r.nonFiler)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-lg border border-cyan/30 bg-cyan/10 px-4 py-3">
          <span className="font-display text-sm font-bold text-cyan">Total Tax ({filer ? 'Filer' : 'Non-Filer'})</span>
          <span className="font-display text-lg font-black neon-text">{fmt(total)}</span>
        </div>
      </div>
      <p className="mt-3 font-mono text-[10px] text-cyan/40">Estimates based on typical Lahore 2026 rates. Verify with CEO {CEO_PHONE}.</p>
    </div>
  );
}

function CostEstimator({ rates }: { rates: MaterialRates }) {
  const [marla, setMarla] = useState(5);
  const [quality, setQuality] = useState<'gray' | 'turnkey'>('gray');

  // Approx cost per sqft
  const sqftPerMarla = 272;
  const totalSqft = marla * sqftPerMarla;
  const grayRate = (rates.cement_bag / 1540) * 1800 + (rates.steel_kg / 282) * 4 + (rates.bricks_pc / 21) * 50;
  const turnkeyRate = grayRate * 1.7;
  const rate = quality === 'gray' ? grayRate : turnkeyRate;
  const total = totalSqft * rate;

  const fmt = (n: number) => `PKR ${Math.round(n).toLocaleString()}`;

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display text-sm font-bold text-cyan">Live Construction Cost Estimator</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label>
          <span className="font-mono text-[10px] uppercase text-cyan/60">Plot Size (Marla)</span>
          <select value={marla} onChange={(e) => setMarla(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum focus:border-cyan focus:outline-none">
            <option value={5}>5 Marla</option>
            <option value={10}>10 Marla</option>
            <option value={20}>1 Kanal (20 Marla)</option>
            <option value={40}>2 Kanal (40 Marla)</option>
          </select>
        </label>
        <div className="flex flex-col justify-end">
          <div className="flex gap-1 rounded-md border border-cyan/20 p-1">
            <button onClick={() => setQuality('gray')} className={`flex-1 rounded px-3 py-1.5 text-xs font-medium ${quality === 'gray' ? 'bg-cyan/20 text-cyan' : 'text-platinum/60'}`}>Gray Structure</button>
            <button onClick={() => setQuality('turnkey')} className={`flex-1 rounded px-3 py-1.5 text-xs font-medium ${quality === 'turnkey' ? 'bg-cyan/20 text-cyan' : 'text-platinum/60'}`}>Turnkey Luxury</button>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: 'Cement', value: `PKR ${rates.cement_bag}/bag` },
          { label: 'Steel', value: `PKR ${rates.steel_kg}/kg` },
          { label: 'Bricks', value: `PKR ${rates.bricks_pc}/pc` },
          { label: 'Crush', value: `PKR ${rates.crush_cft}/cft` },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-cyan/15 bg-obsidian/40 p-2.5 text-center">
            <p className="font-mono text-[10px] uppercase text-cyan/60">{m.label}</p>
            <p className="mt-0.5 text-xs font-semibold text-platinum">{m.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-cyan/30 bg-cyan/10 px-4 py-4 text-center">
        <p className="font-mono text-[10px] uppercase text-cyan/70">Estimated Total ({quality === 'gray' ? 'Gray Structure' : 'Turnkey Luxury'})</p>
        <p className="font-display text-2xl font-black neon-text">{fmt(total)}</p>
        <p className="mt-1 text-[11px] text-platinum/50">{totalSqft.toLocaleString()} sqft · {fmt(rate)}/sqft</p>
      </div>
    </div>
  );
}

const MILESTONES = ['Foundation', 'Structure', 'Finishing', 'Handover'] as const;
function EscrowTracker() {
  const [current, setCurrent] = useState(0);
  const percent = ((current + 1) / MILESTONES.length) * 100;
  const distribution = [25, 35, 25, 15];

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display text-sm font-bold text-cyan">100% Escrow Milestone Protection System</h3>
      <p className="mt-1 text-xs text-platinum/60">Funds are released only when each milestone is verified by Bin Taha Associates.</p>
      <div className="mt-4">
        <div className="flex justify-between text-[10px] font-mono text-cyan/60">
          <span>Foundation</span><span>{Math.round(percent)}% Released</span><span>Handover</span>
        </div>
        <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-obsidian/60">
          <motion.div className="h-full bg-gradient-to-r from-cyan to-cobalt" animate={{ width: `${percent}%` }} transition={{ type: 'spring' }} />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {MILESTONES.map((m, i) => {
          const done = i <= current;
          return (
            <div key={m} className={`flex items-center justify-between rounded-lg border px-4 py-2.5 transition ${done ? 'border-cyan/30 bg-cyan/10' : 'border-cyan/10 bg-obsidian/40'}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${done ? 'bg-cyan text-obsidian' : 'bg-obsidian/60 text-cyan/40'}`}>
                  {done ? <ShieldCheck className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <div>
                  <p className={`text-sm font-medium ${done ? 'text-cyan' : 'text-platinum/60'}`}>{m}</p>
                  <p className="font-mono text-[10px] text-platinum/40">{distribution[i]}% funds released</p>
                </div>
              </div>
              {i === current && i < MILESTONES.length - 1 && (
                <button onClick={() => setCurrent(i + 1)} className="btn-ghost py-1 text-xs">Mark Complete</button>
              )}
              {i === current && i === MILESTONES.length - 1 && (
                <span className="chip">Final Step</span>
              )}
            </div>
          );
        })}
      </div>
      {current === MILESTONES.length - 1 && (
        <button onClick={() => setCurrent(0)} className="btn-ghost mt-4 w-full">Reset Tracker</button>
      )}
    </div>
  );
}

const FORMS = [
  { name: 'Property Transfer Form', desc: 'Official society transfer application template' },
  { name: 'NDC Checklist', desc: 'No Demand Certificate verification checklist' },
  { name: 'Affidavit Template', desc: 'Standard ownership affidavit format' },
  { name: 'Authority Letter', desc: 'Authorized representative power of attorney' },
];

function FormsDesk() {
  function download(name: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name.replace(/\s+/g, '_') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display text-sm font-bold text-cyan">Official Property Forms Desk</h3>
      <p className="mt-1 text-xs text-platinum/60">Download official templates for transfer, NDC, affidavits, and authority letters.</p>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FORMS.map((f) => (
          <div key={f.name} className="flex items-center justify-between rounded-lg border border-cyan/15 bg-obsidian/40 p-3">
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-cyan/70" />
              <div>
                <p className="text-sm font-semibold text-platinum">{f.name}</p>
                <p className="text-[11px] text-platinum/50">{f.desc}</p>
              </div>
            </div>
            <button onClick={() => download(f.name, `${f.name}\n\nBin Taha Associates & Builders\nCEO: Taha Mubeen Bhutta\nHelpline: 0321-9404812\nHQ: Block J, LDA Avenue 1, Lahore\n\n[Fill in your details below]\n\nName: _______________\nCNIC: _______________\nPlot: _______________\nSociety: _______________\n\nSignature: _______________\nDate: _______________\n`)}
              className="rounded p-2 text-cyan hover:bg-cyan/10" title="Download">
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactDesk() {
  const [msg, setMsg] = useState('');
  const presets = [
    'I want to buy a plot in LDA Avenue 1',
    'I need construction cost estimate for 10 Marla',
    'I want to register as an agent',
    'I need help with property transfer',
  ];
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display text-sm font-bold text-cyan">Direct WhatsApp &amp; Inquiries Desk</h3>
      <p className="mt-1 text-xs text-platinum/60">Connected directly to CEO Taha Mubeen Bhutta's desk ({CEO_PHONE}).</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button key={p} onClick={() => setMsg(p)} className="chip hover:bg-cyan/10 transition">{p}</button>
        ))}
      </div>
      <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type your message to CEO..."
        className="mt-3 w-full rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" rows={3} />
      <a href={waLink(msg || 'Asalam o Alaikum, I have an inquiry about Bunyad.pk')} target="_blank" rel="noopener noreferrer" className="btn-cyan mt-3 w-full">
        <MessageCircle className="h-4 w-4" /> Send to CEO {CEO_PHONE}
      </a>
    </div>
  );
}
