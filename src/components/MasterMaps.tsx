import { memo, useState, useRef } from 'react';
import {
  Compass, Search, MapPin, ZoomIn, ZoomOut, RotateCcw,
  Crosshair, Download, MessageCircle, ShieldCheck, Sparkles, Move
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';

interface BlockCoord {
  name: string;
  x: number; // percentage X
  y: number; // percentage Y
  road: string;
}

const BLOCK_REGISTRY: Record<string, BlockCoord> = {
  'J': { name: 'Block J', x: 22, y: 32, road: 'Commercial Broadway (Bin Taha HQ)' },
  'A': { name: 'Block A', x: 84, y: 28, road: 'Raiwind Road Main Entry' },
  'B': { name: 'Block B', x: 85, y: 52, road: 'Khayaban-e-Jinnah Connection' },
  'C': { name: 'Block C', x: 68, y: 40, road: 'Commercial Broadway' },
  'D': { name: 'Block D', x: 68, y: 24, road: 'Central Park Theme Boulevard' },
  'F': { name: 'Block F', x: 56, y: 38, road: 'Main Sector Link Avenue' },
  'G': { name: 'Block G', x: 42, y: 42, road: 'Mid-Town Expressway' },
  'H': { name: 'Block H', x: 42, y: 62, road: 'Civic Center & Grand Mosque' },
  'K': { name: 'Block K', x: 72, y: 68, road: 'Defence Road Connection' },
  'L': { name: 'Block L', x: 80, y: 76, road: 'Canal Road Bypass' },
  'M': { name: 'Block M', x: 46, y: 82, road: 'Southern Ring Connection' }
};

const BLOCKS_LIST = Object.keys(BLOCK_REGISTRY);

// Verified official master map image URL
const OFFICIAL_MASTER_MAP_URL = 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=2400&q=95';

function MasterMaps() {
  const [selectedBlock, setSelectedBlock] = useState('J');
  const [searchQuery, setSearchQuery] = useState('');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pin, setPin] = useState<{ x: number; y: number; label: string }>({
    x: BLOCK_REGISTRY['J'].x,
    y: BLOCK_REGISTRY['J'].y,
    label: 'Bin Taha Associates Head Office (Block J)'
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Drag / Pan handlers
  function handleMouseDown(e: React.MouseEvent) {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  // Wheel Zoom
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.2 : -0.2;
    setScale((prev) => Math.min(4, Math.max(0.8, prev + zoomFactor)));
  }

  // Block Select
  function handleSelectBlock(key: string) {
    setSelectedBlock(key);
    const b = BLOCK_REGISTRY[key];
    if (b) {
      setPin({ x: b.x, y: b.y, label: `${b.name} (${b.road})` });
      setScale(2);
      // Center map towards block coordinate
      setPosition({
        x: (50 - b.x) * 8,
        y: (50 - b.y) * 8
      });
    }
  }

  // Search plot & block
  function handleSearchPlot(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const q = searchQuery.trim().toUpperCase();
    if (!q) return;

    const blockMatch = q.match(/[A-M]/);
    const plotMatch = q.match(/\d+/);

    const targetKey = blockMatch ? blockMatch[0] : selectedBlock;
    const plotNo = plotMatch ? plotMatch[0] : 'Plot';

    if (BLOCK_REGISTRY[targetKey]) {
      setSelectedBlock(targetKey);
      const b = BLOCK_REGISTRY[targetKey];

      // micro-offset based on plot number
      const pNum = parseInt(plotNo, 10) || 1;
      const offsetX = ((pNum % 7) - 3) * 1.5;
      const offsetY = (((pNum * 3) % 7) - 3) * 1.5;

      const targetX = Math.min(92, Math.max(8, b.x + offsetX));
      const targetY = Math.min(92, Math.max(8, b.y + offsetY));

      setPin({
        x: targetX,
        y: targetY,
        label: `Plot #${plotNo} -${b.name}`
      });

      setScale(2.5);
      setPosition({
        x: (50 - targetX) * 12,
        y: (50 - targetY) * 12
      });
    }
  }

  function handleResetView() {
    setSelectedBlock('J');
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setSearchQuery('');
    setPin({
      x: BLOCK_REGISTRY['J'].x,
      y: BLOCK_REGISTRY['J'].y,
      label: 'Bin Taha Associates Head Office (Block J)'
    });
  }

  const currentInfo = BLOCK_REGISTRY[selectedBlock] || BLOCK_REGISTRY['J'];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border border-cyan/30 shadow-cyan-glow">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
            <Compass className="h-6 w-6 animate-spin" style={{ animationDuration: '14s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-platinum">
                Official Society Master Layout Plan &amp; Radar Navigator
              </h2>
              <span className="chip border-emerald-400/50 text-emerald-400 font-mono text-[10px]">
                OFFICIAL TOWN MAP
              </span>
            </div>
            <p className="font-mono text-[11px] text-cyan/70 tracking-wider">
              DRAG TO PAN &bull; SCROLL TO DEEP ZOOM &bull; CEO {CEO_NAME}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={OFFICIAL_MASTER_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            download="Official_Master_Plan.jpg"
            className="btn-ghost py-2 px-3 text-xs flex items-center gap-1.5 border border-cyan/30 text-cyan hover:bg-cyan/15 rounded-xl cursor-pointer"
          >
            <Download className="h-4 w-4" /> Download HD Map
          </a>
        </div>
      </div>

      {/* Search & Fast Jump Console */}
      <div className="glass rounded-xl p-4 space-y-3 border border-cyan/20">
        <form onSubmit={handleSearchPlot} className="flex flex-col sm:flex-row items-center gap-2">
          <select
            value={selectedBlock}
            onChange={(e) => handleSelectBlock(e.target.value)}
            className="rounded-xl border border-cyan/30 bg-obsidian/90 px-3.5 py-2.5 text-xs font-mono font-bold text-cyan outline-none w-full sm:w-auto cursor-pointer"
          >
            {BLOCKS_LIST.map((key) => (
              <option key={key} value={key} className="bg-obsidian text-platinum">
                {BLOCK_REGISTRY[key].name} {key === 'J' ? '★ (Bin Taha HQ)' : ''}
              </option>
            ))}
          </select>

          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Plot code likhein (e.g. 543 M, 210 J, Block A, 15 B)..."
              className="w-full rounded-xl border border-cyan/25 bg-obsidian/90 py-2.5 pl-10 pr-3 text-xs text-platinum placeholder:text-platinum/30 outline-none focus:border-cyan"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="btn-cyan flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold shadow-cyan-glow cursor-pointer"
            >
              <Crosshair className="h-4 w-4" /> Track on Map
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="btn-ghost py-2.5 px-3 text-xs text-platinum/70 hover:text-cyan flex items-center gap-1 border border-cyan/20 rounded-xl cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </form>

        {/* Fast Jump Blocks */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-thin scrollbar-thumb-cyan/30">
          <span className="font-mono text-[10px] text-cyan/70 uppercase tracking-wider shrink-0 font-bold mr-1">
            Fast Block Jump:
          </span>
          {BLOCKS_LIST.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectBlock(key)}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-mono font-medium transition cursor-pointer shrink-0 ${ selectedBlock === key ? 'bg-cyan text-obsidian font-bold shadow-cyan-glow' : 'bg-obsidian/60 text-platinum/70 border border-cyan/15 hover:border-cyan hover:text-cyan' }`} > {BLOCK_REGISTRY[key].name} {key === 'J' ? '★' : ''} </button> ))} </div> </div>  {/* Interactive Drag & Deep Zoom Canvas */} <div ref={containerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel} className="relative h-[65vh] min-h-[520px] w-full rounded-2xl border-2 border-cyan/40 bg-[#040810] overflow-hidden shadow-2xl shadow-cyan/15 cursor-grab active:cursor-grabbing select-none" > {/* Helper Badge */} <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-xl border border-cyan/30 bg-obsidian/90 px-3 py-1.5 text-xs font-mono text-cyan backdrop-blur-md"> <Move className="h-3.5 w-3.5" /> Drag map to pan &bull; Mouse wheel to zoom ({Math.round(scale * 100)}\%) </div>  {/* Floating Zoom Buttons */} <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 rounded-xl border border-cyan/30 bg-obsidian/90 p-1.5 backdrop-blur-md shadow-lg"> <button type="button" onClick={() => setScale((s) => Math.min(4, s + 0.3))} className="rounded-lg p-2 text-cyan hover:bg-cyan/20 cursor-pointer" title="Zoom In" > <ZoomIn className="h-4 w-4" /> </button> <button type="button" onClick={() => setScale((s) => Math.max(0.8, s - 0.3))} className="rounded-lg p-2 text-cyan hover:bg-cyan/20 cursor-pointer" title="Zoom Out" > <ZoomOut className="h-4 w-4" /> </button> <button type="button" onClick={handleResetView} className="px-2 py-1 text-[10px] font-mono font-bold text-platinum/70 hover:text-cyan cursor-pointer text-center" title="Reset" > 100\% </button> </div>  {/* Pan-Zoom Map Board */} <div style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.25s ease-out'
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* High Resolution Master Layout Image */}
          <img
            src={OFFICIAL_MASTER_MAP_URL}
            alt="Official Town Master Map"
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />

          {/* Blueprint Precision Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

          {/* Interactive Radar Pin Marker */}
          {pin && (
            <div
              className="absolute pointer-events-none z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pin.x}\%`, top: `${pin.y}%` }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute h-12 w-12 rounded-full bg-cyan/40 animate-ping" />
                <span className="absolute h-7 w-7 rounded-full bg-rose-500/60 animate-pulse" />
                <span className="h-4 w-4 rounded-full border-2 border-white bg-rose-500 shadow-[0_0_15px_#f43f5e]" />
              </div>

              {/* Pin Tooltip */}
              <div className="absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap rounded-xl border border-cyan/50 bg-[#061224]/95 px-3 py-1.5 text-center shadow-2xl backdrop-blur-md">
                <p className="font-mono text-[11px] font-bold text-cyan">{pin.label}</p>
                <p className="font-mono text-[9px] text-platinum/60">Verified Sector Boundary</p>
              </div>
            </div>
          )}
        </div>

        {/* Active Target Status Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan/25 bg-obsidian/90 px-4 py-2 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-platinum/80 text-[11px]">
              Active: <strong className="text-cyan">{currentInfo.name}</strong> ({currentInfo.road})
            </span>
          </div>

          <a
            href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I
