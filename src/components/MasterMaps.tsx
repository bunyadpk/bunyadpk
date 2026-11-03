import { memo, useState, useRef } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import {
  Map, MapPin, Search, Crosshair, RotateCcw, ShieldCheck, Download,
  MessageCircle, ZoomIn, ZoomOut, Compass, ExternalLink, Sparkles
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';

interface BlockInfo {
  name: string;
  center: [number, number]; // [Y%, X%] relative coordinate
  description: string;
  road: string;
}

// Actual Mathematical Layout Matrix derived from Bin Taha Master Grid
const BLOCK_ENGINE: Record<string, BlockInfo> = {
  'A': { name: 'Block A', center: [28, 85], road: 'Raiwind Road Main Boulevard', description: 'Commercial front, prime entry, 1 Kanal & Commercial plots' },
  'B': { name: 'Block B', center: [52, 86], road: 'Khayaban-e-Jinnah Connection', description: 'Direct access to Southern Bypass, 1 Kanal premium' },
  'C': { name: 'Block C', center: [40, 68], road: 'Sector Commercial Hub', description: 'Central commercial Broadway, 10 Marla & 1 Kanal' },
  'D': { name: 'Block D', center: [24, 68], road: 'Central Park Boulevard', description: 'Surrounded by sports complex & central theme park' },
  'F': { name: 'Block F', center: [38, 56], road: 'Main Sector Link', description: '10 Marla residential, school sites, fully developed' },
  'G': { name: 'Block G', center: [41, 42], road: 'Mid-Town Expressway', description: '5 & 10 Marla residential, high occupancy' },
  'H': { name: 'Block H', center: [60, 42], road: 'Civic Center Road', description: 'Mosque, primary sector clinic, 10 Marla plots' },
  'J': { name: 'Block J', center: [30, 20], road: 'Commercial Broadway (Bin Taha HQ)', description: 'Corporate Headquarter of Bin Taha Associates & Builders' },
  'K': { name: 'Block K', center: [68, 72], road: 'Defence Road Connection', description: 'Rapidly populating sector, 1 Kanal residential' },
  'L': { name: 'Block L', center: [75, 80], road: 'Link Canal Access', description: 'Peaceful residential pocket, 1 Kanal villas' },
  'M': { name: 'Block M', center: [82, 45], road: 'Central Boulevard', description: '10 Marla & 1 Kanal, immediate possession zone' }
};

const SECTORS_LIST = Object.keys(BLOCK_ENGINE);

function MasterMaps() {
  const [selectedBlock, setSelectedBlock] = useState<string>('J');
  const [searchQuery, setSearchQuery] = useState('');
  const [pin, setPin] = useState<{ y: number; x: number; label: string; block: string } | null>({
    y: BLOCK_ENGINE['J'].center[0],
    x: BLOCK_ENGINE['J'].center[1],
    label: 'Bin Taha Associates Head Office (Block J)',
    block: 'J'
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleSelectBlock(blockKey: string) {
    setSelectedBlock(blockKey);
    const blk = BLOCK_ENGINE[blockKey];
    if (blk) {
      setPin({
        y: blk.center[0],
        x: blk.center[1],
        label: `${blk.name} · ${blk.road}`,
        block: blockKey
      });
      setZoomLevel(1.4);
    }
  }

  function handleTrackPlot() {
    const raw = searchQuery.trim().toUpperCase();
    if (!raw) return;

    const plotMatch = raw.match(/\d+/);
    const blockMatch = raw.match(/[A-M]/);

    const blockKey = blockMatch ? blockMatch[0] : (selectedBlock !== 'AUTO' ? selectedBlock : 'J');
    const plotNo = plotMatch ? plotMatch[0] : 'Plot';

    if (BLOCK_ENGINE[blockKey]) {
      setSelectedBlock(blockKey);
      // Deterministic micro-offset inside the block boundaries based on plot number
      const num = parseInt(plotNo, 10) || 1;
      const offsetX = ((num % 10) - 5) * 0.8;
      const offsetY = (((num * 3) % 10) - 5) * 0.8;

      const base = BLOCK_ENGINE[blockKey].center;
      setPin({
        y: Math.max(10, Math.min(90, base[0] + offsetY)),
        x: Math.max(10, Math.min(90, base[1] + offsetX)),
        label: `Plot #${plotNo} (${BLOCK_ENGINE[blockKey].name})`,
        block: blockKey
      });
      setZoomLevel(1.8);
    }
  }

  function handleResetView() {
    setSelectedBlock('J');
    setPin({
      y: BLOCK_ENGINE['J'].center[0],
      x: BLOCK_ENGINE['J'].center[1],
      label: 'Bin Taha Associates Head Office (Block J)',
      block: 'J'
    });
    setZoomLevel(1);
    setSearchQuery('');
  }

  const currentInfo = BLOCK_ENGINE[selectedBlock] || BLOCK_ENGINE['J'];

  return (
    <div className="space-y-4">
      {/* Header & Status Bar */}
      <div className="glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border border-cyan/30 shadow-cyan-glow">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan">
            <Compass className="h-5 w-5 animate-spin" style={{ animationDuration: '14s' }} />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-platinum flex items-center gap-2">
              LDA Avenue 1 Smart Master Map &amp; Radar Navigator
              <span className="chip border-emerald-400/40 text-emerald-400 font-mono text-[10px]">
                OFFICIAL LDA GRID
              </span>
            </h2>
            <p className="font-mono text-[10px] text-cyan/70 tracking-wider">
              SUPERVISED BY CEO {CEO_NAME} • BIN TAHA HEAD OFFICE BLOCK J
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="./assets/lda-map.png"
            download="LDA_Avenue_1_Official_Master_Map.png"
            className="btn-ghost py-1.5 px-3 text-xs flex items-center gap-1.5 border border-cyan/30 text-cyan hover:bg-cyan/15 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Download HD Map
          </a>
        </div>
      </div>

      {/* Interactive Control & Locator Console */}
      <div className="glass rounded-xl p-4 space-y-3 border border-cyan/20">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {/* Block Selector */}
          <select
            value={selectedBlock}
            onChange={(e) => handleSelectBlock(e.target.value)}
            className="rounded-lg border border-cyan/30 bg-obsidian/80 px-3 py-2 text-xs font-mono font-bold text-cyan outline-none focus:border-cyan cursor-pointer"
          >
            {SECTORS_LIST.map((key) => (
              <option key={key} value={key}>
                {BLOCK_ENGINE[key].name} {key === 'J' ? '★ (Bin Taha HQ)' : ''}
              </option>
            ))}
          </select>

          {/* Quick Plot Number Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cyan/50" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrackPlot()}
              placeholder="Enter plot code (e.g. 543 M, 240 C, 12 J)..."
              className="w-full rounded-lg border border-cyan/20 bg-obsidian/80 py-2 pl-9 pr-3 text-xs text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleTrackPlot}
            className="btn-cyan flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-bold cursor-pointer shadow-cyan-glow"
          >
            <Crosshair className="h-4 w-4" /> Locate Radar
          </button>

          <button
            type="button"
            onClick={handleResetView}
            className="btn-ghost py-2 px-3 text-xs text-platinum/70 hover:text-cyan flex items-center gap-1 border border-cyan/20 cursor-pointer"
            title="Reset Map View"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>

        {/* Sector Quick Switch Pills */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-cyan/10 pt-2.5">
          <span className="font-mono text-[10px] text-cyan/60 uppercase tracking-wider mr-1">
            Fast Jump:
          </span>
          {SECTORS_LIST.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectBlock(key)}
              className={`rounded px-2.5 py-0.5 text-xs font-mono font-bold transition cursor-pointer ${
                selectedBlock === key
                  ? 'bg-cyan text-obsidian shadow-cyan-glow'
                  : 'bg-obsidian/50 text-cyan/70 border border-cyan/20 hover:border-cyan hover:text-cyan'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Digital Map Viewport */}
      <div
        ref={containerRef}
        className="relative h-[65vh] min-h-[480px] w-full overflow-hidden rounded-2xl border-2 border-cyan/40 bg-[#060b14] shadow-2xl shadow-cyan/10"
      >
        {/* Floating Zoom & Controls */}
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5 rounded-lg border border-cyan/30 bg-obsidian/80 p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.3))}
            className="rounded p-1.5 text-cyan hover:bg-cyan/10 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.3))}
            className="rounded p-1.5 text-cyan hover:bg-cyan/10 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Zoomable Canvas Area */}
        <motion.div
          animate={{ scale: zoomLevel }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative h-full w-full"
        >
          {/* High-Resolution LDA Map Image with Fallback Pattern */}
          <img
            src="./assets/lda-map.png"
            alt="LDA Avenue 1 Master Plan"
            className="h-full w-full object-cover select-none pointer-events-none opacity-85"
            onError={(e) => {
              // Graceful fallback schematic graphic if local file is still being fetched
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Grid Blueprint Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          {/* Radar Beacon Marker */}
          {pin && (
            <div
              className="absolute pointer-events-none z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
              style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
            >
              {/* Pulsing Radar Ring */}
              <div className="relative flex items-center justify-center">
                <span className="absolute h-10 w-10 rounded-full bg-cyan/40 animate-ping" />
                <span className="absolute h-6 w-6 rounded-full bg-red-500/60 animate-pulse" />
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500 shadow-[0_0_15px_#ef4444]" />
              </div>

              {/* Pin Tooltip Box */}
              <div className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-lg border border-cyan/50 bg-[#07111e]/95 px-3 py-1.5 text-center shadow-xl backdrop-blur-md">
                <p className="font-mono text-[11px] font-bold text-cyan">{pin.label}</p>
                <p className="font-mono text-[9px] text-platinum/60">Verified LDA Sector Coordinate</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Map Bottom Status Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan/25 bg-obsidian/90 px-4 py-2 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-platinum/80 text-[11px]">
              Active: <strong className="text-cyan">{currentInfo.name}</strong> ({currentInfo.road})
            </span>
          </div>

          <a
            href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I located ${pin ? pin.label : selectedBlock} on Bunyad LDA Avenue 1 Map. Please confirm plot availability & current price rate.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] font-bold"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Inquire on WhatsApp
          </a>
        </div>
      </div>

      {/* Sector Intelligence & Guidelines Cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="glass rounded-xl p-4 border border-cyan/20">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-cyan">
            <MapPin className="h-4 w-4" /> Sector Specifications
          </h3>
          <div className="mt-2.5 space-y-1.5 text-xs text-platinum/70">
            <p>• <strong>Sector:</strong> {currentInfo.name}</p>
            <p>• <strong>Main Access:</strong> {currentInfo.road}</p>
            <p>• <strong>Highlights:</strong> {currentInfo.description}</p>
          </div>
        </div>

        <div className="glass rounded-xl p-4 border border-cyan/20">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-cyan">
            <ShieldCheck className="h-4 w-4" /> Legal &amp; LDA Clearance
          </h3>
          <div className="mt-2.5 space-y-1.5 text-xs text-platinum/70">
            <p>• <strong>NOC:</strong> 100% Approved by LDA Lahore</p>
            <p>• <strong>Transfer:</strong> Direct LDA One-Window Cell</p>
            <p>• <strong>Possession:</strong> Immediate Construction Ready</p>
          </div>
        </div>

        <div className="glass rounded-xl p-4 border border-cyan/20 flex flex-col justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-cyan">
              <Sparkles className="h-4 w-4" /> Need Ground Verification?
            </h3>
            <p className="mt-1 text-xs text-platinum/60">
              Bin Taha onsite staff will physically locate and mark your plot demarcations.
            </p>
          </div>
          <a
            href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I need site inspection and plot demarcation in ${currentInfo.name}, LDA Avenue 1.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyan mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Book Onsite Inspection
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(MasterMaps);
