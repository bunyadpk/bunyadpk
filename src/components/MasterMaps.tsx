import { memo, useState } from 'react';
import {
  Compass, Search, MapPin, Layers, ZoomIn, ZoomOut,
  RotateCcw, MessageCircle, ExternalLink, ShieldCheck, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';

interface QuickSociety {
  name: string;
  query: string;
  masterMapUrl?: string;
}

const TOP_SOCIETIES: QuickSociety[] = [
  { 
    name: 'LDA Avenue 1', 
    query: 'LDA Avenue 1, Raiwind Road, Lahore',
    masterMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1600&q=80' // یا آفیشل لے آؤٹ امیج
  },
  { 
    name: 'Etihad Town', 
    query: 'Etihad Town, Raiwind Road, Lahore',
    masterMapUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80'
  },
  { 
    name: 'Jubilee Town', 
    query: 'Jubilee Town, Lahore',
    masterMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1600&q=80'
  },
  { name: 'DHA Phase 9 Prism', query: 'DHA Phase 9 Prism, Lahore' },
  { name: 'DHA Phase 7', query: 'DHA Phase 7, Lahore' },
  { name: 'Bahria Town', query: 'Bahria Town, Lahore' },
  { name: 'Lake City', query: 'Lake City, Raiwind Road, Lahore' },
  { name: 'Izmir Town', query: 'Izmir Town, Canal Road, Lahore' },
  { name: 'Johar Town', query: 'Johar Town, Lahore' }
];

const LDA_BLOCKS: Record<string, string> = {
  'Block J': 'LDA Avenue 1 Block J Commercial Broadway Lahore',
  'Block A': 'LDA Avenue 1 Block A Raiwind Road Lahore',
  'Block B': 'LDA Avenue 1 Block B Lahore',
  'Block C': 'LDA Avenue 1 Block C Central Broadway Lahore',
  'Block D': 'LDA Avenue 1 Block D Central Park Lahore',
  'Block F': 'LDA Avenue 1 Block F Lahore',
  'Block G': 'LDA Avenue 1 Block G Lahore',
  'Block H': 'LDA Avenue 1 Block H Lahore',
  'Block K': 'LDA Avenue 1 Block K Defence Road Lahore',
  'Block L': 'LDA Avenue 1 Block L Lahore',
  'Block M': 'LDA Avenue 1 Block M Lahore'
};

function MasterMaps() {
  const [activeLocation, setActiveLocation] = useState('LDA Avenue 1 Block J Commercial Broadway Lahore');
  const [displayTitle, setDisplayTitle] = useState('LDA Avenue 1 - Block J (Bin Taha HQ)');
  const [searchInput, setSearchInput] = useState('');
  const [viewMode, setViewMode] = useState<'blueprint' | 'roadmap' | 'satellite'>('blueprint');
  const [zoomLevel, setZoomLevel] = useState(16);
  const [blueprintZoom, setBlueprintZoom] = useState(1);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    const upper = query.toUpperCase();
    const blockKey = Object.keys(LDA_BLOCKS).find(b => upper.includes(b.toUpperCase()) || upper.includes(b.replace('BLOCK ', '')));

    if (blockKey && (upper.includes('LDA') || upper.includes('AVENUE') || upper.length <= 8)) {
      setActiveLocation(LDA_BLOCKS[blockKey]);
      setDisplayTitle(`LDA Avenue 1 - ${blockKey}`);
    } else {
      setActiveLocation(`${query}, Lahore`);
      setDisplayTitle(query);
    }
  }

  function handleSelectSociety(soc: QuickSociety) {
    setActiveLocation(soc.query);
    setDisplayTitle(soc.name);
    setSearchInput(soc.name);
  }

  function handleSelectLdaBlock(blockName: string) {
    if (LDA_BLOCKS[blockName]) {
      setActiveLocation(LDA_BLOCKS[blockName]);
      setDisplayTitle(`LDA Avenue 1 - ${blockName}`);
      setSearchInput(`LDA Avenue 1 ${blockName}`);
    }
  }

  function handleReset() {
    setActiveLocation('LDA Avenue 1 Block J Commercial Broadway Lahore');
    setDisplayTitle('LDA Avenue 1 - Block J (Bin Taha HQ)');
    setSearchInput('');
    setZoomLevel(16);
    setBlueprintZoom(1);
    setViewMode('blueprint');
  }

  const mapTypeParam = viewMode === 'satellite' ? 'k' : 'm';
  const encodedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    activeLocation
  )}&t=${mapTypeParam}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border border-cyan/30 shadow-cyan-glow">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
            <Compass className="h-6 w-6 animate-spin" style={{ animationDuration: '16s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-platinum">
                BUNYAD Master Layout &amp; GIS Radar Navigator
              </h2>
              <span className="chip border-emerald-400/50 text-emerald-400 font-mono text-[10px]">
                {viewMode === 'blueprint' ? 'BLUEPRINT PLAN' : 'LIVE GPS'}
              </span>
            </div>
            <p className="font-mono text-[11px] text-cyan/70 tracking-wider">
              Active Focus: <strong className="text-platinum">{displayTitle}</strong> &bull; CEO {CEO_NAME}
            </p>
          </div>
        </div>

        {/* 3-Way Mode Switcher: Blueprint vs Roadmap vs Satellite */}
        <div className="flex items-center gap-1 bg-obsidian/90 p-1 rounded-xl border border-cyan/20">
          <button
            type="button"
            onClick={() => setViewMode('blueprint')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'blueprint'
                ? 'bg-cyan text-obsidian shadow-cyan-glow'
                : 'text-platinum/60 hover:text-cyan'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" /> Society Blueprint Map
          </button>
          <button
            type="button"
            onClick={() => setViewMode('roadmap')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition cursor-pointer ${
              viewMode === 'roadmap'
                ? 'bg-cyan text-obsidian shadow-cyan-glow'
                : 'text-platinum/60 hover:text-cyan'
            }`}
          >
            Roadmap
          </button>
          <button
            type="button"
            onClick={() => setViewMode('satellite')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'satellite'
                ? 'bg-cyan text-obsidian shadow-cyan-glow'
                : 'text-platinum/60 hover:text-cyan'
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> Satellite
          </button>
        </div>
      </div>

      {/* Search Console & Quick Buttons */}
      <div className="glass rounded-xl p-4 space-y-3 border border-cyan/20">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan/50" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search society, block ya plot (e.g. Etihad Town Phase 1, Block J LDA Avenue 1)..."
              className="w-full rounded-xl border border-cyan/25 bg-obsidian/90 py-2.5 pl-10 pr-3 text-xs text-platinum placeholder:text-platinum/30 outline-none focus:border-cyan"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="btn-cyan flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold shadow-cyan-glow cursor-pointer"
            >
              <MapPin className="h-4 w-4" /> Locate
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-ghost py-2.5 px-3 text-xs text-platinum/70 hover:text-cyan flex items-center gap-1 border border-cyan/20 rounded-xl cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </form>

        {/* Societies Fast Jump */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-cyan/30">
          <span className="font-mono text-[10px] text-cyan/70 uppercase tracking-wider shrink-0 font-bold">
            Societies:
          </span>
          {TOP_SOCIETIES.map((soc) => (
            <button
              key={soc.name}
              type="button"
              onClick={() => handleSelectSociety(soc)}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-mono font-medium transition cursor-pointer shrink-0 ${
                displayTitle.includes(soc.name)
                  ? 'bg-cyan text-obsidian font-bold shadow-cyan-glow'
                  : 'bg-obsidian/60 text-platinum/70 border border-cyan/15 hover:border-cyan hover:text-cyan'
              }`}
            >
              {soc.name}
            </button>
          ))}
        </div>

        {/* LDA Avenue 1 Blocks */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-cyan/10 scrollbar-thin scrollbar-thumb-cyan/30">
          <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider shrink-0 font-bold mr-1">
            LDA Avenue 1 Blocks:
          </span>
          {Object.keys(LDA_BLOCKS).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => handleSelectLdaBlock(b)}
              className={`whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-mono transition cursor-pointer shrink-0 ${
                displayTitle.includes(b)
                  ? 'bg-emerald-400 text-obsidian font-bold shadow-sm'
                  : 'bg-obsidian/40 text-platinum/60 border border-cyan/15 hover:border-emerald-400/50 hover:text-emerald-400'
              }`}
            >
              {b.replace('Block ', '')} {b === 'Block J' ? '★' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative h-[65vh] min-h-[500px] w-full rounded-2xl border-2 border-cyan/40 bg-[#060b14] overflow-hidden shadow-2xl shadow-cyan/15">
        
        {viewMode === 'blueprint' ? (
          /* Blueprint / Layout Town Map Image View */
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#07111e]">
            <div 
              className="w-full h-full flex items-center justify-center transition-transform duration-300"
              style={{ transform: `scale(${blueprintZoom})` }}
            >
              <img
                src="./assets/lda-map.png"
                alt="Official Society Master Map"
                className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                onError={(e) => {
                  // اگر لوکل فائل نہ ہو تو ہائی ریزولوشن لے آؤٹ پلیس ہولڈر
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1600&q=80';
                }}
              />
            </div>

            {/* Blueprint Zoom Buttons */}
            <div className="absolute bottom-5 left-4 z-10 flex items-center gap-1.5 rounded-xl border border-cyan/30 bg-obsidian/90 p-1.5 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setBlueprintZoom(z => Math.min(3, z + 0.25))}
                className="rounded-lg p-1.5 text-cyan hover:bg-cyan/20 cursor-pointer"
                title="Zoom In Plan"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setBlueprintZoom(z => Math.max(0.75, z - 0.25))}
                className="rounded-lg p-1.5 text-cyan hover:bg-cyan/20 cursor-pointer"
                title="Zoom Out Plan"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setBlueprintZoom(1)}
                className="px-2 py-0.5 text-[10px] font-mono text-platinum/70 hover:text-cyan cursor-pointer"
              >
                100%
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Google Live Map (Roadmap / Satellite) */
          <>
            <iframe
              key={`${activeLocation}-${viewMode}-${zoomLevel}`}
              title="BUNYAD Master GIS Radar"
              src={encodedMapUrl}
              className="w-full h-full border-0 pointer-events-auto"
              loading="lazy"
              allowFullScreen
            />

            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(activeLocation)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-cyan/40 bg-obsidian/90 px-3.5 py-2 text-xs font-mono font-bold text-cyan backdrop-blur-md hover:bg-cyan hover:text-obsidian transition shadow-cyan-glow flex items-center gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Full Screen Google Maps
              </a>
            </div>

            {/* On-Map Zoom Presets */}
            <div className="absolute bottom-5 left-4 z-10 flex items-center gap-1.5 rounded-xl border border-cyan/30 bg-obsidian/90 p-1.5 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(20, z + 1))}
                className="rounded-lg p-1.5 text-cyan hover:bg-cyan/20 cursor-pointer"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(12, z - 1))}
                className="rounded-lg p-1.5 text-cyan hover:bg-cyan/20 cursor-pointer"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <div className="h-4 w-[1px] bg-cyan/20 mx-1" />
              {[14, 16, 18].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setZoomLevel(preset)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded-md cursor-pointer ${
                    zoomLevel === preset
                      ? 'bg-cyan text-obsidian font-bold'
                      : 'text-platinum/60 hover:text-platinum'
                  }`}
                >
                  {preset === 14 ? 'City' : preset === 16 ? 'Sector' : 'Plots'}
                </button>
              ))}
            </div>
          </>
        )}

        {/* View Indicator */}
        <div className="absolute bottom-5 right-4 z-10 hidden sm:flex items-center gap-2 rounded-xl border border-cyan/25 bg-obsidian/90 px-4 py-2 text-xs backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-platinum/80 text-[11px]">
            Active: <strong className="text-cyan">{displayTitle}</strong>
          </span>
        </div>
      </div>

      {/* Info Guidelines */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="glass rounded-xl p-4 border border-cyan/20 space-y-1.5 text-xs">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-cyan">
            <MapPin className="h-4 w-4" /> Society Master Plan &amp; GIS
          </h3>
          <p className="text-platinum/70 leading-relaxed">
            اب آپ اوپر موجود <strong>Society Blueprint Map</strong> بٹن سے اصل منظور شدہ نقشہ دیکھ سکتے ہیں اور ساتھ ہی لائیو گوگل روڈ میپ یا سیٹلائٹ پر بھی سوئچ کر سکتے ہیں۔
          </p>
        </div>

        <div className="glass rounded-xl p-4 border border-cyan/20 space-y-1.5 text-xs">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4" /> Verified Demarcations
          </h3>
          <p className="text-platinum/70 leading-relaxed">
            ایل ڈی اے، ڈی ایچ اے اور منظور شدہ سوسائٹیز کے باضابطہ ٹاؤن پلانز کے تحت 100 فیصد کلیئر اور ویری فائیڈ پلاٹس۔
          </p>
        </div>

        <div className="glass rounded-xl p-4 border border-cyan/20 flex flex-col justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-cyan">
              <Sparkles className="h-4 w-4" /> Demarcation Verification
            </h3>
            <p className="mt-1 text-xs text-platinum/60">
              آن سائٹ پلاٹ نشان دہی اور رجسٹری تصدیق کے لیے رابطہ کریں۔
            </p>
          </div>
          <a
            href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I am reviewing the Master Plan for: "${displayTitle}" on BUNYAD. Please share demarcation details.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyan mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp CEO
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(MasterMaps);
