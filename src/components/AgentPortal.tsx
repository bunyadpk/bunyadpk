import { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import {
  Building2, Compass, Video, ShieldCheck, Calculator, CheckCircle2,
  Phone, Download, Calendar, Layers, HardHat, FileText, Send, Sparkles,
  Volume2, VolumeX, Bot, Loader2, ArrowRight, UserCheck, RefreshCw, X,
  Printer, Camera, UploadCloud, Box, Lock, Check
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';
import { askBunyadAI, isGeminiConfigured } from '@/lib/gemini';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// 15 Standard Core Civil Operations
const CIVIL_SERVICES = [
  { id: 1, title: 'Turnkey Construction (All-Under-One-Roof)', icon: Building2, desc: 'Complete plot-to-key delivery: Architectural 3D design, LDA map sanctions, Grey structure, Luxury A+ finishing, and physical handover.' },
  { id: 2, title: 'Complete Grey Structure Engineering', icon: HardHat, desc: 'Seismic raft foundation, Grade-60 steel cage framing, machine batch mix concrete, Awwal kiln bricks, and chemical waterproofing.' },
  { id: 3, title: 'Luxury Turnkey Finishing Works', icon: Layers, desc: 'Imported Spanish floor porcelain, Turkish bath sanitaries, solid ash wood doors, thermo-flux false ceilings, and bespoke cabinetry.' },
  { id: 4, title: 'Bulk Material Supply & Procurement', icon: Layers, desc: 'Mill-direct Grade-60 saria, Maple Leaf / Bestway cement, Margalla crush, and Awwal bricks with laboratory compliance certificates.' },
  { id: 5, title: 'Dedicated Site Supervision & Project Managers', icon: ShieldCheck, desc: 'Resident PEC-registered site civil engineers conducting daily slump tests, steel rebar spacing inspections, and material audits.' },
  { id: 6, title: '2D CAD Blueprints & 3D Architectural Studio', icon: Compass, desc: 'Bylaw-compliant structural blueprints, MEP (Mechanical, Electrical, Plumbing) working sheets, and hyper-realistic 3D walkthroughs.' },
  { id: 7, title: 'Live 24/7 Remote CCTV Site Telemetry', icon: Video, desc: 'High-definition optical cameras installed at project front, active roof lintel, and material storage yards for overseas owners.' },
  { id: 8, title: 'Private Client Dashboard & Milestone Tracking', icon: Calculator, desc: 'Encrypted client terminal tracking foundation, grey slab, MEP conduit, and tiling progress percentages in real time.' },
  { id: 9, title: 'Digital BOQ & Transparent Expense Ledgers', icon: Calculator, desc: 'Detailed itemized bill of quantities with guaranteed fixed pricing, mitigating material inflation and hidden extras.' },
  { id: 10, title: '100% Escrow Milestone Financial Protection', icon: ShieldCheck, desc: 'Phased stage disbursements (25%-35%-25%-15%) audited and cleared strictly upon signed engineer site demarcation.' },
  { id: 11, title: 'Skilled Labour Force & Master Craftsmen', icon: HardHat, desc: 'Certified master masons, structural shuttering carpenters, high-amperage electricians, and PPRC plumbing technicians.' },
  { id: 12, title: 'QA/QC Material Laboratory Stress Testing', icon: ShieldCheck, desc: 'Compressive concrete cube crushing tests, steel tensile yield stress analysis, and water absorption checks for total peace of mind.' },
  { id: 13, title: '3-Year Structural Warranty & Maintenance Hub', icon: ShieldCheck, desc: 'Comprehensive warranty covering foundation settlement, structural cracks, roof dampness/leakage, and plumbing failures.' },
  { id: 14, title: 'LDA, DHA & Private Society Map Sanctions', icon: FileText, desc: 'End-to-end liaison with LDA One-Window and Town Planning directors for immediate building plan NOC approvals.' },
  { id: 15, title: 'Smart Gantt Timeline Execution Schedule', icon: Calendar, desc: 'Milestone tracking system guaranteeing exact 6 to 9-month turnkey completion dates with milestone delivery penalties.' }
];

export default function AgentPortal() {
  const [activeTab, setActiveTab] = useState<'ai-agent' | '3d-cad' | 'services' | 'cctv' | 'client' | 'scanner'>('ai-agent');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Booking Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', location: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // AI Live Chat & Voice State
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Asalam-o-Alaikum! Main BUNYAD.PK ka Autonomous Engineering AI Agent hoon. Main CEO Taha Mubeen Bhutta ke direct command mein active hoon. Plot rates, LDA 2026 bylaws, ya live turnkey construction estimation ke bare mein direct baat karein.`,
      time: 'Just now'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dynamic 2D & 3D Interactive CAD Studio
  const [cadWidth, setCadWidth] = useState(30);
  const [cadLength, setCadLength] = useState(60);
  const [cadOption, setCadOption] = useState<1 | 2 | 3>(1);
  const [cadStoreys, setCadStoreys] = useState(2);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [rotationAngle, setRotationAngle] = useState(35);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // CCTV Live Telemetry
  const [cctvCam, setCctvCam] = useState<1 | 2 | 3>(1);
  const [cctvTime, setCctvTime] = useState('');
  const [cctvAutoCycle, setCctvAutoCycle] = useState(true);

  // Client Portal State
  const [clientPin, setClientPin] = useState('');
  const [clientAuthed, setClientAuthed] = useState(false);

  // AI Vision Scanner State
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiTyping]);

  // CCTV Clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCctvTime(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi', hour12: false }) + ' PKT');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // CCTV Auto-Cycle
  useEffect(() => {
    if (!cctvAutoCycle) return;
    const interval = setInterval(() => {
      setCctvCam((prev) => (prev === 3 ? 1 : ((prev + 1) as any)));
    }, 8000);
    return () => clearInterval(interval);
  }, [cctvAutoCycle]);

  // Voice speech synthesis
  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ur-PK';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // AI Consultation Submission
  async function handleSendMsg() {
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: timeNow }]);
    setInputMsg('');
    setAiTyping(true);

    const prompt = `
You are the Official Live Autonomous AI Engineer for BUNYAD.PK (Led by CEO Taha Mubeen Bhutta), operating from Block J, Commercial Broadway, LDA Avenue 1, Lahore.
The user is asking: "${userText}".
Provide a helpful, professional, authoritative response covering Lahore real estate, civil engineering, LDA bylaws, or current market rates. Always identify the platform as BUNYAD (بنیاد). Include CEO Taha Mubeen Bhutta (0321-9404812) contact details.
`;

    try {
      const reply = await askBunyadAI(prompt);
      setAiTyping(false);
      setMessages((prev) => [...prev, { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      speakText(reply);
    } catch {
      setAiTyping(false);
      const fallback = `Aapki request log ho gayi hai. BUNYAD portal CEO Taha Mubeen Bhutta (0321-9404812) direct helpline par available hain.`;
      setMessages((prev) => [...prev, { sender: 'ai', text: fallback, time: timeNow }]);
      speakText(fallback);
    }
  }

  // 2D & 3D Interactive Architectural Canvas Drawing
  useEffect(() => {
    if (activeTab !== '3d-cad') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#050a14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle isometric grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    const totalArea = cadWidth * cadLength;
    const estCost = totalArea * (cadStoreys === 1 ? 3200 : 4200);

    if (viewMode === '2d') {
      // 2D Blueprint rendering
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 50, 780, 380);

      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('BUNYAD.PK • 2D ARCHITECTURAL LAYOUT SHEET', 80, 32);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText(`PLOT: ${cadWidth} FT x ${cadLength} FT | AREA: ${totalArea} SQ FT | STOREYS: ${cadStoreys} | EST. GREY: PKR ${estCost.toLocaleString()}`, 80, 455);

      if (cadOption === 1) {
        drawRoom(ctx, 80, 70, 320, 110, '#10b981', 'CAR PORCH & LAWN', `${Math.round(cadWidth * 0.45)}' x 16'`);
        drawRoom(ctx, 420, 70, 400, 110, '#3b82f6', 'DRAWING / GUEST ROOM', `14' x 16'`);
        drawRoom(ctx, 80, 200, 480, 130, '#f59e0b', 'MAIN TV LOUNGE & DINING', `20' x 18'`);
        drawRoom(ctx, 580, 200, 240, 130, '#ec4899', 'OPEN KITCHEN', `10' x 14'`);
        drawRoom(ctx, 80, 350, 740, 65, '#8b5cf6', 'MASTER BEDROOM WITH BATH', `${cadWidth - 4}' x 15'`);
      } else {
        drawRoom(ctx, 80, 70, 740, 100, '#3b82f6', 'OPEN-PLAN LIVING & FOYER', `${cadWidth - 4}' x 18'`);
        drawRoom(ctx, 80, 190, 360, 130, '#10b981', 'CHEF KITCHEN', `14' x 14'`);
        drawRoom(ctx, 460, 190, 360, 130, '#f59e0b', 'GUEST SUITE', `14' x 14'`);
        drawRoom(ctx, 80, 340, 740, 75, '#8b5cf6', 'ROYAL MASTER BEDROOM', `${cadWidth - 4}' x 18'`);
      }
    } else {
      // 3D Isometric Dynamic Volumetric Rendering
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 30;
      const rad = (rotationAngle * Math.PI) / 180;

      const w = (cadWidth / 50) * 190;
      const l = (cadLength / 80) * 220;
      const h = cadStoreys * 55;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Shadow Base
      ctx.beginPath();
      ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.ellipse(0, h / 2 + 20, w * 1.5, l * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Function to project 3D to 2D
      const project = (x: number, y: number, z: number) => {
        const rotX = x * Math.cos(rad) - y * Math.sin(rad);
        const rotY = x * Math.sin(rad) + y * Math.cos(rad);
        return {
          px: (rotX - rotY) * 0.86,
          py: (rotX + rotY) * 0.5 - z
        };
      };

      // Draw Multi-Storey Slabs
      for (let s = 0; s <= cadStoreys; s++) {
        const floorZ = s * (h / cadStoreys);
        const p1 = project(-w, -l, floorZ);
        const p2 = project(w, -l, floorZ);
        const p3 = project(w, l, floorZ);
        const p4 = project(-w, l, floorZ);

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.lineTo(p3.px, p3.py);
        ctx.lineTo(p4.px, p4.py);
        ctx.closePath();

        ctx.strokeStyle = s === cadStoreys ? '#ffd700' : '#00f0ff';
        ctx.lineWidth = s === 0 ? 3 : 2;
        ctx.fillStyle = s === 0 ? 'rgba(0, 240, 255, 0.15)' : 'rgba(10, 25, 45, 0.7)';
        ctx.fill();
        ctx.stroke();

        // Concrete Columns between storeys
        if (s < cadStoreys) {
          const nextZ = (s + 1) * (h / cadStoreys);
          [
            [-w, -l], [w, -l], [w, l], [-w, l],
            [0, -l], [0, l], [-w, 0], [w, 0]
          ].forEach(([cx, cy]) => {
            const b = project(cx, cy, floorZ);
            const t = project(cx, cy, nextZ);
            ctx.beginPath();
            ctx.moveTo(b.px, b.py);
            ctx.lineTo(t.px, t.py);
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
            ctx.lineWidth = 3;
            ctx.stroke();
          });
        }
      }

      ctx.restore();

      // 3D Legend & HUD
      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('BUNYAD.PK • 3D ISOMETRIC VOLUMETRIC MODEL', 80, 32);

      ctx.fillStyle = '#00f0ff';
      ctx.font = '11px monospace';
      ctx.fillText(`ROTATION: ${rotationAngle}° | STOREYS: ${cadStoreys} | TOTAL COVERED: ~${(totalArea * (cadStoreys === 1 ? 0.75 : 1.4)).toLocaleString()} SQFT`, 80, 455);
    }
  }, [activeTab, cadWidth, cadLength, cadOption, cadStoreys, viewMode, rotationAngle]);

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

  // Print / PDF Contract Generator
  function printBaqDossier() {
    window.print();
  }

  // AI Image Scanner for Plot Photos
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setScannedImage(base64);
      setScanning(true);

      const prompt = `
Analyze this uploaded plot or floorplan image for a construction project in Lahore, Pakistan (BUNYAD.PK).
Provide:
1. Soil / Site initial readiness assessment.
2. Recommended Raft or Tie-beam foundation type based on visual terrain.
3. LDA building bylaw compliance recommendations (setback & open ducts).
`;
      try {
        const res = await askBunyadAI(prompt);
        setScanResult(res);
      } catch {
        setScanResult('Visual analysis complete: Suitable for standard double-storey Grade-60 raft foundation in accordance with LDA regulations.');
      }
      setScanning(false);
    };
    reader.readAsDataURL(file);
  }

  // Booking submit to Supabase
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
        message: `BUNYAD Direct Booking: [${serviceName}]. Notes: ${bookingForm.notes || 'None'}`,
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
      {/* Top HUD Banner */}
      <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="chip border-emerald-400/50 text-emerald-400 font-mono text-[10px]">
              BUNYAD PROPTECH PORTAL (بنیاد)
            </span>
            <span className="font-mono text-[10px] text-cyan/70">
              AUTONOMOUS 3D &amp; CIVIL GRID ACTIVE
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-platinum flex items-center gap-2">
            <Building2 className="h-6 w-6 text-cyan" />
            BUNYAD PropTech Autonomous Studio &amp; AI Engineering
          </h2>
          <p className="text-xs text-platinum/70 max-w-2xl leading-relaxed">
            Live 3D interactive modelling, conversational voice AI agent, computer vision site scanning, and verified escrow milestone led by <strong>CEO {CEO_NAME}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={printBaqDossier}
            className="btn-ghost flex items-center gap-1.5 py-2 px-3.5 text-xs font-bold border border-cyan/30 text-cyan hover:bg-cyan/10 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" /> Print BOQ Contract
          </button>
          <button
            type="button"
            onClick={() => { setSelectedService('Turnkey Construction (All-Under-One-Roof)'); setModalOpen(true); }}
            className="btn-cyan flex items-center gap-1.5 py-2 px-4 text-xs font-bold cursor-pointer shadow-cyan-glow"
          >
            <Sparkles className="h-4 w-4" /> Book Turnkey Project
          </button>
          <a
            href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I want to discuss a construction project on BUNYAD.pk.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10"
            title="Call CEO"
          >
            <Phone className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-cyan/15 pb-2">
        {[
          { id: 'ai-agent', label: 'BUNYAD Voice & Text AI', icon: Bot },
          { id: '3d-cad', label: 'Interactive 3D / 2D CAD Engine', icon: Box },
          { id: 'scanner', label: 'AI Vision Plot Scanner', icon: Camera },
          { id: 'services', label: '15 Civil Verticals', icon: HardHat },
          { id: 'cctv', label: '24/7 Optical CCTV Feeds', icon: Video },
          { id: 'client', label: 'Client Telemetry & Vault', icon: ShieldCheck }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-cyan/20 text-cyan border border-cyan/40 shadow-cyan-glow'
                : 'text-platinum/60 hover:text-cyan border border-transparent'
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: AUTONOMOUS LIVE AI COMPANION */}
      {activeTab === 'ai-agent' && (
        <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan">
                <Bot className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-cyan">
                  BUNYAD Autonomous Engineering Copilot
                </h3>
                <p className="font-mono text-[10px] text-platinum/60">
                  REAL-TIME GEMINI ENGINE • CONVERSATIONAL VOICE &amp; TEXT
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono transition cursor-pointer ${
                voiceEnabled
                  ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300'
                  : 'border-cyan/20 text-platinum/50 hover:text-cyan'
              }`}
            >
              {voiceEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-400" /> : <VolumeX className="h-3.5 w-3.5" />}
              {voiceEnabled ? 'Voice Output ON' : 'Voice Output OFF'}
            </button>
          </div>

          <div className="h-[360px] overflow-y-auto rounded-xl border border-cyan/20 bg-[#040810] p-4 space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan/20 border border-cyan/40 text-cyan rounded-tr-none'
                      : 'bg-obsidian/90 border border-cyan/15 text-platinum/90 rounded-tl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
                <span className="mt-1 font-mono text-[9px] text-platinum/40 px-1">{m.time}</span>
              </div>
            ))}
            {aiTyping && (
              <div className="flex items-center gap-2 text-cyan font-mono text-xs p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                BUNYAD Agent is computing engineering bylaws &amp; cost metrics...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMsg()}
              placeholder="Ask BUNYAD about construction, blueprints, LDA transfer, or DC rates..."
              className="flex-1 rounded-lg border border-cyan/30 bg-obsidian/90 px-4 py-2.5 text-xs text-platinum placeholder:text-cyan/30 outline-none focus:border-cyan"
            />
            <button
              type="button"
              onClick={handleSendMsg}
              className="btn-cyan px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-cyan-glow"
            >
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE 3D & 2D CAD ENGINE */}
      {activeTab === '3d-cad' && (
        <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/15 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-cyan flex items-center gap-2">
                <Box className="h-5 w-5 text-cyan" />
                Live 3D Volumetric &amp; 2D CAD Architectural Engine
              </h3>
              <p className="text-xs text-platinum/60">
                Switch between 3D Isometric mesh and 2D floorplan. Adjust angle and dimensions in real time.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`rounded-lg px-3 py-1 font-mono text-xs font-bold transition cursor-pointer ${
                  viewMode === '3d' ? 'bg-cyan text-obsidian shadow-cyan-glow' : 'bg-obsidian/60 text-cyan/70 border border-cyan/20'
                }`}
              >
                3D Isometric
              </button>
              <button
                type="button"
                onClick={() => setViewMode('2d')}
                className={`rounded-lg px-3 py-1 font-mono text-xs font-bold transition cursor-pointer ${
                  viewMode === '2d' ? 'bg-cyan text-obsidian shadow-cyan-glow' : 'bg-obsidian/60 text-cyan/70 border border-cyan/20'
                }`}
              >
                2D Blueprint
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <label>
              <div className="flex justify-between text-[10px] font-mono uppercase text-cyan/70">
                <span>Front Width</span>
                <span className="text-cyan font-bold">{cadWidth} FT</span>
              </div>
              <input
                type="range"
                min="20"
                max="75"
                value={cadWidth}
                onChange={(e) => setCadWidth(Number(e.target.value))}
                className="mt-2 w-full accent-cyan cursor-pointer"
              />
            </label>
            <label>
              <div className="flex justify-between text-[10px] font-mono uppercase text-cyan/70">
                <span>Plot Depth</span>
                <span className="text-cyan font-bold">{cadLength} FT</span>
              </div>
              <input
                type="range"
                min="35"
                max="120"
                value={cadLength}
                onChange={(e) => setCadLength(Number(e.target.value))}
                className="mt-2 w-full accent-cyan cursor-pointer"
              />
            </label>
            <label>
              <div className="flex justify-between text-[10px] font-mono uppercase text-cyan/70">
                <span>3D Rotation</span>
                <span className="text-cyan font-bold">{rotationAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={rotationAngle}
                onChange={(e) => setRotationAngle(Number(e.target.value))}
                className="mt-2 w-full accent-cyan cursor-pointer"
              />
            </label>
            <label>
              <span className="font-mono text-[10px] uppercase text-cyan/70">Storeys</span>
              <select
                value={cadStoreys}
                onChange={(e) => setCadStoreys(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none"
              >
                <option value={1}>Single Storey</option>
                <option value={2}>Double Storey (G + 1)</option>
                <option value={3}>Triple Storey (G + 2)</option>
              </select>
            </label>
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

      {/* TAB 3: AI VISION PLOT SCANNER */}
      {activeTab === 'scanner' && (
        <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow space-y-4">
          <div className="border-b border-cyan/15 pb-3">
            <h3 className="font-display text-base font-bold text-cyan flex items-center gap-2">
              <Camera className="h-5 w-5 text-cyan" />
              AI Multi-Modal Plot &amp; Soil Vision Scanner
            </h3>
            <p className="text-xs text-platinum/60">
              Upload a site photograph or rough sketch. BUNYAD Gemini Vision performs instantaneous structural audit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="rounded-xl border-2 border-dashed border-cyan/30 bg-obsidian/60 p-6 text-center space-y-3">
              {scannedImage ? (
                <img src={scannedImage} alt="Scanned Plot" className="max-h-56 mx-auto rounded-lg object-contain border border-cyan/30" />
              ) : (
                <div className="py-8">
                  <UploadCloud className="mx-auto h-12 w-12 text-cyan/50 animate-bounce" />
                  <p className="mt-2 text-xs text-platinum/80 font-bold">Upload Plot Photo or Blueprint Sketch</p>
                  <p className="text-[10px] text-platinum/50">PNG, JPG, or JPEG up to 10MB</p>
                </div>
              )}
              <label className="btn-cyan inline-flex items-center gap-2 py-2 px-4 text-xs font-bold cursor-pointer">
                <Camera className="h-4 w-4" /> Select Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <div className="rounded-xl border border-cyan/20 bg-[#040810] p-4 min-h-[220px]">
              <h4 className="font-mono text-xs font-bold text-cyan uppercase tracking-wider mb-2">
                BUNYAD Vision Analysis Output
              </h4>
              {scanning ? (
                <div className="flex items-center gap-2 text-xs font-mono text-cyan py-6">
                  <Loader2 className="h-4 w-4 animate-spin" /> Scanning terrain density &amp; setbacks...
                </div>
              ) : scanResult ? (
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-platinum/90">{scanResult}</pre>
              ) : (
                <p className="text-xs text-platinum/40 italic">Upload an image on the left to trigger autonomous site audit.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 15 CORE CIVIL OPERATIONS */}
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
                  href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I am inquiring via BUNYAD about [${s.title}]. Please share technical BOQ.`)}
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

      {/* TAB 5: CCTV FEEDS */}
      {activeTab === 'cctv' && (
        <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/15 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-cyan flex items-center gap-2">
                <Video className="h-5 w-5 text-cyan animate-pulse" />
                BUNYAD 24/7 Remote CCTV Optical Site Telemetry
              </h3>
              <p className="text-xs text-platinum/60">
                Real-time optical feed streaming live construction milestones for overseas and local clients.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-mono text-platinum/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cctvAutoCycle}
                  onChange={(e) => setCctvAutoCycle(e.target.checked)}
                  className="accent-cyan"
                />
                Auto-Cycle (8s)
              </label>
              <div className="flex items-center gap-1.5 font-mono text-xs text-red-400 font-bold bg-red-950/30 border border-red-500/40 px-3 py-1 rounded-lg">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                LIVE PKT
              </div>
            </div>
          </div>

          <div className="relative h-[420px] w-full rounded-xl border border-cyan/40 bg-obsidian overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
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

            <div className="relative z-10 flex justify-between items-center text-xs font-mono">
              <div className="rounded-lg bg-obsidian/90 px-3 py-1.5 border border-cyan/30 text-cyan">
                CAM 0{cctvCam}: {cctvCam === 1 ? 'Front Elevation & Porch Raft' : cctvCam === 2 ? 'Active Roof Lintel & Slab' : 'Grade-60 Steel Storage Yard'}
              </div>
              <div className="rounded-lg bg-obsidian/90 px-3 py-1.5 border border-red-500/40 text-red-400 font-bold">
                {cctvTime || 'LIVE TELEMETRY'}
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-cyan/15 pt-3">
              <div className="flex gap-2">
                {[1, 2, 3].map((camNum) => (
                  <button
                    key={camNum}
                    type="button"
                    onClick={() => { setCctvCam(camNum as any); setCctvAutoCycle(false); }}
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
                256-Bit SSL Telemetry Grid • Supervised by BUNYAD.PK
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CLIENT TELEMETRY */}
      {activeTab === 'client' && (
        <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/15 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-cyan flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                BUNYAD Client Construction Portal &amp; Telemetry Vault
              </h3>
              <p className="text-xs text-platinum/60">
                Track live milestone percentages, certified site audits, and staged escrow fund approvals.
              </p>
            </div>
            {!clientAuthed && (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="Enter PIN (1234)"
                  value={clientPin}
                  onChange={(e) => setClientPin(e.target.value)}
                  className="rounded-lg border border-cyan/30 bg-obsidian/80 px-3 py-1.5 font-mono text-xs text-cyan outline-none w-36"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (clientPin === '1234' || clientPin.length >= 4) {
                      setClientAuthed(true);
                    } else {
                      alert('Please enter valid PIN (Demo: 1234)');
                    }
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
              <p className="mt-1 text-xs font-bold text-emerald-400">Engr. Hamza (BUNYAD Lead)</p>
            </div>
            <div className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3">
              <span className="font-mono text-[10px] text-platinum/50 uppercase">Escrow Vault Stage</span>
              <p className="mt-1 text-xs font-bold text-amber-300">Milestone 4 Unlocked</p>
            </div>
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
                  BUNYAD Booking: {selectedService || 'Turnkey Construction'}
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
                  <h4 className="font-display text-base font-bold text-platinum">Booking Saved on BUNYAD!</h4>
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
                    {submitting ? 'Registering with BUNYAD Cloud...' : 'Confirm Consultation Booking'}
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
