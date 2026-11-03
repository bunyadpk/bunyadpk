import { memo, useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import {
  FileText, Download, Gavel, Scale,
  Building, Droplet, CloudRain, Scissors, Layers,
  FolderArchive, MessageCircle, Search
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';

interface LdaFormItem {
  id: number;
  title: string;
  category: 'Transfer' | 'Possession' | 'Legal' | 'Scheme';
  fileName: string;
  desc: string;
}

const OFFICIAL_20_FORMS: LdaFormItem[] = [
  { id: 1, title: 'Attested or Duplicate Certified Copy', category: 'Legal', fileName: 'APPLICATION FOR ATTESTED or Duplicate or Certified Copy.pdf', desc: 'Application to procure verified official duplicate registry/file documents.' },
  { id: 2, title: 'Building Period Extension', category: 'Possession', fileName: 'APPLICATION FOR BUILDING PERIOD EXTENTION.pdf', desc: 'Official extension for construction deadlines to avoid penalties.' },
  { id: 3, title: 'Application for Court Order', category: 'Legal', fileName: 'APPLICATION FOR COURT ORDER.pdf', desc: 'Submission of civil court decrees & stay orders for record updation.' },
  { id: 4, title: 'File Checking & Verification', category: 'Transfer', fileName: 'APPLICATION FOR FILE CHECKING.pdf', desc: 'Pre-purchase file authenticity check at LDA one-window counter.' },
  { id: 5, title: 'Incorporation of Legal Heirs', category: 'Legal', fileName: 'APPLICATION FOR INCORPORATION OF LEGAL HEIRS IN LDA RECORD.pdf', desc: 'Transfer of deceased owner property to lawful legal heirs (Wirasat).' },
  { id: 6, title: 'Property Lien Marking', category: 'Legal', fileName: 'APPLICATION FOR LIEN MARKING.pdf', desc: 'Bank mortgage or court lien marking against allotted property.' },
  { id: 7, title: 'Lien Removal Clearance', category: 'Legal', fileName: 'APPLICATION FOR LIEN REMOVAL.pdf', desc: 'Clearance certificate after bank loan settlement.' },
  { id: 8, title: 'No Objection Certificate (NOC)', category: 'Transfer', fileName: 'APPLICATION FOR NO OBJECTION CERTIFICATE.pdf', desc: 'Mandatory LDA clearance prior to sale or utility sanction.' },
  { id: 9, title: 'Payment of Excess Area Dues', category: 'Scheme', fileName: 'APPLICATION FOR PAYMENT OF EXCESS AREA.pdf', desc: 'Challan generation for corner or excess boundary area.' },
  { id: 10, title: 'Permission to Mortgage Property', category: 'Legal', fileName: 'APPLICATION FOR PERMISSION TO MORTGAGE.pdf', desc: 'Formal permission to pledge property with financial institutions.' },
  { id: 11, title: 'Physical Possession Application', category: 'Possession', fileName: 'APPLICATION FOR PHYSICAL POSSESSION.pdf', desc: 'Onsite demarcation and physical site possession handover.' },
  { id: 12, title: 'Issuance of Possession Order', category: 'Possession', fileName: 'APPLICATION FOR POSSESSION ORDER.pdf', desc: 'Administrative order after completion of development dues.' },
  { id: 13, title: 'Public Notice for GPA', category: 'Legal', fileName: 'APPLICATION FOR PUBLICATION OF GPA.pdf', desc: 'National newspaper proclamation for General Power of Attorney.' },
  { id: 14, title: 'Formal Reply to LDA Notice', category: 'Legal', fileName: 'APPLICATION FOR REPLY TO NOTICE.pdf', desc: 'Official reply draft against building violation or show-cause notice.' },
  { id: 15, title: 'Transfer of Plot Ownership', category: 'Transfer', fileName: 'APPLICATION FOR TRANSFER OF PLOT.pdf', desc: 'Primary application for ownership transfer between buyer and seller.' },
  { id: 16, title: 'Transfer Under Court Decree', category: 'Legal', fileName: 'APPLICATION FOR TRANSFER PROPERTY THROUGH COURT ORDER.pdf', desc: 'Court mandated title conveyance execution.' },
  { id: 17, title: 'Mohlanwal Plot Allocation', category: 'Scheme', fileName: 'MWL. APPLICATION FOR ALLOCATION OF PLOT MOHLANWAL.pdf', desc: 'Allocation form for Mohlanwal housing scheme allottees.' },
  { id: 18, title: 'Plot Exemption Application', category: 'Scheme', fileName: 'MWL. APPLICATION FOR EXEMPTION OF PLOT.pdf', desc: 'Land acquisition compensation & exemption claims.' },
  { id: 19, title: 'Exemption Letter (Mohlanwal)', category: 'Scheme', fileName: 'MWL.APPLICATION FOR EXEMPTION LETTER OF PLOT MOHLANWAL.pdf', desc: 'Issuance of final exemption certificate.' },
  { id: 20, title: 'Final Demand Notice (Mohlanwal)', category: 'Scheme', fileName: 'MWL.APPLICATION FOR FINAL DEMAND NOTICE MOHLANWAL.pdf', desc: 'Clearance of last installment and development liabilities.' }
];

const BYLAW_HIGHLIGHTS = [
  {
    icon: Building,
    title: 'Maximum Heights & Storeys',
    color: 'text-amber-400',
    desc: 'Standard residential plots permit up to 38 ft (3 storeys) on roads up to 25 ft ROW[cite: 3]. 10 Marla and 1 Kanal plots permit up to 45 ft (4 storeys, excluding basement) with a minimum clear storey height of 9 ft 6 in[cite: 3, 5].'
  },
  {
    icon: Scale,
    title: 'Mandatory Open Spaces & Setbacks',
    color: 'text-cyan',
    desc: 'Plots below 10 Marla strictly enforce a 5 ft rear open space. 1 Kanal properties mandate a 7 ft rear space and 5 ft side passages on both sides for legal light and ventilation.'
  },
  {
    icon: Droplet,
    title: 'Underground Water Tank Capacities',
    color: 'text-blue-400',
    desc: 'Underground reservoirs are mandatory: 5 Marla requires min 18 cu.ft (135 Gal), 7-10 Marla requires 60-124 cu.ft, and 1 Kanal requires at least 200 cu.ft (1,200 Gal).'
  },
  {
    icon: CloudRain,
    title: 'Rainwater Harvesting & Recharge Wells',
    color: 'text-emerald-400',
    desc: 'Rooftop rainwater harvesting systems are compulsory for all plots 5 Marla and above. Houses measuring 15 Marla or greater must construct an on-site aquifer recharge well/pit.'
  },
  {
    icon: Layers,
    title: 'Plot Amalgamation Rules',
    color: 'text-purple-400',
    desc: 'Two or more adjacent plots of the same land use category may be amalgamated side-by-side or back-to-back[cite: 2]. The building regulations of the resultant aggregate plot size apply[cite: 5].'
  },
  {
    icon: Scissors,
    title: 'Subdivision Restrictions',
    color: 'text-rose-400',
    desc: 'Subdivision is prohibited for plots smaller than 1 Kanal. For 2 Kanal plots, subdivision is permitted provided the resultant plots are at least 1 Kanal with min 35 ft front width.'
  }
];

function LdaDocsHub() {
  const [filter, setFilter] = useState<'All' | 'Transfer' | 'Possession' | 'Legal' | 'Scheme'>('All');
  const [search, setSearch] = useState('');

  const filteredForms = OFFICIAL_20_FORMS.filter((f) => {
    const matchesFilter = filter === 'All' || f.category === filter;
    const matchesSearch = !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* HUD Header Banner */}
      <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip border-emerald-400/40 text-emerald-400 font-mono text-[10px]">
              GAZETTE VERIFIED 2026
            </span>
            <span className="font-mono text-[10px] text-cyan/70">
              LDA OFFICIAL REPOSITORY
            </span>
          </div>
          <h2 className="mt-2 font-display text-xl sm:text-2xl font-bold text-platinum flex items-center gap-2">
            <Gavel className="h-6 w-6 text-cyan" />
            Official 20 LDA Application Forms &amp; Building Bylaws 2026
          </h2>
          <p className="mt-1 text-xs text-platinum/70 max-w-3xl leading-relaxed">
            Direct repository for Lahore Development Authority application forms, possession clearances, transfer files, and statutory building regulations. Supervised by <strong>CEO {CEO_NAME}</strong>.
          </p>
        </div>

        <a
          href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I need the complete LDA 20-Forms ZIP archive and legal assistance.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cyan flex shrink-0 items-center gap-2 py-3 px-5 text-xs font-bold cursor-pointer shadow-cyan-glow"
        >
          <FolderArchive className="h-4 w-4" /> Request All 20 Forms (ZIP)
        </a>
      </div>

      {/* Core Technical Highlights: LDA Building & Zoning Regulations 2026 */}
      <div className="glass rounded-xl p-5 border border-cyan/20 space-y-4">
        <div className="flex items-center justify-between border-b border-cyan/15 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-cyan" />
            <h3 className="font-display text-sm font-bold text-cyan">
              Core Technical Highlights of LDA Building &amp; Zoning Regulations 2026
            </h3>
          </div>
          <span className="font-mono text-[10px] text-platinum/50 uppercase">
            Mandatory Statutory Guidelines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {BYLAW_HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-cyan/15 bg-obsidian/60 p-4 transition hover:border-cyan/40"
            >
              <div className="flex items-center gap-2.5">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <h4 className="font-display text-xs font-bold text-platinum">{item.title}</h4>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-platinum/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 20 Official Forms Repository */}
      <div className="glass rounded-xl p-5 border border-cyan/20 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-cyan/15 pb-3">
          <div>
            <h3 className="font-display text-sm font-bold text-cyan flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan" />
              Verified Official LDA Forms Repository ({filteredForms.length} / 20)
            </h3>
            <p className="mt-0.5 text-xs text-platinum/60">
              Single-click instant PDF download direct from verified public storage.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cyan/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search forms by name..."
              className="w-full rounded-lg border border-cyan/20 bg-obsidian/80 py-1.5 pl-8 pr-3 text-xs text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['All', 'Transfer', 'Possession', 'Legal', 'Scheme'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-lg px-3 py-1 font-mono text-xs font-semibold transition cursor-pointer ${
                filter === cat
                  ? 'bg-cyan/20 text-cyan border border-cyan/40'
                  : 'text-platinum/60 hover:text-cyan border border-transparent'
              }`}
            >
              {cat === 'All' ? 'All 20 Forms' : cat}
            </button>
          ))}
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className="group flex flex-col justify-between rounded-xl border border-cyan/15 bg-obsidian/50 p-3.5 transition hover:border-cyan/40 hover:bg-cyan/5"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] text-cyan/60 font-bold">
                    #{String(form.id).padStart(2, '0')}
                  </span>
                  <span className="chip text-[9px] py-0 px-1.5">{form.category}</span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-platinum group-hover:text-cyan transition leading-snug">
                  {form.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-[10px] text-platinum/50">{form.desc}</p>
              </div>

              <div className="mt-3 flex items-center gap-1.5 border-t border-cyan/10 pt-2.5">
                <a
                  href={`./assets/lda-forms/${encodeURIComponent(form.fileName)}`}
                  download={form.fileName}
                  className="btn-ghost flex-1 flex items-center justify-center gap-1 py-1 text-[11px] text-cyan border border-cyan/25 hover:bg-cyan/15 cursor-pointer text-center"
                >
                  <Download className="h-3 w-3" /> PDF
                </a>
                <a
                  href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I need guidance regarding LDA Form #${form.id} (${form.title}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-1 text-emerald-400 hover:bg-emerald-400/10"
                  title="WhatsApp CEO"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(LdaDocsHub);
