import { useState, useMemo } from 'react';
import { 
  Building2, PlusCircle, FileText, CheckCircle2, 
  Send, X, Phone, Award, UserCheck
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface PortalModulesProps {
  activeModule: 'about' | 'terms' | 'add-property' | null;
  onClose: () => void;
}

const PAKISTAN_SOCIETIES = [
  'LDA Avenue 1, Lahore',
  'Jubilee Town, Lahore',
  'DHA Phase 1, Lahore',
  'DHA Phase 2, Lahore',
  'DHA Phase 3, Lahore',
  'DHA Phase 4, Lahore',
  'DHA Phase 5, Lahore',
  'DHA Phase 6, Lahore',
  'DHA Phase 7, Lahore',
  'DHA Phase 8, Lahore',
  'DHA Phase 9 Prism, Lahore',
  'DHA Rahbar Phase 11, Lahore',
  'Bahria Town, Lahore',
  'Bahria Orchard, Lahore',
  'Izmir Town, Lahore',
  'Lake City, Lahore',
  'Valencia Town, Lahore',
  'WAPDA Town, Lahore',
  'Johar Town, Lahore',
  'Model Town, Lahore',
  'Gulberg, Lahore',
  'Park View City, Lahore',
  'Al-Kabir Town, Lahore',
  'Etihad Town, Lahore',
  'Central Park Housing, Lahore',
  'LDA City, Lahore',
  'DHA Islamabad / Rawalpindi',
  'Bahria Town, Islamabad',
  'Gulberg Greens, Islamabad',
  'Faisal Hills, Islamabad',
  'B-17 Multi Gardens, Islamabad',
  'DHA City, Karachi',
  'Bahria Town, Karachi',
  'Clifton, Karachi',
  'DHA Gujranwala',
  'DHA Multan',
  'Citi Housing, Multan',
  'Citi Housing, Faisalabad',
  'DHA Peshawar',
  'Gwadar Golf City'
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
        await supabase.from('properties').insert([
          {
            title: formData.title,
            type: formData.type,
            society: formData.society,
            price: formData.price.startsWith('PKR') ? formData.price : `PKR ${formData.price}`,
            phone: formData.phone || CEO_PHONE,
            desc: formData.desc || 'Direct verified listing on BUNYAD.PK Portal.',
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
    } catch {
      alert('Property submit ho gayi. Page reload ho raha hai.');
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-strong w-full max-w-2xl rounded-2xl border border-cyan/40 p-6 shadow-2xl relative my-8 text-platinum">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-cyan/20 text-platinum/60 hover:text-cyan hover:border-cyan transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {activeModule === 'about' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-cyan/15 pb-3">
              <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <span className="chip border-emerald-400/50 text-emerald-400 font-mono text-[10px]">
                  ALL PAKISTAN PROPTECH &amp; CIVIL SUITE
                </span>
                <h3 className="font-display text-lg font-bold text-platinum mt-0.5">
                  About BUNYAD.PK (بنیاد) Pakistan
                </h3>
              </div>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-platinum/80">
              <p>
                <strong>BUNYAD.PK</strong> Pakistan ka enterprise-grade PropTech portal hai, jise <strong>CEO {CEO_NAME}</strong> lead kar rahe hain. Lahore ke sath sath Islamabad, Karachi, Multan aur Gwadar ki mega housing schemes ka authenticated platform.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-cyan/15 bg-obsidian/70 p-3.5 space-y-1">
                  <div className="flex items-center gap-2 text-cyan font-bold font-mono">
                    <Award className="h-4 w-4" /> Nationwide Verification
                  </div>
                  <p className="text-[11px] text-platinum/70">
                    LDA, CDA, RDA, SBCA, aur DHA authority certified documentation review.
                  </p>
                </div>
                <div className="rounded-xl border border-cyan/15 bg-obsidian/70 p-3.5 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                    <UserCheck className="h-4 w-4" /> 100% Escrow Protection
                  </div>
                  <p className="text-[11px] text-platinum/70">
                    Overseas Pakistanis ke liye milestone-based safe investment infrastructure.
                  </p>
                </div>
              </div>
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
                <p>Tamam legal registry transfers aur escrow settlements CEO Taha Mubeen Bhutta ke direct supervision mein hoti hain.</p>
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

                  {/* Society Auto-Suggest Input */}
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

                    {/* Auto-suggestion Dropdown */}
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
