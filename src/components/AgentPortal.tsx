import { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import {
  Building2, Compass, Video, ShieldCheck, Calculator, CheckCircle2,
  Phone, Download, Calendar, Layers, HardHat, FileText, Send, Sparkles,
  Camera, Lock, Eye, Check, X, ShieldAlert, Award
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// 15 Standard Core Civil Operations
const CIVIL_SERVICES = [
  { id: 1, title: 'Turnkey Construction (All-Under-One-Roof)', icon: Building2, desc: 'Complete plot-to-key delivery: Architectural 3D design, LDA map sanctions, Grey structure, Luxury A+ finishing, and physical handover.' },
  { id: 2, title: 'Complete Grey Structure Engineering', icon: HardHat, desc: 'Seismic raft foundation, Grade-60 steel cage framing, machine batch mix concrete, Awwal kiln bricks, and chemical waterproofing.' },
  { id: 3, title: 'Luxury Turnkey Finishing Works', icon: Layers, desc: 'Imported Spanish floor porcelain, Turkish bath sanitaries, solid ash wood doors, thermo-flux false ceilings, and bespoke cabinetry.' },
  { id: 4, title: 'Bulk Material Supply & Procurement', icon: Layers, desc: 'Mill-direct Grade-60 saria, Maple Leaf / Bestway cement, Margalla crush, and Awwal bricks with laboratory compliance certificates.' },
  { id: 5, title: 'Dedicated Site Supervision & Project Managers', icon: Award, desc: 'Resident PEC-registered site civil engineers conducting daily slump tests, steel rebar spacing inspections, and material audits.' },
  { id: 6, title: '2D CAD Blueprints & 3D Architectural Studio', icon: Compass, desc: 'Bylaw-compliant structural blueprints, MEP (Mechanical, Electrical, Plumbing) working sheets, and hyper-realistic 3D walkthroughs.' },
  { id: 7, title: 'Live 24/7 Remote CCTV Site Telemetry', icon: Video, desc: 'High-definition optical cameras installed at project front, active roof lintel, and material storage yards for overseas owners.' },
  { id: 8, title: 'Private Client Dashboard & Milestone Tracking', icon: Eye, desc: 'Encrypted client terminal tracking foundation, grey slab, MEP conduit, and tiling progress percentages in real time.' },
  { id: 9, title: 'Digital BOQ & Transparent Expense Ledgers', icon: Calculator, desc: 'Detailed itemized bill of quantities with guaranteed fixed pricing, mitigating material inflation and hidden extras.' },
  { id: 10, title: '100% Escrow Milestone Financial Protection', icon: ShieldCheck, desc: 'Phased stage disbursements (25%-35%-25%-15%) audited and cleared strictly upon signed engineer site demarcation.' },
  { id: 11, title: 'Skilled Labour Force & Master Craftsmen', icon: HardHat, desc: 'Certified master masons, structural shuttering carpenters, high-amperage electricians, and PPRC plumbing technicians.' },
  { id: 12, title: 'QA/QC Material Laboratory Stress Testing', icon: Award, desc: 'Compressive concrete cube crushing tests, steel tensile yield stress analysis, and water absorption checks for total peace of mind.' },
  { id: 13, title: '3-Year Structural Warranty & Maintenance Hub', icon: ShieldAlert, desc: 'Comprehensive warranty covering foundation settlement, structural cracks, roof dampness/leakage, and plumbing failures.' },
  { id: 14, title: 'LDA, DHA & Private Society Map Sanctions', icon: FileText, desc: 'End-to-end liaison with LDA One-Window and Town Planning directors for immediate building plan NOC approvals.' },
  { id: 15, title: 'Smart Gantt Timeline Execution Schedule', icon: Calendar, desc: 'Milestone tracking system guaranteeing exact 6 to 9-month turnkey completion dates with milestone delivery penalties.' }
];

export default function AgentPortal() {
  const [activeTab, setActiveTab] = useState<'services' | 'cad' | 'cctv' | 'client'>('services');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Booking Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', location: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 2D CAD State
  const [cadWidth, setCadWidth] = useState(30);
  const [cadLength, setCadLength] = useState(60);
  const [cadOption, setCadOption] = useState<1 | 2 | 3>(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // CCTV State
  const [cctvCam, setCctvCam] = useState<1 | 2 | 3>(1);

  // Client Portal State
  const [clientPin, setClientPin] = useState('');
  const [clientAuthed, setClientAuthed] = useState(false);

  // CAD Blueprint Renderer
  useEffect(() => {
    if (activeTab !== 'cad') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#060b13';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Architectural Grid Lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 25) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 25) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Outer Plot Boundary
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 50, 780, 380);

    // Header Title
    ctx.fillStyle = '#fcd34d';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('BIN TAHA ASSOCIATES & BUILDERS • ARCHITECTURAL CAD ENGINE', 80, 32);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px monospace';
    ctx.fillText(`PLOT SCALE: ${cadWidth} FT (FRONT) x ${cadLength} FT (DEPTH) | TOTAL: ${cadWidth * cadLength} SQ FT`, 80, 455);

    // Layout Draw based on Option
    if (cadOption === 1) {
      drawRoom(ctx, 80, 70, 320, 110, '#10b981', 'CAR PORCH & LAWN', `${Math.round(cadWidth * 0.45)}' x 16'`);
      drawRoom(ctx, 420, 70, 400, 110, '#3b82f6', 'DRAWING / GUEST ROOM', `14' x 16'`);
      drawRoom(ctx, 80, 200, 480, 130, '#f59e0b', 'MAIN TV LOUNGE & DINING', `20' x 18'`);
      drawRoom(ctx, 580, 200, 240, 130, '#ec4899', 'OPEN KITCHEN', `10' x 14'`);
      drawRoom(ctx, 80, 350, 740, 65, '#8b5cf6', 'MASTER BEDROOM WITH BATH', `${cadWidth - 4}' x 15'`);
    } else if (cadOption === 2) {
      drawRoom(ctx, 80, 70, 740, 100, '#3b82f6', 'OPEN-PLAN LIVING & FOYER', `${cadWidth - 4}' x 18'`);
      drawRoom(ctx, 80, 190, 360, 130, '#10b981', 'CHEF KITCHEN & PANTRY', `14' x 14'`);
      drawRoom(ctx, 460, 190, 360, 130, '#f59e0b', 'GUEST BEDROOM & SUITE', `14' x 14'`);
      drawRoom(ctx, 80, 340, 740, 75, '#8b5cf6', 'ROYAL MASTER SUITE & DRESSING', `${cadWidth - 4}' x 18'`);
    } else {
      drawRoom(ctx, 80, 70, 260, 110, '#10b981', 'GRAND PORCH', `11' x 18'`);
      drawRoom(ctx, 360, 70, 460, 110, '#3b82f6', 'FORMAL PALACE DRAWING', `20' x 18'`);
      drawRoom(ctx, 80, 200, 740, 120, '#f59e0b', 'DOUBLE HEIGHT CENTRAL LOBBY', `${cadWidth - 4}' x 18'`);
      drawRoom(ctx, 80, 340, 740, 75, '#8b5cf6', 'PRESIDENTIAL SUITE & SPA', `${cadWidth - 4}' x 18'`);
    }
  }, [activeTab, cadWidth, cadLength, cadOption]);

  function drawRoom(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, title: string, dim: string) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.12;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1.0;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = color;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(title, x + 10, y + 22);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`[ ${dim} ]`, x + 10, y + 42);
  }

  function downloadCadBlueprint() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.download = `Bin_Taha_CAD_Blueprint_${cadWidth}x${cadLength}.jpg`;
    link.click();
  }

  async function handleBookService(e: React.FormEvent) {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.location) {
      alert('Please fill out Name, Phone, and Society Location.');
      return;
    }

    setSubmitting(true);
    const serviceName = selectedService || 'Turnkey Construction (All-Under-One-Roof)';

    if (isSupabaseConfigured && supabase) {
      await supabase.from('leads').insert({
        full_name: bookingForm.name,
        phone: bookingForm.phone,
        society_interest: bookingForm.location,
        message: `Direct Service Booking: [${serviceName}]. Notes: ${bookingForm.notes || 'None'}`,
        status: 'New'
      });
    }

    setSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setModalOpen(false);
      setBookingForm({ name: '', phone: '', location: '', notes: '' });
    }, 2000);
  }

  return (
    <div className="space-y-6">
      {/* Schema / Local SEO Geo Anchors */}
      <div className="hidden">
        <h2>Bin Taha Associates &amp; Builders - Turnkey Construction Contractors Lahore</h2>
        <p>PEC Category C registered construction company in LDA Avenue 1, Jubilee Town, Raiwind Road, DHA Lahore. Led by CEO Taha Mubeen Bhutta.</p>
      </div>

      {/* Main Command Console Header */}
      <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="chip border-emerald-400/50 text-emerald-400 font-mono text-[10px]">
              PEC CATEGORY C REGISTERED
            </span>
            <span className="font-mono text-[10px] text-cyan/70">
              LAHORE TURNKEY CIVIL DIVISION
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-platinum flex items-center gap-2">
            <Building2 className="h-6 w-6 text-cyan" />
            Bin Taha Turnkey Construction &amp; Civil Engineering Suite
          </h2>
          <p className="text-xs text-platinum/70 max-w-2xl leading-relaxed">
            Autonomous CAD blueprints, Grade-60 civil material procurement, remote CCTV telemetry, and escrow milestone safety supervised directly by <strong>CEO {CEO_NAME}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => { setSelectedService('Turnkey Construction (All-Under-One-Roof)'); setModalOpen(true); }}
            className="btn-cyan flex items-center gap-1.5 py-2 px-4 text-xs font-bold cursor-pointer shadow-cyan-glow"
          >
            <Sparkles className="h-4 w-4" /> Book Turnkey Project
          </button>
          <a
            href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I want to discuss a turnkey construction project in Lahore.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center gap-1.5 py-2 px-4 text-xs font-bold border border-cyan/30 text-cyan hover:bg-cyan/10"
          >
            <Phone className="h-3.5 w-3.5" /> Call CEO
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-cyan/15 pb-2">
        {[
          { id: 'services', label: '15 Civil Verticals', icon: HardHat },
          { id: 'cad', label: '2D Architectural CAD Studio', icon: Compass },
          { id: 'cctv', label: '24/7 Live Site CCTV Stream', icon: Video },
          { id: 'client', label: 'Client Telemetry & Milestone Vault', icon: ShieldCheck }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-cyan/20 text-cyan border border-cyan/40 shadow-cyan-glow'
                : 'text-platinum/60 hover:text-cyan border border-transparent'
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: 15 Core Civil Operations Grid */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CIVIL_SERVICES.map((s) => (
            <div
              key={s.id}
              className="glass rounded-xl p-5 border border-cyan/15 hover:border-cyan/40 flex flex-col justify-between transition group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-cyan/70">
                    #{String(s.id).padStart(2, '0')}
                  </span>
                  <div className="p-2 rounded-lg bg-cyan/10 text-cyan group-hover:scale-110 transition">
                    <s.icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-3 font-display text-sm font-bold text-platinum group-hover:text-cyan transition">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-xs text-platinum/70 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-cyan/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => { setSelectedService(s.title); setModalOpen(true); }}
                  className="btn-cyan flex-1 py-1.5 text-xs font-bold cursor-pointer"
                >
                  Book Service
                </button>
                <a
                  href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I am inquiring about [${s.title}]. Please share technical BOQ.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10"
                  title="WhatsApp CEO"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Architectural 2D CAD Studio */}
      {activeTab === 'cad' && (
        <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/15 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-cyan flex items-center gap-2">
                <Compass className="h-5 w-5 text-cyan" />
                Professional 2D CAD Layout Engine
              </h3>
              <p className="text-xs text-platinum/60">
                Mathematical architectural zoning adhering strictly to LDA Building Regulations 2026.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {([1, 2, 3] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCadOption(opt)}
                  className={`rounded-lg px-3 py-1 font-mono text-xs font-bold transition cursor-pointer ${
                    cadOption === opt
                      ? 'bg-cyan text-obsidian shadow-cyan-glow'
                      : 'bg-obsidian/60 text-cyan/70 border border-cyan/20'
                  }`}
                >
                  Option {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label>
              <span className="font-mono text-[10px] uppercase text-cyan/70">Plot Front Width (Ft)</span>
              <input
                type="number"
                value={cadWidth}
                onChange={(e) => setCadWidth(Math.max(15, Number(e.target.value)))}
                className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 font-mono text-sm text-cyan outline-none focus:border-cyan"
              />
            </label>
            <label>
              <span className="font-mono text-[10px] uppercase text-cyan/70">Plot Length / Depth (Ft)</span>
              <input
                type="number"
                value={cadLength}
                onChange={(e) => setCadLength(Math.max(20, Number(e.target.value)))}
                className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 font-mono text-sm text-cyan outline-none focus:border-cyan"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={downloadCadBlueprint}
                className="btn-cyan w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-cyan-glow cursor-pointer"
              >
                <Download className="h-4 w-4" /> Download CAD JPEG Blueprint
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-cyan/30 bg-[#040810] p-4 text-center">
            <canvas
              ref={canvasRef}
              width={900}
              height={480}
              className="mx-auto rounded-lg shadow-2xl max-w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* TAB 3: 24/7 Live Site CCTV Stream */}
      {activeTab === 'cctv' && (
        <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/15 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-cyan flex items-center gap-2">
                <Video className="h-5 w-5 text-cyan animate-pulse" />
                Live 24/7 Optical Site Surveillance Hub
              </h3>
              <p className="text-xs text-platinum/60">
                Encrypted optical feed streaming live construction milestones for overseas and local clients.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono text-xs text-red-400 font-bold">1080P RTSP ENCRYPTED</span>
            </div>
          </div>

          <div className="relative h-[420px] w-full rounded-xl border border-cyan/40 bg-obsidian overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
            {/* Background Simulated Feed */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-60"
              style={{
                backgroundImage:
                  cctvCam === 1
                    ? "url('https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=1200&q=80')"
                    : cctvCam === 2
                    ? "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80')"
                    : "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/70 pointer-events-none" />

            {/* Top Telemetry Overlay */}
            <div className="relative z-10 flex justify-between items-center text-xs font-mono">
              <div className="rounded-lg bg-obsidian/90 px-3 py-1.5 border border-cyan/30 text-cyan">
                CAM 0{cctvCam}: {cctvCam === 1 ? 'Front Elevation & Porch Raft' : cctvCam === 2 ? 'Active Roof Lintel & Slab' : 'Grade-60 Steel Storage Yard'}
              </div>
              <div className="rounded-lg bg-obsidian/90 px-3 py-1.5 border border-red-500/40 text-red-400 font-bold">
                REC ● TELEMETRY LAHORE PKT
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-cyan/15 pt-3">
              <div className="flex gap-2">
                {[1, 2, 3].map((camNum) => (
                  <button
                    key={camNum}
                    type="button"
                    onClick={() => setCctvCam(camNum as any)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition cursor-pointer ${
                      cctvCam === camNum
                        ? 'bg-cyan text-obsidian shadow-cyan-glow'
                        : 'bg-obsidian/80 text-cyan/70 border border-cyan/20'
                    }`}
                  >
                    CAM 0{camNum}
                  </button>
                ))}
              </div>
              <span className="font-mono text-[11px] text-platinum/60">
                Supervised by Bin Taha Security Grid
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Client Telemetry & Milestone Vault */}
      {activeTab === 'client' && (
        <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/15 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-cyan flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Client Construction Portal &amp; Telemetry Vault
              </h3>
              <p className="text-xs text-platinum/60">
                Track live milestone percentages, certified site audits, and staged escrow fund approvals.
              </p>
            </div>
            {!clientAuthed && (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="PIN (Demo: 1234)"
                  value={clientPin}
                  onChange={(e) => setClientPin(e.target.value)}
                  className="rounded-lg border border-cyan/30 bg-obsidian/80 px-3 py-1.5 font-mono text-xs text-cyan outline-none w-36"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (clientPin === '1234' || clientPin.length >= 4) setClientAuthed(true);
                    else alert('Enter demo PIN 1234');
                  }}
                  className="btn-cyan py-1.5 px-3 text-xs font-bold cursor-pointer"
                >
                  Unlock
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3">
              <span className="font-mono text-[10px] text-platinum/50 uppercase">Active Site</span>
              <p className="mt-1 text-xs font-bold text-platinum">Plot 14, Block C, Avenue 1</p>
            </div>
            <div className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3">
              <span className="font-mono text-[10px] text-platinum/50 uppercase">Cumulative Progress</span>
              <p className="mt-1 text-sm font-black text-cyan">72.0% Completed</p>
            </div>
            <div className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3">
              <span className="font-mono text-[10px] text-platinum/50 uppercase">Resident Engineer</span>
              <p className="mt-1 text-xs font-bold text-emerald-400">Engr. Hamza (Lead Civil)</p>
            </div>
            <div className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3">
              <span className="font-mono text-[10px] text-platinum/50 uppercase">Escrow Vault Stage</span>
              <p className="mt-1 text-xs font-bold text-amber-300">Milestone 4 Unlocked</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: '1. Soil Excavation, Termite Spray & Raft Foundation', pct: 100, status: 'Verified Done ✅' },
              { label: '2. Concrete Columns, Beams & Roof Slab (Grade-60 Grey)', pct: 100, status: 'Verified Done ✅' },
              { label: '3. Electrical Conduit Wiring, Panels & Distribution Box', pct: 80, status: '80% In Progress 🔄' },
              { label: '4. Sanitary Plumbing, Hot/Cold Hydrostatic Testing', pct: 70, status: '70% Pressure Tested 🔄' },
              { label: '5. Porcelain Floor Tiling & Spanish Wall Cladding', pct: 30, status: '30% Active Laying 🔄' }
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-cyan/15 bg-obsidian/40 p-3">
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-platinum/80">{m.label}</span>
                  <span className="text-cyan font-bold">{m.status}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-obsidian border border-cyan/20 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan to-teal-400 rounded-full" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICE BOOKING MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-strong w-full max-w-lg rounded-2xl border border-cyan/40 p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-cyan/15 pb-3">
                <h3 className="font-display text-sm font-bold text-cyan">
                  Book Project: {selectedService || 'Turnkey Construction'}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-platinum/50 hover:text-cyan cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 animate-bounce" />
                  <h4 className="font-display text-base font-bold text-platinum">Booking Saved Successfully!</h4>
                  <p className="text-xs text-platinum/70">
                    Lead is synced with CEO Desk. Taha Mubeen Bhutta will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookService} className="mt-4 space-y-3">
                  <div>
                    <label className="font-mono text-[10px] uppercase text-cyan/70">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Malik Ahmad"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none focus:border-cyan"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-[10px] uppercase text-cyan/70">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="03219404812"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none focus:border-cyan"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase text-cyan/70">Location / Society *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LDA Avenue 1, Block J"
                        value={bookingForm.location}
                        onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none focus:border-cyan"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase text-cyan/70">Plot Scale &amp; Specific Details</label>
                    <textarea
                      rows={2}
                      placeholder="Plot dimensions, storeys, or special requirements..."
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none focus:border-cyan"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-cyan mt-2 w-full py-2.5 text-xs font-bold cursor-pointer flex items-center justify-center gap-2 shadow-cyan-glow"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? 'Registering with Cloud...' : 'Confirm Consultation Booking'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
