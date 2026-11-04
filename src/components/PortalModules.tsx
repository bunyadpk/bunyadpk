{/* ----------------- ENTERPRISE EXECUTIVE ABOUT MODAL (PURE ENGLISH) ----------------- */}
        {activeModule === 'about' && (
          <div className="space-y-6">
            
            {/* Modal Header */}
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
                  Institutional Real Estate Intelligence • Supervised by CEO {CEO_NAME}
                </p>
              </div>
            </div>

            {/* Corporate Overview & Value Proposition */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs sm:text-sm leading-relaxed text-slate-300">
              <strong className="text-white font-semibold">BUNYAD.PK</strong> is Pakistan’s leading digital land verification platform, master GIS spatial radar, and civil infrastructure consultancy ecosystem. Designed to eliminate land title ambiguities, documentation forgery, and speculative risks, the portal delivers institutional-grade transparency, real-time spatial analytics, and rigorous due diligence for domestic investors and overseas Pakistanis.
            </div>

            {/* 4 Strategic Pillars */}
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

            {/* Executive Leadership & Direct Advisory */}
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
                href={`https://wa.me/923219404812?text=${encodeURIComponent("Inquiring via BUNYAD.PK Enterprise Portal regarding land verification and GIS mapping.")}`}
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
