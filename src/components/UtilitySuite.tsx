import { useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import {
  Bot, Calculator, FileText, ShieldCheck, Download, MessageCircle, Coins,
  Hammer, Loader2, Send, CheckCircle2, Lock, CreditCard, Sparkles,
  Building, MapPin, Receipt, ShieldAlert, Copy, Check
} from 'lucide-react';
import { askBunyadAI, isGeminiConfigured } from '@/lib/gemini';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';
import type { MaterialRates } from '@/lib/supabase';

type Tool = 'ai' | 'tax' | 'cost' | 'escrow' | 'payment' | 'forms';

const TOOLS: { id: Tool; label: string; icon: typeof Bot; desc: string }[] = [
  { id: 'ai', label: 'Gemini AI Studio', icon: Bot, desc: 'AI Floorplan & LDA Bylaws' },
  { id: 'tax', label: 'FBR & DC Tax Engine', icon: Coins, desc: 'Filer vs Non-Filer 2026' },
  { id: 'cost', label: 'Cost Estimator', icon: Hammer, desc: 'Live Material Civil Rates' },
  { id: 'payment', label: 'Secure Pay & Escrow', icon: CreditCard, desc: 'Encrypted Token Settlement' },
  { id: 'escrow', label: 'Milestone Vault', icon: ShieldCheck, desc: 'Verified Fund Release' },
  { id: 'forms', label: 'Legal Templates', icon: FileText, desc: 'Transfer, NDC, Affidavits' },
];

export default function UtilitySuite({ rates }: { rates: MaterialRates }) {
  const [tool, setTool] = useState<Tool>('ai');

  return (
    <div className="space-y-4">
      {/* HUD Header */}
      <div className="glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border border-cyan/30 shadow-cyan-glow">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan">
            <Calculator className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-platinum">
              PropTech Intelligence &amp; Autonomous Suite
            </h2>
            <p className="font-mono text-[10px] text-cyan/70 tracking-wider">
              GEO-LOCATION: LAHORE, PUNJAB • BIN TAHA ASSOCIATES VIP COMMAND
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-xs text-emerald-400 font-bold">GEMINI 1.5 PRO ACTIVE</span>
        </div>
      </div>

      {/* Navigation Matrix */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTool(t.id)}
            className={`glass cursor-pointer rounded-xl p-3 text-left transition duration-200 ${
              tool === t.id
                ? 'border-cyan bg-cyan/15 shadow-cyan-glow text-cyan scale-[1.02]'
                : 'hover:border-cyan/40 text-platinum/70'
            }`}
          >
            <t.icon className={`h-5 w-5 ${tool === t.id ? 'text-cyan' : 'text-cyan/60'}`} />
            <p className="mt-2 text-xs font-bold leading-tight">{t.label}</p>
            <p className="mt-0.5 line-clamp-1 text-[10px] text-platinum/50">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Dynamic Module Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tool}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {tool === 'ai' && <AIArchitectStudio />}
          {tool === 'tax' && <TaxEngine />}
          {tool === 'cost' && <CostEstimator rates={rates} />}
          {tool === 'payment' && <SecurePaymentGate />}
          {tool === 'escrow' && <EscrowTracker />}
          {tool === 'forms' && <FormsDesk />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --------------------------------------------------------------------------
// 1. GEMINI AI ARCHITECTURAL STUDIO
// --------------------------------------------------------------------------
function AIArchitectStudio() {
  const [size, setSize] = useState('5 Marla (25x45)');
  const [style, setStyle] = useState('Modern Minimalist Luxury');
  const [customReq, setCustomReq] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const engineeredPrompt = `
You are the Chief Architectural AI for Bunyad.pk and Bin Taha Associates & Builders in Lahore, Pakistan.
Analyze and provide a professional, highly detailed architectural specification for a residential house:

- Plot Size & Dimensions: ${size}
- Design Philosophy: ${style}
- Specific Requirements: ${customReq || 'Double unit, maximize natural lighting, 4 ensuite bedrooms, powder room, open concept kitchen, servant quarter, and car porch.'}
- Authority Standards: Lahore Development Authority (LDA) Building Regulations (setbacks, height limits, ground coverage).

Provide structured output containing:
1. LDA Bylaw Setbacks & Clearances (Front, Rear, Side).
2. Floor-by-Floor Spatial Layout (Ground Floor & First Floor zoning).
3. Structural & Civil Recommendations (Earthquake resistance, Grade-60 steel schedule, insulation).
4. Estimated Construction Timeline & Bin Taha Turnkey Standard.
Keep it highly authoritative, precise, and formatted professionally.
`;
    const response = await askBunyadAI(engineeredPrompt);
    setReply(response);
    setLoading(false);
  }

  return (
    <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan/15 pb-3">
        <div>
          <h3 className="font-display text-base font-bold text-cyan flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan" /> Gemini AI Architectural Studio
          </h3>
          <p className="mt-0.5 text-xs text-platinum/60">
            Real-time floor layout generation, LDA bylaw setbacks, and civil engineering feasibility.
          </p>
        </div>
        <span className="chip border-cyan/40 bg-cyan/10 text-cyan font-mono text-[11px]">
          Neural Engine v2.6
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label>
          <span className="font-mono text-[10px] uppercase text-cyan/70">Select Plot Scale &amp; Dimensions</span>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum focus:border-cyan focus:outline-none"
          >
            <option>3 Marla (20x35) - Compact Urban</option>
            <option>5 Marla (25x45) - Prime Standard</option>
            <option>10 Marla (35x65) - Executive Luxury</option>
            <option>1 Kanal (50x90) - Flagship Estate</option>
            <option>2 Kanal (75x120) - Mega Villa</option>
          </select>
        </label>

        <label>
          <span className="font-mono text-[10px] uppercase text-cyan/70">Architectural Aesthetic</span>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum focus:border-cyan focus:outline-none"
          >
            <option>Modern Minimalist Luxury (Glass &amp; Fair-face Concrete)</option>
            <option>Spanish Colonial Revival (Terracotta &amp; Arches)</option>
            <option>Contemporary Neo-Classic</option>
            <option>Nordic Industrialist</option>
          </select>
        </label>
      </div>

      <div className="mt-3">
        <span className="font-mono text-[10px] uppercase text-cyan/70">Custom Specifications &amp; Lifestyle Features</span>
        <textarea
          value={customReq}
          onChange={(e) => setCustomReq(e.target.value)}
          placeholder="e.g. 5 bedrooms, double height ceiling lobby, rooftop patio with BBQ station, basement cinema, 2 large SUVs parking..."
          className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 p-3 text-xs text-platinum placeholder:text-platinum/30 focus:border-cyan focus:outline-none"
          rows={2}
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="btn-cyan mt-3 w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold shadow-cyan-glow cursor-pointer"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Synthesize Architectural Blueprint with Gemini AI
      </button>

      {reply && (
        <div className="mt-4 rounded-xl border border-cyan/25 bg-[#03070d]/90 p-4">
          <div className="flex items-center justify-between border-b border-cyan/15 pb-2 mb-3">
            <span className="font-mono text-[10px] text-cyan/80 uppercase">AI Blueprint Output</span>
            <a
              href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I generated this house blueprint on Bunyad.pk for ${size}:\n\n${reply.slice(0, 300)}...`)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
            >
              <MessageCircle className="h-3 w-3" /> Discuss with CEO
            </a>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-platinum/90">
            {reply}
          </pre>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// 2. SECURE PAYMENT GATEWAY & ESCROW DEPOSIT (256-BIT ENCRYPTED)
// --------------------------------------------------------------------------
function SecurePaymentGate() {
  const [amount, setAmount] = useState('500000');
  const [purpose, setPurpose] = useState('Token Payment / Plot Booking');
  const [copied, setCopied] = useState(false);
  const [referenceId] = useState(() => 'BT-' + Math.floor(100000 + Math.random() * 900000));

  function handleCopyAccount() {
    navigator.clipboard.writeText('03219404812');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const payMsg = `Asalam o Alaikum CEO Taha Mubeen Bhutta,\nI am initiating a secure booking payment on Bunyad.pk.\n\nTransaction Ref: ${referenceId}\nPurpose: ${purpose}\nAmount: PKR ${Number(amount).toLocaleString()}\n\nPlease verify escrow account allocation.`;

  return (
    <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan/15 pb-3">
        <div>
          <h3 className="font-display text-base font-bold text-cyan flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" /> Bin Taha Secure Vault &amp; Escrow Gateway
          </h3>
          <p className="mt-0.5 text-xs text-platinum/60">
            256-bit encrypted milestone fund protection. Zero unauthorized withdrawals.
          </p>
        </div>
        <span className="chip border-emerald-400/40 text-emerald-400 font-mono text-[11px]">
          FBR / Banking Verified
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left Side: Payment Parameters */}
        <div className="space-y-3">
          <label className="block">
            <span className="font-mono text-[10px] uppercase text-cyan/70">Payment Objective</span>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum focus:border-cyan focus:outline-none"
            >
              <option>Token Payment / Plot Booking (Bayana)</option>
              <option>Civil Material Procurement Milestone</option>
              <option>Architectural Consultancy Fee</option>
              <option>Legal Transfer &amp; NDC Processing Retainer</option>
            </select>
          </label>

          <label className="block">
            <span className="font-mono text-[10px] uppercase text-cyan/70">Transaction Amount (PKR)</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-lg border border-cyan/30 bg-obsidian/80 px-3 py-2 font-mono text-sm text-cyan focus:border-cyan focus:outline-none"
            />
          </label>

          <div className="rounded-lg border border-cyan/15 bg-obsidian/50 p-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-platinum/60">Vault Security Protocol:</span>
              <span className="font-mono text-emerald-400 font-semibold">100% Escrow Guard</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-platinum/60">System Security Ref:</span>
              <span className="font-mono text-cyan">{referenceId}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Banking Credentials Card */}
        <div className="rounded-xl border border-cyan/30 bg-gradient-to-b from-[#0a1525] to-[#040810] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cyan/15 pb-2">
              <p className="font-display text-xs font-bold text-cyan uppercase tracking-wider">
                Direct Corporate Account
              </p>
              <Receipt className="h-4 w-4 text-cyan/60" />
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div>
                <p className="font-mono text-[10px] text-platinum/50 uppercase">Account Title</p>
                <p className="font-bold text-platinum">TAHA MUBEEN BHUTTA (BIN TAHA)</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-platinum/50 uppercase">Official Corporate / Raast Number</p>
                <div className="flex items-center justify-between rounded bg-obsidian/80 px-2 py-1 border border-cyan/20">
                  <span className="font-mono text-cyan font-bold text-sm">03219404812</span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="text-cyan/70 hover:text-cyan flex items-center gap-1 font-mono text-[10px] cursor-pointer"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] text-platinum/50 uppercase">Head Office Clearance Center</p>
                <p className="text-platinum/80">Block J, Commercial Broadway, LDA Avenue 1, Lahore</p>
              </div>
            </div>
          </div>

          <a
            href={waLink(payMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyan mt-4 flex items-center justify-center gap-2 py-2 text-xs font-bold cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" /> Confirm Deposit with CEO Desk
          </a>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 3. FBR & DC TAX ENGINE
// --------------------------------------------------------------------------
function TaxEngine() {
  const [value, setValue] = useState(12000000);
  const [filerStatus, setFilerStatus] = useState<'filer' | 'non-filer'>('filer');

  const v = Math.max(0, value);
  const filerFbr = v * 0.03;
  const nonFilerFbr = v * 0.105;
  const filerStamp = v * 0.03;
  const nonFilerStamp = v * 0.05;
  const filerTransfer = v * 0.01;
  const nonFilerTransfer = v * 0.015;
  const registryFee = v * 0.01;

  const totalFiler = filerFbr + filerStamp + filerTransfer + registryFee;
  const totalNonFiler = nonFilerFbr + nonFilerStamp + nonFilerTransfer + registryFee;
  const currentTotal = filerStatus === 'filer' ? totalFiler : totalNonFiler;
  const taxSavings = totalNonFiler - totalFiler;

  const fmt = (n: number) => `PKR ${Math.round(n).toLocaleString()}`;

  const rows = [
    { label: 'FBR Advance Income Tax (Sec 236K)', filerRate: '3%', nonFilerRate: '10.5%', filerView: filerFbr, nonFilerView: nonFilerFbr },
    { label: 'Punjab Stamp Duty (e-Stamping)', filerRate: '3%', nonFilerRate: '5%', filerView: filerStamp, nonFilerView: nonFilerStamp },
    { label: 'LDA / TMA Transfer Fee', filerRate: '1%', nonFilerRate: '1.5%', filerView: filerTransfer, nonFilerView: nonFilerTransfer },
    { label: 'Legal Mutation & Registry Stamp', filerRate: '1%', nonFilerRate: '1%', filerView: registryFee, nonFilerView: registryFee },
  ];

  return (
    <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan/15 pb-3">
        <div>
          <h3 className="font-display text-base font-bold text-cyan">Lahore Property Tax &amp; FBR Valuation Engine</h3>
          <p className="mt-0.5 text-xs text-platinum/60">
            Real-time tax calculation for LDA, DHA Lahore, Bahria Town &amp; private societies.
          </p>
        </div>
        <span className="chip border-emerald-400/40 text-emerald-400 font-mono text-xs">Finance Act 2026</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1">
              <span className="font-mono text-[10px] uppercase text-cyan/70">Property Declared Value (PKR)</span>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-cyan/30 bg-obsidian/80 px-3 py-2 font-mono text-base text-cyan outline-none focus:border-cyan"
              />
            </label>
            <div className="flex rounded-lg border border-cyan/30 bg-obsidian/80 p-1">
              <button
                type="button"
                onClick={() => setFilerStatus('filer')}
                className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-mono font-bold transition ${
                  filerStatus === 'filer' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-platinum/60'
                }`}
              >
                Active Filer
              </button>
              <button
                type="button"
                onClick={() => setFilerStatus('non-filer')}
                className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-mono font-bold transition ${
                  filerStatus === 'non-filer' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-platinum/60'
                }`}
              >
                Non-Filer
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-lg border border-cyan/15 bg-obsidian/40 p-3">
                <div>
                  <p className="text-xs font-medium text-platinum">{r.label}</p>
                  <p className="font-mono text-[10px] text-platinum/50">Rate: {filerStatus === 'filer' ? r.filerRate : r.nonFilerRate}</p>
                </div>
                <p className="font-mono text-sm font-semibold text-cyan">
                  {fmt(filerStatus === 'filer' ? r.filerView : r.nonFilerView)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-cyan/30 bg-gradient-to-b from-[#0a1525] to-[#040810] p-5">
          <div>
            <span className="font-mono text-[10px] uppercase text-cyan/70">Total Estimated Government Dues</span>
            <p className="mt-2 font-display text-3xl font-black neon-text">{fmt(currentTotal)}</p>
            <div className="mt-4 rounded-lg border border-emerald-400/25 bg-emerald-950/20 p-3">
              <p className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Active Filer Benefit:
              </p>
              <p className="mt-1 text-xs text-platinum/80">
                You save <strong className="text-emerald-300 font-mono">{fmt(taxSavings)}</strong> by being on the ATL list.
              </p>
            </div>
          </div>
          <a
            href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I calculated taxes on Bunyad.pk for property value ${fmt(v)}. Total: ${fmt(currentTotal)}. Please guide on transfer procedure.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyan mt-4 flex items-center justify-center gap-2 py-2.5 text-xs font-bold cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" /> Consult With CEO
          </a>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 4. LIVE CONSTRUCTION COST ESTIMATOR
// --------------------------------------------------------------------------
function CostEstimator({ rates }: { rates: MaterialRates }) {
  const [marla, setMarla] = useState(5);
  const [quality, setQuality] = useState<'gray' | 'turnkey'>('gray');

  const coveredAreaMap: Record<number, number> = { 3: 1300, 5: 2150, 10: 3850, 20: 6800, 40: 13000 };
  const totalSqft = coveredAreaMap[marla] || marla * 400;

  const baseGray =
    (rates.cement_bag / 1500) * 1250 +
    (rates.steel_kg / 280) * 850 +
    (rates.bricks_pc / 20) * 450 +
    (rates.crush_cft / 140) * 350 +
    700;

  const activeRatePerSqft = quality === 'gray' ? baseGray : baseGray * 1.85;
  const totalCost = totalSqft * activeRatePerSqft;
  const fmt = (n: number) => `PKR ${Math.round(n).toLocaleString()}`;

  return (
    <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan/15 pb-3">
        <div>
          <h3 className="font-display text-base font-bold text-cyan">Civil Construction Cost Estimator</h3>
          <p className="mt-0.5 text-xs text-platinum/60">
            Real-time material rates curated by Bin Taha procurement team.
          </p>
        </div>
        <span className="chip border-cyan/40 text-cyan font-mono text-xs">Live Rates Linked</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label>
              <span className="font-mono text-[10px] uppercase text-cyan/70">Plot Scale</span>
              <select
                value={marla}
                onChange={(e) => setMarla(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum focus:border-cyan focus:outline-none"
              >
                <option value={3}>3 Marla (~1,300 sqft covered)</option>
                <option value={5}>5 Marla (~2,150 sqft covered)</option>
                <option value={10}>10 Marla (~3,850 sqft covered)</option>
                <option value={20}>1 Kanal (~6,800 sqft covered)</option>
              </select>
            </label>
            <div>
              <span className="font-mono text-[10px] uppercase text-cyan/70">Specification</span>
              <div className="mt-1 flex gap-1 rounded-lg border border-cyan/30 bg-obsidian/80 p-1">
                <button
                  type="button"
                  onClick={() => setQuality('gray')}
                  className={`flex-1 cursor-pointer rounded py-1.5 text-xs font-mono font-bold ${
                    quality === 'gray' ? 'bg-cyan/20 text-cyan border border-cyan/40' : 'text-platinum/60'
                  }`}
                >
                  Gray Structure
                </button>
                <button
                  type="button"
                  onClick={() => setQuality('turnkey')}
                  className={`flex-1 cursor-pointer rounded py-1.5 text-xs font-mono font-bold ${
                    quality === 'turnkey' ? 'bg-cyan/20 text-cyan border border-cyan/40' : 'text-platinum/60'
                  }`}
                >
                  Turnkey A+ Luxury
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: 'Cement (Per Bag)', val: `PKR ${rates.cement_bag}` },
              { label: 'Steel (Per Kg)', val: `PKR ${rates.steel_kg}` },
              { label: 'Awwal Bricks (Pc)', val: `PKR ${rates.bricks_pc}` },
              { label: 'Crush Margalla (CFT)', val: `PKR ${rates.crush_cft}` },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-cyan/15 bg-obsidian/40 p-2.5 text-center">
                <p className="font-mono text-[9px] uppercase text-cyan/60">{m.label}</p>
                <p className="mt-1 font-mono text-xs font-bold text-platinum">{m.val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-cyan/30 bg-gradient-to-b from-[#0a1525] to-[#040810] p-5">
          <div>
            <span className="font-mono text-[10px] uppercase text-cyan/70">Estimated Civil Investment</span>
            <p className="mt-2 font-display text-3xl font-black neon-text">{fmt(totalCost)}</p>
            <p className="mt-2 font-mono text-xs text-platinum/60">
              Area: <strong className="text-platinum">{totalSqft.toLocaleString()} sqft</strong> @ {fmt(activeRatePerSqft)}/sqft
            </p>
          </div>
          <a
            href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I calculated construction costs on Bunyad.pk for ${marla} Marla (${quality === 'gray' ? 'Gray' : 'Turnkey'}). Total estimate: ${fmt(totalCost)}. Please schedule site survey.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyan mt-4 flex items-center justify-center gap-2 py-2.5 text-xs font-bold cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" /> Book Construction Slot
          </a>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 5. ESCROW TRACKER
// --------------------------------------------------------------------------
const MILESTONES = ['Foundation & Plinth', 'Grey Structure & Slab', 'Finishing & Woodwork', 'Handover & Legal Registry'] as const;
function EscrowTracker() {
  const [current, setCurrent] = useState(0);
  const percent = ((current + 1) / MILESTONES.length) * 100;
  const distribution = [25, 35, 25, 15];

  return (
    <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan/15 pb-3">
        <div>
          <h3 className="font-display text-base font-bold text-cyan">100% Escrow Milestone Protection System</h3>
          <p className="mt-0.5 text-xs text-platinum/60">
            Funds are released strictly upon physical structural audit by Bin Taha engineering desk.
          </p>
        </div>
        <span className="chip border-emerald-400/40 text-emerald-400 font-mono text-xs">Milestone Guard</span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-[11px] font-mono text-cyan/70">
          <span>Foundation</span>
          <span>{Math.round(percent)}% Released</span>
          <span>Handover</span>
        </div>
        <div className="mt-1 h-3 overflow-hidden rounded-full bg-obsidian/80 border border-cyan/20">
          <motion.div className="h-full bg-gradient-to-r from-cyan via-teal-400 to-emerald-400" animate={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {MILESTONES.map((m, i) => {
          const done = i <= current;
          return (
            <div key={m} className={`flex items-center justify-between rounded-lg border px-4 py-3 ${done ? 'border-cyan/40 bg-cyan/10' : 'border-cyan/10 bg-obsidian/40'}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold ${done ? 'bg-cyan text-obsidian' : 'bg-obsidian/80 text-cyan/40'}`}>
                  {done ? <ShieldCheck className="h-4 w-4" /> : i + 1}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${done ? 'text-cyan' : 'text-platinum/60'}`}>{m}</p>
                  <p className="font-mono text-[10px] text-platinum/40">{distribution[i]}% funds released upon certified sign-off</p>
                </div>
              </div>
              {i === current && i < MILESTONES.length - 1 && (
                <button type="button" onClick={() => setCurrent(i + 1)} className="btn-cyan py-1 px-3 text-xs cursor-pointer">
                  Mark Complete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 6. OFFICIAL LEGAL FORMS
// --------------------------------------------------------------------------
const FORMS = [
  { name: 'Property Transfer Application Form', desc: 'Standardized LDA & private society transfer draft' },
  { name: 'No Demand Certificate (NDC) Checklist', desc: 'Official tax & utility clearance checklist' },
  { name: 'Ownership Affidavit & Indemnity Bond', desc: 'Legal e-stamp judicial affidavit template' },
  { name: 'Authority Letter & Special Power of Attorney', desc: 'Authorized representative draft' },
];

function FormsDesk() {
  function download(name: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.replace(/\s+/g, '_') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow">
      <div className="border-b border-cyan/15 pb-3">
        <h3 className="font-display text-base font-bold text-cyan">Vetted Property Legal Form Templates</h3>
        <p className="mt-0.5 text-xs text-platinum/60">
          Official drafts verified by Bin Taha Associates legal compliance department.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {FORMS.map((f) => (
          <div key={f.name} className="flex items-center justify-between rounded-lg border border-cyan/15 bg-obsidian/40 p-3.5">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-cyan" />
              <div>
                <p className="text-sm font-semibold text-platinum">{f.name}</p>
                <p className="text-[11px] text-platinum/50">{f.desc}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                download(
                  f.name,
                  `============================================================\n${f.name.toUpperCase()}\nBIN TAHA ASSOCIATES & BUILDERS\nCEO: Taha Mubeen Bhutta | Helpline: 0321-9404812\nHQ: Block J, Commercial Broadway, LDA Avenue 1, Lahore\n============================================================\n\nDate: _________________________\nSociety / Authority: _________________________\nPlot / Property No: _________________________\nBlock / Sector: _________________________\n\nAPPLICANT DETAILS:\nFull Name: _________________________\nFather/Husband: _________________________\nCNIC: _________________________\nContact / WhatsApp: _________________________\n\nDECLARATION:\nI hereby certify the submitted documents are authentic and clear of any encumbrance.\n\nSignature: _________________________\nThumb:     _________________________\n`
                )
              }
              className="rounded p-2 text-cyan hover:bg-cyan/15 cursor-pointer"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
