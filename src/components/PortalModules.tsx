{/* ----------------- PROFESSIONAL COMPACT ABOUT (ROMAN URDU / TECH) ----------------- */}
        {activeModule === 'about' && (
          <div className="space-y-5">
            
            {/* Header Badge & Title */}
            <div className="flex items-start gap-4 border-b border-cyan/20 pb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan/40 bg-cyan/10 text-cyan shadow-cyan-glow">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <span className="inline-block rounded-full border border-cyan/30 bg-cyan/15 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan">
                  Enterprise PropTech Ecosystem
                </span>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  About BUNYAD.PK <span className="font-sans font-normal text-cyan">(بنیاد)</span>
                </h2>
                <p className="mt-0.5 font-mono text-xs text-platinum/60">
                  Bin Taha Associates • CEO Taha Mubeen Bhutta • 0321-9404812
                </p>
              </div>
            </div>

            {/* Direct Mission Statement */}
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              <strong className="text-white">BUNYAD.PK</strong> Pakistan ka first verified PropTech portal hai jo real estate deals ko transparent, digital aur 100% legal banata hai. Hum LDA Avenue 1 aur 38 housing schemes mein physical on-ground survey, live GIS mapping aur secure transactions provide karte hain.
            </p>

            {/* 4 Clean Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              <div className="rounded-xl border border-cyan/20 bg-slate-900/60 p-3.5 space-y-1 hover:border-cyan/50 transition">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan">
                  <MapPin className="h-4 w-4" /> Live GIS Radar Maps
                </div>
                <p className="text-[11px] text-platinum/70 leading-normal">
                  LDA Avenue 1 (Block A to M) aur 38 prime societies ke official digitised layouts aur pin-point plot locators.
                </p>
              </div>

              <div className="rounded-xl border border-cyan/20 bg-slate-900/60 p-3.5 space-y-1 hover:border-cyan/50 transition">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400">
                  <Award className="h-4 w-4" /> Authority Document NDC
                </div>
                <p className="text-[11px] text-platinum/70 leading-normal">
                  LDA, CDA, RDA aur DHA verified documentation, balloting records, clear possession aur titles.
                </p>
              </div>

              <div className="rounded-xl border border-cyan/20 bg-slate-900/60 p-3.5 space-y-1 hover:border-cyan/50 transition">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan">
                  <Compass className="h-4 w-4" /> On-Site Demarcation
                </div>
                <p className="text-[11px] text-platinum/70 leading-normal">
                  Total Station land survey aur high-precision technical tools ke zariye actual ground marking aur pillar verification.
                </p>
              </div>

              <div className="rounded-xl border border-cyan/20 bg-slate-900/60 p-3.5 space-y-1 hover:border-cyan/50 transition">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400">
                  <ShieldCheck className="h-4 w-4" /> 100% Escrow Protection
                </div>
                <p className="text-[11px] text-platinum/70 leading-normal">
                  Overseas Pakistanis ke liye safe investment, transparent token settlement aur live construction materials index.
                </p>
              </div>

            </div>

            {/* CEO Desk Contact */}
            <div className="rounded-xl border border-cyan/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyan">Executive Advisory</div>
                <div className="text-sm font-bold text-white">CEO Taha Mubeen Bhutta</div>
                <div className="text-[11px] text-platinum/60">Bin Taha Associates • LDA Avenue 1, Lahore</div>
              </div>
              <a
                href="https://wa.me/923219404812"
                target="_blank"
                rel="noreferrer"
                className="btn-cyan flex items-center gap-1.5 px-4 py-2 font-mono text-xs font-bold shadow-cyan-glow"
              >
                <span>WhatsApp CEO</span>
                <span>→</span>
              </a>
            </div>

          </div>
        )}
