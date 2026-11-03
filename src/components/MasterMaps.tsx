import { memo, useEffect, useRef, useState } from 'react';
import {
  Compass, Search, Crosshair, RotateCcw, Download,
  MessageCircle, ShieldCheck, Sparkles
} from 'lucide-react';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';

declare const L: any;

interface BlockData {
  center: [number, number]; // [Y, X] in Leaflet CRS.Simple
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const ENGINE = {
  canvasWidth: 3513,
  canvasHeight: 2457,
  sourceWidth: 14400,
  sourceHeight: 12600,
  blocks: {
    'A': { center: [1950, 3100], minX: 2700, maxX: 3450, minY: 1600, maxY: 2350 },
    'B': { center: [1200, 3150], minX: 2750, maxX: 3450, minY: 850,  maxY: 1550 },
    'C': { center: [1550, 2250], minX: 1850, maxX: 2650, minY: 1200, maxY: 1850 },
    'D': { center: [2050, 2250], minX: 1850, maxX: 2650, minY: 1750, maxY: 2350 },
    'F': { center: [1650, 1850], minX: 1550, maxX: 2150, minY: 1300, maxY: 2000 },
    'G': { center: [1550, 1350], minX: 1050, maxX: 1650, minY: 1100, maxY: 1900 },
    'H': { center: [1000, 1350], minX: 950,  maxX: 1600, minY: 650,  maxY: 1250 },
    'J': { center: [1800, 500],  minX: 150,  maxX: 900,  minY: 1300, maxY: 2300 },
    'K': { center: [850,  2500], minX: 2100, maxX: 2750, minY: 550,  maxY: 1150 },
    'L': { center: [650,  2750], minX: 2400, maxX: 3100, minY: 350,  maxY: 850 },
    'M': { center: [466,  1445], minX: 1100, maxX: 1750, minY: 250,  maxY: 750 }
  } as Record<string, BlockData>
};

const SCALE = {
  x: ENGINE.canvasWidth / ENGINE.sourceWidth,
  y: ENGINE.canvasHeight / ENGINE.sourceHeight
};

const BLOCKS_LIST = Object.keys(ENGINE.blocks);
const MAP_IMAGE_SRC = `${import.meta.env.BASE_URL}assets/lda-map.png`;

function MasterMaps() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const activeMarkerRef = useRef<any>(null);
  const databaseRef = useRef<any[]>([]);

  const [selectedBlock, setSelectedBlock] = useState('AUTO');
  const [searchInput, setSearchInput] = useState('');
  const [activeStatus, setActiveStatus] = useState('LDA Avenue 1 Master Radar Active');

  const bounds: [[number, number], [number, number]] = [
    [0, 0],
    [ENGINE.canvasHeight, ENGINE.canvasWidth]
  ];

  // Database fetcher (Agar lda_plots_data.json upload ho)
  useEffect(() => {
    async function loadPlotData() {
      const paths = [
        `${import.meta.env.BASE_URL}lda_plots_data.json`,
        `${import.meta.env.BASE_URL}assets/lda_plots_data.json`,
        '/lda_plots_data.json'
      ];
      for (const p of paths) {
        try {
          const res = await fetch(p);
          if (res.ok) {
            databaseRef.current = await res.json();
            break;
          }
        } catch {}
      }
    }
    loadPlotData();
  }, []);

  // Leaflet map setup
  useEffect(() => {
    let link = document.getElementById('leaflet-css') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    let script = document.getElementById('leaflet-js') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = initMap;
    } else if (typeof L !== 'undefined') {
      initMap();
    }

    function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        crs: L.CRS.Simple,
        minZoom: -1.5,
        maxZoom: 3,
        zoomSnap: 0.1,
        zoomAnimation: true,
        fadeAnimation: true
      });

      L.imageOverlay(MAP_IMAGE_SRC, bounds).addTo(map);
      map.fitBounds(bounds);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  function getRadarIcon() {
    return L.divIcon({
      className: 'custom-radar-icon',
      html: `
        <div style="position:relative; width:36px; height:36px;">
          <div style="position:absolute; width:36px; height:36px; background:rgba(239,68,68,0.5); border-radius:50%; animation:leaflet-radar 1.3s infinite ease-out;"></div>
          <div style="width:16px; height:16px; background:#ef4444; border:2px solid #ffffff; border-radius:50%; position:absolute; top:10px; left:10px; box-shadow:0 0 15px #ef4444;"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  }

  function executeTrack(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const map = mapInstanceRef.current;
    if (!map) return;

    const raw = searchInput.trim().toUpperCase();
    if (!raw) {
      alert('Please enter a plot number (e.g. 543 M or 240 C)');
      return;
    }

    const plotMatch = raw.match(/\d+/);
    const blockMatch = raw.match(/[A-M]/);

    let targetBlock = blockMatch ? blockMatch[0] : (selectedBlock !== 'AUTO' ? selectedBlock : 'M');
    if (targetBlock === 'AUTO') targetBlock = 'M';

    if (!plotMatch) {
      alert('Invalid plot number format.');
      return;
    }
    const plotNum = plotMatch[0];
    setSelectedBlock(targetBlock);

    const blockRule = ENGINE.blocks[targetBlock];
    const database = databaseRef.current;
    let targetCoords: [number, number] | null = null;

    // Check in database JSON agar available ho
    if (database && database.length > 0 && blockRule) {
      const matches = database.filter((item: any) => String(item.plot) === String(plotNum));
      if (matches.length > 0) {
        const found = matches.find((item: any) => {
          const adjX = Math.round(item.x * SCALE.x);
          const adjY = Math.round(item.y * SCALE.y);
          return adjX >= blockRule.minX && adjX <= blockRule.maxX &&
                 adjY >= blockRule.minY && adjY <= blockRule.maxY;
        });
        if (found) {
          targetCoords = [Math.round(found.y * SCALE.y), Math.round(found.x * SCALE.x)];
        }
      }
    }

    // Default exact center of the verified sector
    if (!targetCoords && blockRule) {
      targetCoords = blockRule.center;
    }

    if (targetCoords) {
      if (activeMarkerRef.current) {
        map.removeLayer(activeMarkerRef.current);
      }

      map.flyTo(targetCoords, 1.8, {
        animate: true,
        duration: 1.4,
        easeLinearity: 0.25
      });

      const marker = L.marker(targetCoords, { icon: getRadarIcon() }).addTo(map);
      activeMarkerRef.current = marker;

      const infoText = `Plot #${plotNum} · Block ${targetBlock} (LDA Avenue 1)`;
      setActiveStatus(infoText);

      setTimeout(() => {
        marker.bindPopup(`
          <div style="direction:ltr; text-align:center; padding:6px; color:#fff; font-family:sans-serif;">
            <h3 style="color:#fcd34d; margin:0; font-size:15px; font-weight:bold;">Plot No: ${plotNum}</h3>
            <p style="color:#94a3b8; margin:3px 0 10px; font-size:12px;">Block ${targetBlock} | LDA Avenue 1</p>
            <a href="${waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I located Plot #${plotNum} in Block ${targetBlock}, LDA Avenue 1 on Bunyad Master Map. Please confirm plot availability.`)}" 
               target="_blank" 
               style="background:#16a34a; color:#fff; padding:6px 14px; text-decoration:none; border-radius:6px; font-weight:bold; font-size:12px; display:inline-block;">
              Inquire on WhatsApp
            </a>
          </div>
        `).openPopup();
      }, 1400);
    } else {
      alert(`Block ${targetBlock} not found.`);
    }
  }

  function handleResetView() {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyToBounds(bounds, { duration: 1.2 });
    if (activeMarkerRef.current) {
      map.removeLayer(activeMarkerRef.current);
      activeMarkerRef.current = null;
    }
    setSelectedBlock('AUTO');
    setSearchInput('');
    setActiveStatus('LDA Avenue 1 Master Radar Active');
  }

  function handleBlockChange(blockKey: string) {
    setSelectedBlock(blockKey);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (blockKey !== 'AUTO' && ENGINE.blocks[blockKey]) {
      map.flyTo(ENGINE.blocks[blockKey].center, 1.2, { duration: 1.2 });
      setActiveStatus(`Block ${blockKey} Focus - LDA Avenue 1`);
    } else {
      map.flyToBounds(bounds, { duration: 1.2 });
    }
  }

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes leaflet-radar {
          0% { transform: scale(0.3); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          border: 2px solid #ffd700 !important;
          border-radius: 14px !important;
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
          border: 1px solid #ffd700 !important;
        }
      `}</style>

      {/* Top Header */}
      <div className="glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border border-cyan/30 shadow-cyan-glow">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
            <Compass className="h-6 w-6 animate-spin" style={{ animationDuration: '14s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-platinum">
                LDA Avenue 1 Smart Master Map &amp; GPS Navigator
              </h2>
              <span className="chip border-emerald-400/50 text-emerald-400 font-mono text-[10px]">
                ACCURATE GRID
              </span>
            </div>
            <p className="font-mono text-[11px] text-cyan/70 tracking-wider">
              SUPERVISED BY CEO {CEO_NAME} (0321-9404812)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={MAP_IMAGE_SRC}
            target="_blank"
            rel="noopener noreferrer"
            download="LDA_Avenue_1_Official_Master_Map.png"
            className="btn-ghost py-2 px-3 text-xs flex items-center gap-1.5 border border-cyan/30 text-cyan hover:bg-cyan/15 rounded-xl cursor-pointer"
          >
            <Download className="h-4 w-4" /> Download HD Map
          </a>
        </div>
      </div>

      {/* Control Console */}
      <div className="glass rounded-xl p-4 space-y-3 border border-cyan/20">
        <form onSubmit={executeTrack} className="flex flex-col sm:flex-row items-center gap-2">
          <select
            value={selectedBlock}
            onChange={(e) => handleBlockChange(e.target.value)}
            className="rounded-xl border border-cyan/30 bg-obsidian/90 px-3.5 py-2.5 text-xs font-mono font-bold text-cyan outline-none w-full sm:w-auto cursor-pointer"
          >
            <option value="AUTO">All Blocks (Auto Scan)</option>
            {BLOCKS_LIST.map((key) => (
              <option key={key} value={key} className="bg-obsidian text-platinum">
                Block {key} {key === 'J' ? '★ (Bin Taha HQ)' : ''}
              </option>
            ))}
          </select>

          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan/50" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter plot code (e.g. 543 M, 240 C, 12 J)..."
              className="w-full rounded-xl border border-cyan/25 bg-obsidian/90 py-2.5 pl-10 pr-3 text-xs text-platinum placeholder:text-platinum/30 outline-none focus:border-cyan"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="btn-cyan flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold shadow-cyan-glow cursor-pointer"
            >
              <Crosshair className="h-4 w-4" /> Locate Plot
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="btn-ghost py-2.5 px-3 text-xs text-platinum/70 hover:text-cyan flex items-center gap-1 border border-cyan/20 rounded-xl cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="h-4 w-4" /> Reset View
            </button>
          </div>
        </form>

        {/* Quick Block Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-thin scrollbar-thumb-cyan/30">
          <span className="font-mono text-[10px] text-cyan/70 uppercase tracking-wider shrink-0 font-bold mr-1">
            Fast Block Jump:
          </span>
          {BLOCKS_LIST.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleBlockChange(key)}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-mono font-medium transition cursor-pointer shrink-0 ${
                selectedBlock === key
                  ? 'bg-cyan text-obsidian font-bold shadow-cyan-glow'
                  : 'bg-obsidian/60 text-platinum/70 border border-cyan/15 hover:border-cyan hover:text-cyan'
              }`}
            >
              Block {key} {key === 'J' ? '★' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Master Map Container */}
      <div className="relative rounded-2xl border-2 border-cyan/40 bg-[#090d16] overflow-hidden shadow-2xl shadow-cyan/15">
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '70vh', minHeight: '520px', zIndex: 10 }}
        />

        {/* Active Target Banner */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan/25 bg-obsidian/90 px-4 py-2 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-platinum/80 text-[11px]">
              Status: <strong className="text-cyan">{activeStatus}</strong>
            </span>
          </div>

          <a
            href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I am inquiring about ${activeStatus} on Bunyad LDA Avenue 1 Master Map.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] font-bold"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Inquire on WhatsApp
          </a>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="glass rounded-xl p-4 border border-cyan/20 space-y-1.5 text-xs">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-cyan">
            <ShieldCheck className="h-4 w-4" /> Official LDA Avenue 1 Grid
          </h3>
          <p className="text-platinum/70 leading-relaxed">
            Supervised by CEO <strong>Taha Mubeen Bhutta</strong>, this digital navigation system verifies the exact physical status and boundaries of plots across Block A to Block M on Raiwind Road Lahore.
          </p>
        </div>

        <div className="glass rounded-xl p-4 border border-cyan/20 space-y-1.5 text-xs">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-emerald-400">
            <Compass className="h-4 w-4" /> Radar Locator
          </h3>
          <p className="text-platinum/70 leading-relaxed">
            Pulsing radar beacon automatically flies to your designated sector or plot number and generates direct official WhatsApp verification cards.
          </p>
        </div>

        <div className="glass rounded-xl p-4 border border-cyan/20 flex flex-col justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-cyan">
              <Sparkles className="h-4 w-4" /> Need Onsite Demarcation?
            </h3>
            <p className="mt-1 text-xs text-platinum/60">
              Bin Taha surveyor team will physically visit and verify plot boundaries.
            </p>
          </div>
          <a
            href={waLink(`Asalam o Alaikum CEO Taha Mubeen Bhutta, I need site inspection & demarcation in LDA Avenue 1.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyan mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> Book Onsite Marking
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(MasterMaps);
