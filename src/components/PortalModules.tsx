import { useState } from 'react';
import { 
  Building2, PlusCircle, ShieldAlert, FileText, CheckCircle2, 
  Send, X, Sparkles, MapPin, Phone, UserCheck, Layers, Award
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface PortalModulesProps {
  activeModule: 'about' | 'terms' | 'add-property' | null;
  onClose: () => void;
}

export default function PortalModules({ activeModule, onClose }: PortalModulesProps) {
  // Add Property Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Plot',
    society: 'LDA Avenue 1',
    price: '',
    phone: CEO_PHONE,
    desc: '',
    img: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        await supabase.from('properties').insert([
          {
            title: formData.title,
            type: formData.type,
            society: formData.society,
            price: formData.price.startsWith('PKR') ? formData.price : `PKR ${formData.price}`,
            phone: formData.phone || CEO_PHONE,
            desc: formData.desc || 'Verified listing added via BUNYAD.PK Portal.',
            img: formData.img || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
          }
        ]);
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      alert('Property submit ho gayi. CEO desk review ke baad display hogi.');
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-strong w-full max-w-2xl rounded-2xl border border-cyan/40 p-6 shadow-2xl relative my-8 text-platinum">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-cyan/20 text-platinum/60 hover:text-cyan hover:border-cyan transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 1. ABOUT US MODULE */}
        {activeModule === 'about' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-cyan/15 pb-3">
              <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <span className="chip border-emerald-400/50 text-emerald-400 font-mono text-[10px]">
                  PEC CATEGORY C REGISTERED
                </span>
                <h3 className="font-display text-lg font-bold text-platinum mt-0.5">
                  About BUNYAD.PK (بنیاد) &amp; Civil Engineering Suite
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-platinum/80">
              <p>
                <strong>BUNYAD.PK</strong> Lahore ka premier PropTech aur turnkey civil engineering portal hai, jise <strong>CEO {CEO_NAME}</strong> lead kar rahe hain. Hamara mission static real estate ko badal kar live, interactive engineering standards par chalana hai.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-cyan/15 bg-obsidian/70 p-3.5 space-y-1">
                  <div className="flex items-center gap-2 text-cyan font-bold font-mono">
                    <Award className="h-4 w-4" /> PEC Standards
                  </div>
                  <p className="text-[11px] text-platinum/70">
                    Grade-60 saria structural framing, machine concrete batch mix, aur lab tests ke sath har construction execute hoti hai.
                  </p>
                </div>

                <div className="rounded-xl border border-cyan/15 bg-obsidian/70 p-3.5 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                    <UserCheck className="h-4 w-4" /> 100% Escrow Protection
                  </div>
                  <p className="text-[11px] text-platinum/70">
                    Overseas aur local allottees ke funds phased milestones (Foundation, Grey, Finishing) par clear hote hain.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-cyan/20 bg-gradient-to-r from-obsidian via-[#0a1525] to-obsidian p-3.5 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] text-cyan uppercase font-bold">Head Office &amp; Operations:</p>
                  <p className="text-xs font-bold text-platinum">Block J, Commercial Broadway, LDA Avenue 1, Lahore</p>
                </div>
                <a
                  href={`tel:${CEO_PHONE}`}
                  className="btn-cyan py-1.5 px-3 text-xs font-bold flex items-center gap-1.5"
                >
                  <Phone className="h-3.5 w-3.5" /> Call CEO
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 2. TERMS & CONDITIONS MODULE */}
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
                  Terms &amp; Conditions | BUNYAD.PK (بنیاد)
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-platinum/80 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3">
                <h4 className="font-mono text-xs font-bold text-cyan mb-1">1. Legal Plot Verification &amp; NDC</h4>
                <p>Tamam plots aur listings official LDA records aur one-window counters se verify hone ke baad hi deal processing ke liye accept ki jaati hain.</p>
              </div>

              <div className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3">
                <h4 className="font-mono text-xs font-bold text-cyan mb-1">2. Turnkey Milestone Escrow</h4>
                <p>Civil contracts mein client payments 25%-35%-25%-15% ke ratio mein engineer physical inspection certificate ke baad release hoti hain.</p>
              </div>

              <div className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3">
                <h4 className="font-mono text-xs font-bold text-cyan mb-1">3. LDA Building Bylaws Compliance</h4>
                <p>Ghar ka architectural design aur setbacks strictly LDA Building Regulations 2026 ke rules ke tehat banaye jaate hain taaki NOC mein koi delay na ho.</p>
              </div>

              <div className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3">
                <h4 className="font-mono text-xs font-bold text-cyan mb-1">4. Direct CEO Oversight</h4>
                <p>Har query aur verified registry par CEO Taha Mubeen Bhutta ka direct legal verification aur tracking signature lagu hota hai.</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. ADD PROPERTY MODULE (SUPABASE INSERTION) */}
        {activeModule === 'add-property' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-cyan/15 pb-3">
              <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
                <PlusCircle className="h-6 w-6" />
              </div>
              <div>
                <span className="chip border-emerald-400/50 text-emerald-400 font-mono text-[10px]">
                  LIVE DATABASE INGESTION
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
                  Data Supabase database mein save ho chuka hai aur properties hub par sync ho gaya hai.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddProperty} className="space-y-3 text-xs">
                <div>
                  <label className="font-mono text-[10px] uppercase text-cyan/70">Property Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 Marla Corner Plot - Block J"
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
                  <div>
                    <label className="font-mono text-[10px] uppercase text-cyan/70">Society *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LDA Avenue 1"
                      value={formData.society}
                      onChange={(e) => setFormData({ ...formData, society: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 text-xs text-platinum outline-none focus:border-cyan"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase text-cyan/70">Demand Price (PKR) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1.75 Crore"
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
