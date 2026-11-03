import { useState, useEffect, useMemo, memo } from 'react';
import {
  Building2, Search, Heart, MapPin, Phone, MessageCircle,
  Coins, Sparkles, X, Calculator, Loader2
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface PropertyItem {
  id: string | number;
  title: string;
  type: string;
  society: string;
  price: string;
  phone: string;
  desc: string;
  img: string;
}

const ALL_38_SOCIETIES = [
  'All',
  'LDA Avenue 1',
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
  'Faisal Town',
  'Model Town',
  'Gulberg',
  'State Life Housing Society',
  'Sui Gas Housing Society',
  'Audit & Accounts Society',
  'Park View City',
  'Al-Kabir Town',
  'Kings Town',
  'Etihad Town',
  'Central Park Housing Scheme',
  'LDA City',
  'Midland Farmhouses',
  'Green Forts',
  'Tricon Village',
  'Pari Garden',
  'Tech Society',
  'Punjab Govt Employees Housing',
  'Architects & Engineers Society'
];

const FALLBACK_PROPERTIES: PropertyItem[] = [
  {
    id: 101,
    title: '10 Marla Prime Residential Plot - Block J',
    type: 'Plot',
    society: 'LDA Avenue 1',
    price: 'PKR 17,500,000',
    phone: CEO_PHONE,
    desc: 'Direct possession plot on 50ft wide road near Commercial Broadway. Ready for immediate construction.',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 102,
    title: '1 Kanal Luxury Turnkey Designer House',
    type: 'House',
    society: 'LDA Avenue 1',
    price: 'PKR 48,000,000',
    phone: CEO_PHONE,
    desc: 'Brand new 5-bed modern villa with double height lobby, Spanish tiles, and servant quarter.',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 103,
    title: '5 Marla Fully Developed Plot - Sector B',
    type: 'Plot',
    society: 'Jubilee Town',
    price: 'PKR 10,500,000',
    phone: CEO_PHONE,
    desc: 'Park face location, all dues clear with official NDC.',
    img: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 104,
    title: '4 Marla Commercial Plaza (GF + 3 Floors)',
    type: 'Commercial',
    society: 'LDA Avenue 1',
    price: 'PKR 35,000,000',
    phone: CEO_PHONE,
    desc: 'Main boulevard commercial building with confirmed corporate rental yield.',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 105,
    title: '1 Kanal Prime Residential Plot - Phase 11 Rahbar',
    type: 'Plot',
    society: 'DHA Rahbar Phase 11',
    price: 'PKR 32,000,000',
    phone: CEO_PHONE,
    desc: 'Hot location plot near Ring Road interchange. Direct allocation.',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 106,
    title: '10 Marla Brand New Spanish Villa',
    type: 'House',
    society: 'Izmir Town',
    price: 'PKR 38,500,000',
    phone: CEO_PHONE,
    desc: 'Solid construction with Grade-60 steel, solid ash wood doors, and imported fittings.',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  }
];

function SocietyDirectory() {
  const [properties, setProperties] = useState<PropertyItem[]>(FALLBACK_PROPERTIES);
  const [loading, setLoading] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'plot' | 'house' | 'commercial'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModal, setDetailModal] = useState<PropertyItem | null>(null);
  const [savedIds, setSavedIds] = useState<Array<string | number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('bunyad_saved_properties') || '[]');
    } catch {
      return [];
    }
  });

  const [roiPrice, setRoiPrice] = useState(15000000);
  const [roiGrowth, setRoiGrowth] = useState(12);
  const [roiYears, setRoiYears] = useState(3);

  async function loadData() {
    if (!isSupabaseConfigured || !supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        return;
      }

      if (data && data.length > 0) {
        const mapped: PropertyItem[] = data.map((item: any, idx: number) => ({
          id: item.id || `prop-${idx}`,
          title: item.title || 'Verified Property',
          type: item.type || 'Plot',
          society: item.society || 'Lahore',
          price: item.price ? (String(item.price).startsWith('PKR') ? item.price : `PKR ${item.price}`) : 'Demand on Call',
          phone: item.phone || CEO_PHONE,
          desc: item.desc || 'Direct verified listing on BUNYAD portal.',
          img: item.img || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
        }));
        setProperties(mapped);
      }
    } catch (err) {
      console.warn('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function toggleSaveProperty(id: string | number) {
    let updated = savedIds.includes(id)
      ? savedIds.filter((x) => x !== id)
      : [...savedIds, id];
    setSavedIds(updated);
    localStorage.setItem('bunyad_saved_properties', JSON.stringify(updated));
  }

  // Smart Fuzzy Filter
  const filtered = useMemo(() => {
    return properties.filter((item) => {
      const socName = (item.society || '').toLowerCase();
      const targetSoc = selectedSociety.toLowerCase();

      // Smart match: chahe 'Etihad Town' ho ya 'Etihad Town, Lahore'
      const matchSoc =
        selectedSociety === 'All' ||
        socName.includes(targetSoc) ||
        targetSoc.includes(socName) ||
        (targetSoc.includes('etihad') && socName.includes('etihad')) ||
        (targetSoc.includes('dha') && socName.includes('dha')) ||
        (targetSoc.includes('bahria') && socName.includes('bahria')) ||
        (targetSoc.includes('lda') && socName.includes('lda'));

      const itemType = (item.type || '').toLowerCase();
      const matchCat =
        selectedCategory === 'all' ||
        (selectedCategory === 'plot' && itemType.includes('plot')) ||
        (selectedCategory === 'house' && (itemType.includes('house') || itemType.includes('home'))) ||
        (selectedCategory === 'commercial' && (itemType.includes('commercial') || itemType.includes('plaza')));

      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        (item.title || '').toLowerCase().includes(q) ||
        socName.includes(q) ||
        (item.desc || '').toLowerCase().includes(q) ||
        (item.price || '').toLowerCase().includes(q);

      return matchSoc && matchCat && matchQuery;
    });
  }, [properties, selectedSociety, selectedCategory, searchQuery]);

  const totalCount = properties.length;
  const plotCount = properties.filter((p) => (p.type || '').toLowerCase().includes('plot')).length;
  const houseCount = properties.filter((p) => {
    const t = (p.type || '').toLowerCase();
    return t.includes('house') || t.includes('home');
  }).length;
  const commercialCount = properties.filter((p) => {
    const t = (p.type || '').toLowerCase();
    return t.includes('commercial') || t.includes('plaza');
  }).length;

  const roiValue = roiPrice * Math.pow(1 + roiGrowth / 100, roiYears);
  const savedItems = properties.filter((p) => savedIds.includes(p.id));

  return (
    <div className="space-y-6">
      {/* Live Market Ticker */}
      <div className="overflow-hidden rounded-xl border border-cyan/30 bg-[#040810] py-2 px-4 shadow-cyan-glow">
        <div className="flex items-center gap-3 whitespace-nowrap text-xs">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase text-amber-400 shrink-0">
            <Coins className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            BUNYAD Live Market Ticker:
          </span>
          <div className="flex items-center gap-6 font-mono text-[11px] text-platinum/80 animate-pulse">
            <span>• LDA Avenue 1 (10 Marla): <strong className="text-cyan">1.45 Cr – 1.85 Cr</strong></span>
            <span>• LDA Avenue 1 (1 Kanal): <strong className="text-cyan">2.80 Cr – 3.50 Cr</strong></span>
            <span>• Etihad Town (5 Marla): <strong className="text-cyan">95 Lac – 1.30 Cr</strong></span>
            <span>• DHA Phase 9 Prism (1 Kanal): <strong className="text-cyan">2.60 Cr – 3.40 Cr</strong></span>
            <span>• Jubilee Town (5 Marla): <strong className="text-cyan">85 Lac – 1.15 Cr</strong></span>
            <span>• Izmir Town (10 Marla House): <strong className="text-cyan">3.20 Cr – 4.10 Cr</strong></span>
          </div>
        </div>
      </div>

      {/* Hero Header & Counters */}
      <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="chip border-emerald-400/50 text-emerald-400 font-mono text-[10px]">
              38 SOCIETIES MASTER REGISTRY
            </span>
            <span className="font-mono text-[10px] text-cyan/70">
              BUNYAD PROPTECH PORTAL (بنیاد)
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-platinum flex items-center gap-2">
            <Building2 className="h-6 w-6 text-cyan" />
            Find Verified Properties Across 38 Lahore Housing Societies
          </h2>
          <p className="text-xs text-platinum/70 leading-relaxed">
            Direct authenticated deals across LDA Avenue 1, Etihad Town, Jubilee Town, DHA Phases 1 to 9, Bahria Town, Izmir, and Lake City. Zero hidden charges, 100% legal NDC verification supervised by <strong>CEO {CEO_NAME}</strong>.
          </p>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
          <div className="rounded-xl border border-cyan/20 bg-obsidian/80 p-3 text-center min-w-[90px]">
            <span className="block font-display text-xl font-black text-cyan">
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto text-cyan" /> : totalCount}
            </span>
            <span className="font-mono text-[9px] uppercase text-platinum/50 font-bold">Total Listings</span>
          </div>
          <div className="rounded-xl border border-emerald-400/25 bg-obsidian/80 p-3 text-center min-w-[90px]">
            <span className="block font-display text-xl font-black text-emerald-400">{plotCount}</span>
            <span className="font-mono text-[9px] uppercase text-platinum/50 font-bold">Plots</span>
          </div>
          <div className="rounded-xl border border-blue-400/25 bg-obsidian/80 p-3 text-center min-w-[90px]">
            <span className="block font-display text-xl font-black text-blue-400">{houseCount}</span>
            <span className="font-mono text-[9px] uppercase text-platinum/50 font-bold">Houses</span>
          </div>
          <div className="rounded-xl border border-purple-400/25 bg-obsidian/80 p-3 text-center min-w-[90px]">
            <span className="block font-display text-xl font-black text-purple-400">{commercialCount}</span>
            <span className="font-mono text-[9px] uppercase text-platinum/50 font-bold">Commercial</span>
          </div>
        </div>
      </div>

      {/* 38 Societies Selection Console */}
      <div className="glass rounded-xl p-4 border border-cyan/20 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan">
              Select Housing Society:
            </span>
            <span className="chip border-cyan/30 text-cyan text-[10px] font-mono">
              {selectedSociety}
            </span>
          </div>

          <select
            value={selectedSociety}
            onChange={(e) => setSelectedSociety(e.target.value)}
            className="rounded-lg border border-cyan/30 bg-obsidian px-3 py-1.5 font-mono text-xs text-cyan outline-none cursor-pointer w-full sm:w-auto"
          >
            {ALL_38_SOCIETIES.map((soc) => (
              <option key={soc} value={soc} className="bg-obsidian text-platinum">
                {soc}
              </option>
            ))}
          </select>
        </div>

        {/* Scrollable Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan/30">
          {ALL_38_SOCIETIES.map((soc) => (
            <button
              key={soc}
              type="button"
              onClick={() => setSelectedSociety(soc)}
              className={`whitespace-nowrap rounded-lg px-3 py-1 font-mono text-xs font-semibold transition cursor-pointer shrink-0 ${
                selectedSociety === soc
                  ? 'bg-cyan text-obsidian shadow-cyan-glow font-bold'
                  : 'bg-obsidian/60 text-platinum/70 border border-cyan/20 hover:border-cyan hover:text-cyan'
              }`}
            >
              {soc}
            </button>
          ))}
        </div>

        {/* Category & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-cyan/10">
          <div className="flex items-center gap-1 bg-obsidian/80 p-1 rounded-lg border border-cyan/20 w-full sm:w-auto">
            {(['all', 'plot', 'house', 'commercial'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded px-3 py-1 text-xs font-mono font-bold capitalize transition cursor-pointer flex-1 sm:flex-none ${
                  selectedCategory === cat
                    ? 'bg-cyan/20 text-cyan border border-cyan/40 shadow-sm'
                    : 'text-platinum/60 hover:text-platinum'
                }`}
              >
                {cat === 'all' ? 'All Types' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cyan/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by block, plot number, or title..."
              className="w-full rounded-lg border border-cyan/30 bg-obsidian/90 py-2 pl-9 pr-3 text-xs text-platinum placeholder:text-cyan/30 outline-none focus:border-cyan"
            />
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-cyan/20 bg-obsidian/60 py-12 text-center text-platinum/60 space-y-2">
            <Building2 className="mx-auto h-10 w-10 text-cyan/40" />
            <p className="font-display text-sm font-bold text-platinum">No listings currently match "{selectedSociety}".</p>
            <p className="text-xs text-platinum/50">Click "Add Property" in header to post a direct listing in this society.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isSaved = savedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="group glass rounded-2xl border border-cyan/15 hover:border-cyan/40 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-cyan-glow"
              >
                <div>
                  <div className="relative h-48 w-full bg-obsidian overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
                    <span className="absolute top-3 left-3 chip border-cyan/40 bg-obsidian/90 text-cyan text-[10px] font-mono font-bold">
                      {item.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSaveProperty(item.id)}
                      className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md border transition cursor-pointer ${
                        isSaved
                          ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                          : 'border-cyan/20 bg-obsidian/80 text-platinum/60 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <span className="absolute bottom-2.5 left-3 text-[11px] font-mono text-cyan flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-rose-400" /> {item.society}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-display text-sm font-bold text-platinum group-hover:text-cyan transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-platinum/60 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-cyan/10 flex items-center justify-between mb-3">
                    <div>
                      <span className="font-mono text-[9px] uppercase text-platinum/40 block">Demand / Price</span>
                      <span className="font-display text-base font-black neon-text">{item.price}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDetailModal(item)}
                      className="text-xs text-cyan hover:underline font-mono cursor-pointer"
                    >
                      View Specs
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I am interested in this listing on BUNYAD: "${item.title}" in ${item.society} (Demand: ${item.price}). Please share details.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyan flex items-center justify-center gap-1.5 py-2 text-xs font-bold"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(item.society + ' Lahore')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost flex items-center justify-center gap-1.5 py-2 text-xs font-bold border border-cyan/30 text-cyan hover:bg-cyan/15"
                    >
                      <MapPin className="h-3.5 w-3.5" /> Map Location
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ROI Calculator */}
      <div className="glass rounded-xl p-5 border border-cyan/30 shadow-cyan-glow space-y-4">
        <div className="flex items-center gap-3 border-b border-cyan/15 pb-3">
          <div className="p-2 rounded-lg bg-cyan/10 text-cyan border border-cyan/30">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-cyan">
              Real Estate Investment ROI &amp; Capital Gain Engine
            </h3>
            <p className="text-xs text-platinum/60">
              Calculate projected property appreciation in Lahore based on compound annual growth metrics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label>
            <span className="font-mono text-[10px] uppercase text-cyan/70">Purchase Price (PKR)</span>
            <input
              type="number"
              value={roiPrice}
              onChange={(e) => setRoiPrice(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 font-mono text-sm text-cyan outline-none focus:border-cyan"
            />
          </label>
          <label>
            <span className="font-mono text-[10px] uppercase text-cyan/70">Expected Annual Growth (%)</span>
            <input
              type="number"
              value={roiGrowth}
              onChange={(e) => setRoiGrowth(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 font-mono text-sm text-cyan outline-none focus:border-cyan"
            />
          </label>
          <label>
            <span className="font-mono text-[10px] uppercase text-cyan/70">Holding Period (Years)</span>
            <input
              type="number"
              value={roiYears}
              onChange={(e) => setRoiYears(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-cyan/20 bg-obsidian/80 px-3 py-2 font-mono text-sm text-cyan outline-none focus:border-cyan"
            />
          </label>
        </div>

        <div className="rounded-xl border border-cyan/20 bg-gradient-to-r from-obsidian via-[#0a1525] to-obsidian p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] text-platinum/60 uppercase">Estimated Asset Value after {roiYears} Years</span>
            <p className="font-display text-2xl font-black neon-text mt-0.5">
              PKR {Math.round(roiValue).toLocaleString()}
            </p>
          </div>
          <a
            href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I calculated an investment ROI on BUNYAD: Purchase PKR ${roiPrice.toLocaleString()} growing to PKR ${Math.round(roiValue).toLocaleString()} in ${roiYears} years.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyan py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> Consult with CEO on ROI
          </a>
        </div>
      </div>

      {/* Saved Properties */}
      {savedItems.length > 0 && (
        <div className="glass rounded-xl p-5 border border-cyan/20 space-y-3">
          <div className="flex items-center justify-between border-b border-cyan/15 pb-2">
            <h4 className="font-display text-sm font-bold text-cyan flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
              Your Saved Dream Properties ({savedItems.length})
            </h4>
            <button
              type="button"
              onClick={() => {
                setSavedIds([]);
                localStorage.removeItem('bunyad_saved_properties');
              }}
              className="font-mono text-xs text-platinum/50 hover:text-rose-400 underline cursor-pointer"
            >
              Clear Saved
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {savedItems.map((s) => (
              <div key={s.id} className="rounded-xl border border-cyan/15 bg-obsidian/60 p-3 flex items-center gap-3">
                <img src={s.img} alt={s.title} className="h-12 w-12 rounded-lg object-cover border border-cyan/20" />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xs font-bold text-platinum truncate">{s.title}</p>
                  <p className="font-mono text-[11px] text-cyan font-bold">{s.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-md p-4">
          <div className="glass-strong w-full max-w-lg rounded-2xl border border-cyan/40 p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setDetailModal(null)}
              className="absolute top-4 right-4 text-platinum/50 hover:text-cyan cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-56 w-full rounded-xl overflow-hidden border border-cyan/30">
              <img src={detailModal.img} alt={detailModal.title} className="h-full w-full object-cover" />
            </div>

            <div className="flex items-center justify-between">
              <span className="chip border-cyan/40 bg-cyan/10 text-cyan text-xs font-mono font-bold">
                {detailModal.type}
              </span>
              <span className="font-display text-xl font-black neon-text">{detailModal.price}</span>
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-platinum">{detailModal.title}</h3>
              <p className="font-mono text-xs text-rose-400 flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" /> {detailModal.society}
              </p>
            </div>

            <div className="rounded-xl border border-cyan/15 bg-obsidian/70 p-3.5 text-xs text-platinum/80 leading-relaxed space-y-1">
              <h4 className="font-mono text-[10px] uppercase text-cyan font-bold">Verified Specifications:</h4>
              <p>{detailModal.desc}</p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <a
                href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, Inquiry about listing: "${detailModal.title}" (${detailModal.society})`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyan flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp CEO
              </a>
              <a
                href={`tel:${CEO_PHONE}`}
                className="btn-ghost flex items-center justify-center gap-2 py-2.5 text-xs font-bold border border-cyan/30 text-cyan hover:bg-cyan/15"
              >
                <Phone className="h-4 w-4" /> Call Direct
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(SocietyDirectory);
