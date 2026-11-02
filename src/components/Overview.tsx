import { motion } from '@/lib/motion';
import { Building2, MapPin, Users, Hammer, ShieldCheck, Bot, Calculator, Briefcase } from 'lucide-react';
import { SOCIETIES } from '@/data/societies';
import { CEO_NAME, CEO_PHONE, HQ, waLink } from '@/lib/constants';
import type { NavId } from './HudShell';

const HEADER_OFFSET = 90;

function scrollToId(id: NavId) {
  const element = document.getElementById(id);
  if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, behavior: 'smooth' });
}

export default function Overview({ materialCount, onOpenAI }: { materialCount: number; onOpenAI: () => void }) {
  const stats = [
    { icon: MapPin, label: 'Housing Societies', value: `${SOCIETIES.length}+` },
    { icon: Building2, label: 'Plot Listings', value: 'Live' },
    { icon: Users, label: 'Verified Agents', value: 'Network' },
    { icon: Hammer, label: 'Material Rates', value: `${materialCount}` },
  ];
  const pods: { id: NavId; icon: typeof Building2; title: string; desc: string }[] = [
    { id: 'directory', icon: MapPin, title: 'Society Directory', desc: '38+ Lahore societies with master plans, DC rates, FBR valuations, and pricing brackets.' },
    { id: 'suite', icon: Calculator, title: 'Utility Suite', desc: 'AI Studio, DC/FBR Tax Engine, Cost Estimator, Escrow Tracker, and property forms.' },
    { id: 'services', icon: Briefcase, title: 'Agent Portal', desc: 'Register as an authorized associate partner and submit verified plots.' },
    { id: 'admin', icon: ShieldCheck, title: 'Admin / CRM', desc: 'CEO command center with leads, materials, and inventory.' },
  ];

  return <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass relative overflow-hidden rounded-2xl p-6 sm:p-10">
      <div className="relative z-10 max-w-2xl">
        <span className="chip mb-3">BUNYAD.PK · PropTech Mega-Platform</span>
        <h2 className="font-display text-3xl font-black leading-tight sm:text-5xl">Solid <span className="neon-text">Foundations</span>.<br /> Smart Cities. <span className="neon-text">Civil Construction 2.0</span>.</h2>
        <p className="mt-3 text-sm text-platinum/70 sm:text-base">Pakistan&apos;s ultra-luxurious PropTech &amp; civil construction command center — powered by Bin Taha Associates &amp; Builders. Led by CEO {CEO_NAME} (طہٰ مبین بھٹہ).</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => scrollToId('directory')} className="btn-cyan cursor-pointer"><MapPin className="h-4 w-4" /> Explore Societies</button>
          <button type="button" onClick={onOpenAI} className="btn-ghost cursor-pointer"><Bot className="h-4 w-4" /> AI Consultant</button>
          <a href="https://wa.me/923219404812" target="_blank" rel="noopener noreferrer" className="btn-ghost cursor-pointer"><Building2 className="h-4 w-4" /> {CEO_PHONE}</a>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 sm:block"><motion.div className="relative h-48 w-32" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}><div className="absolute inset-0 bg-gradient-to-b from-cyan/60 via-cobalt to-obsidian-2 neon-border" style={{ clipPath: 'polygon(15% 100%, 50% 0, 85% 100%)' }} /><div className="absolute -inset-4 bg-cyan/10 blur-3xl" /></motion.div></div>
    </motion.div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{stats.map((stat, index) => <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="glass rounded-xl p-4"><stat.icon className="h-5 w-5 text-cyan" /><p className="mt-2 font-display text-xl font-bold text-platinum">{stat.value}</p><p className="font-mono text-[10px] uppercase tracking-wider text-cyan/50">{stat.label}</p></motion.div>)}</div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{pods.map((pod, index) => <motion.button type="button" key={pod.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.08 }} onClick={() => scrollToId(pod.id)} className="glass group cursor-pointer rounded-xl p-5 text-left transition hover:neon-border"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/10 text-cyan"><pod.icon className="h-5 w-5" /></div><h3 className="font-display text-base font-bold text-platinum group-hover:neon-text">{pod.title}</h3></div><p className="mt-2 text-xs text-platinum/60">{pod.desc}</p></motion.button>)}</div>
    <div className="glass rounded-xl p-4 text-center"><p className="font-mono text-xs text-cyan/60">Headquarters: {HQ} · CEO {CEO_NAME} · {CEO_PHONE}</p></div>
  </div>;
}
