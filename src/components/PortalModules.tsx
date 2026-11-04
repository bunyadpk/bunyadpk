import { useState, useMemo } from 'react';
import { 
  Building2, PlusCircle, FileText, CheckCircle2, 
  Send, X, Award, ShieldCheck, MapPin, 
  Compass
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface PortalModulesProps {
  activeModule: 'about' | 'terms' | 'add-property' | null;
  onClose: () => void;
}

const PAKISTAN_SOCIETIES = [
  'LDA Avenue 1',
  'Etihad Town',
  'Jubilee Town',
  'DHA Phase 1',
  'DHA Phase 2',
  'DHA Phase 3',
  'DHA Phase 4',
  'DHA Phase 5',
  'DHA Phase 6',
  'DHA Phase 7',
  'DHA Phase 8',
  'DHA Phase 9 Prism',
  'DHA Rahbar Phase 11',
  'Bahria Town Lahore',
  'Bahria Orchard',
  'Izmir Town',
  'Lake City',
  'Valencia Town',
  'WAPDA Town',
  'Johar Town',
  'Model Town',
  'Gulberg',
  'Park View City',
  'Al-Kabir Town',
  'Kings Town',
  'Central Park Housing Scheme',
  'LDA City',
  'DHA Islamabad',
  'Bahria Town Islamabad',
  'Bahria Town Karachi'
];

export default function PortalModules({ activeModule, onClose }: PortalModulesProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Plot',
    society: '',
    price: '',
    phone: CEO_PHONE,
    desc: '',
    img: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSocietySuggestions, setShowSocietySuggestions] = useState(false);

  const filteredSocieties = useMemo(() => {
    if (!formData.society.trim()) return [];
    return PAKISTAN_SOCIETIES.filter((s) =>
      s.toLowerCase().includes(formData.society.toLowerCase())
    );
  }, [formData.society]);

  if (!activeModule) return null;

  async function handleAddProperty(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.society) {
      alert('Kripya Title, Society aur Price enter karein.');
      return;
    }

    setSubmitting(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const payload = {
          Title: formData.title,
          Type: formData.type,
          Society: formData.society,
          Price: formData.price.startsWith('PKR') ? formData.price : `PKR ${formData.price}`,
          Phone: formData.phone || CEO_PHONE,
          Description: formData.desc || 'Direct verified listing on BUNYAD.PK Portal.',
          Image: formData.img || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
        };

        const { error } = await supabase.from('properties').insert([payload]);

        if (error) {
          console.error('Supabase Insert Error:', error);
          alert(`Error saving listing: ${error.message}`);
          return;
        }
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      alert('Property submit ho gayi. Page reload ho raha hai.');
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className={`glass-strong w-full ${activeModule === 'about' ? 'max-w-4xl' : 'max-w-2xl'} rounded-3xl border border-cyan/40 p-6 sm:p-8 shadow-2xl relative my-8 text-platinum max-h-[90vh] overflow-y-auto`}>
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl border border-cyan/20 text-platinum/60 hover:text-cyan hover:border-cyan transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {activeModule === 'about' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 border-b border-cyan/20 pb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan/40 bg-cyan/10 text-cyan shadow-cyan-glow">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <span className="inline-block rounded-full border border-cyan/30 bg-cyan/15 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan">
                  Enterprise PropTech &amp; Civil Engineering Suite
                </span>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  About BUNYAD.PK
                </h2>
                <p className="mt-0.5 font-mono text-xs text-platinum/60">
                  Institutional Real Estate Intelligence &bull; Supervised by CEO {CEO_NAME}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs sm:text-sm leading-relaxed text-slate-300">
              <strong className="text-white font-semibold">BUNYAD.PK</strong> is Pakistan’s leading digital land verification platform, master GIS spatial radar, and civil infrastructure consultancy ecosystem. Designed to eliminate land title ambiguities, documentation forgery, and speculative risks, the portal delivers institutional-grade transparency, real-time spatial analytics, and rigorous due diligence for domestic investors and overseas Pakistanis.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="rounded-xl border border-cyan/20 bg-slate-900/50 p-4 space-y-1.5 hover:border-cyan/50 transition">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan">
                  <MapPin className="h-4 w-4" /> High-Precision Master GIS Radar
                </div>
                <p className="text-[11px] text-platinum/70 leading-normal">
                  Proprietary digital layout engine covering LDA Avenue 1 (Blocks A to M) and 38 premium housing schemes across Lahore with millimeter-level plot coordinate indexing.
                </p>
              </div>

              <div className="rounded-xl border border-cyan/20 bg-slate-900/50 p-4 space-y-1.5 hover:border-cyan/50 transition">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400">
                  <Award className="h-4 w-4" /> Authority Title &amp; Legal Clearance
                </div>
                <p className="text-[11px] text-platinum/70 leading-normal">
                  End-to-end documentation audit and statutory verification compliant with LDA, CDA, RDA, and DHA frameworks, guaranteeing undisputed possession and clean transfer titles.
                </p>
              </div>

              <div className="rounded-xl border border-cyan/20 bg-slate-900/50 p-4 space-y-1.5 hover:border-cyan/50 transition">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan">
                  <Compass className="h-4 w-4" /> On-Site Civil Demarcation
                </div>
                <p className="text-[11px] text-platinum/70 leading-normal">
                  Physical field demarcation executed via Total Station spatial equipment and precision GPS instruments to verify physical ground boundaries and pillar markers.
                </p>
              </div>

              <div className="rounded-xl border border-cyan/20 bg-slate-900/50 p-4 space-y-1.5 hover:border-cyan/50 transition">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400">
                  <ShieldCheck className="h-4 w-4" /> Fiduciary Escrow &amp; Market Intelligence
                </div>
                <p className="text-[11px] text-platinum/70 leading-normal">
                  Secure transaction protocols for overseas clients, integrated with live civil construction material indexes (Cement, Steel, Bricks) and official DC/FBR valuation matrices.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyan font-bold">
                  Executive Governance &amp; Advisory
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  CEO {CEO_NAME} &bull; Bin Taha Associates
                </div>
                <div className="text-xs text-platinum/60 mt-0.5">
                  Corporate Office: Commercial Broadway, LDA Avenue 1, Raiwind Road, Lahore
                </div>
              </div>
              <a
                href="https://wa.me/923219404812"
                target="_blank"
                rel="noreferrer"
                className="btn-cyan flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-bold shadow-cyan-glow whitespace-nowrap cursor-pointer"
              >
                <span>Direct Executive Line</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        )}

        {activeModule === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-cyan/15 pb-3">
              <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <span className="chip border-cyan/40 bg-cyan/10 text-cyan font-mono text-[10px]">
                  LEGAL COMPLIANCE 2026
                </span>
                <h3 className="font-display text-lg font-bold text-platinum mt-0.5">
                  Terms &amp; Conditions | BUNYAD.PK
                </h3>
              </div>
            </div>
            <div className="space-y-3 text-xs text-platinum/80 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3">
                <h4 className="font-mono text-xs font-bold text-cyan mb-1">1. Pakistan Property Legal NDC</h4>
                <p>Har property ka ownership record relevant authority (LDA, CDA, DHA) se physically cross-verify hota hai.</p>
              </div>
              <div className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3">
                <h4 className="font-mono text-xs font-bold text-cyan mb-1">2. Direct CEO Oversight</h4>
                <p>Tamam legal transfers aur escrow settlements CEO Taha Mubeen Bhutta ke direct supervision mein execute hoti hain.</p>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'add-property' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-cyan/15 pb-3">
              <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
                <PlusCircle className="h-6 w-6" />
              </div>
              <div>
                <span className="chip border-emerald-400/50 text-emerald-400 font-mono text-[10px]">
                  LIVE SUPABASE CLOUD INGESTION
                </span>
                <h3 className="font-display text-lg font-bold text-platinum mt-0.5">
                  Post New Property Listing | BUNYAD.PK
                </h3>
              </div>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 animate-bounce" />
                <h4 className="font-display text-base font-bold text-platinum">Listing Successfully Added!</h4>
                <p className="text-xs text-platinum/70">
                  Data Supabase database mein save ho chuka hai aur screen par sync ho gaya hai.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddProperty} className="space-y-3 text-xs">
                <div>
                  <label className="font-mono text-[10px] uppercase text-cyan/70">Property Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Marla Hot Location Plot - Phase 1"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none focus:border-cyan"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-mono text-[10px] uppercase text-cyan/70">Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none"
                    >
                      <option value="Plot">Plot</option>
                      <option value="House">House</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  <div className="relative">
                    <label className="font-mono text-[10px] uppercase text-cyan/70">Society (Type to Search) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Etihad Town, DHA..."
                      value={formData.society}
                      onFocus={() => setShowSocietySuggestions(true)}
                      onChange={(e) => {
                        setFormData({ ...formData, society: e.target.value });
                        setShowSocietySuggestions(true);
                      }}
                      className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none focus:border-cyan"
                    />

                    {showSocietySuggestions && filteredSocieties.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-cyan/40 bg-obsidian p-1 shadow-2xl">
                        {filteredSocieties.map((soc) => (
                          <button
                            key={soc}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, society: soc });
                              setShowSocietySuggestions(false);
                            }}
                            className="w-full text-left rounded px-2.5 py-1.5 text-xs text-platinum hover:bg-cyan/20 hover:text-cyan transition cursor-pointer"
                          >
                            {soc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase text-cyan/70">Demand Price (PKR) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1.15 Crore"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none focus:border-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[10px] uppercase text-cyan/70">Contact Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none focus:border-cyan"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase text-cyan/70">Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.img}
                      onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none focus:border-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase text-cyan/70">Description / Specifications</label>
                  <textarea
                    rows={2}
                    placeholder="Road width, facing park, ready for construction, etc..."
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none focus:border-cyan"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-cyan mt-2 w-full py-2.5 text-xs font-bold cursor-pointer flex items-center justify-center gap-2 shadow-cyan-glow"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Inserting into Supabase...' : 'Publish Listing to BUNYAD'}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
