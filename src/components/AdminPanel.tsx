import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from '@/lib/motion';
import {
  Shield, Lock, MessageCircle, Trash2, Plus, RefreshCw, Building2,
  CircleDot, Clock, CheckCircle2, Package, Download, Filter, X, Users, TrendingUp, MapPin, Search, LogOut,
} from 'lucide-react';
import {
  supabase, isSupabaseConfigured, type Lead, type Property, type MaterialRates,
} from '@/lib/supabase';
import { CEO_NAME, waLink } from '@/lib/constants';
import { MOCK_AGENTS, MOCK_LEADS, MOCK_PROPERTIES } from '@/data/mockDashboard';

// CEO Master PIN (صرف آپ کے استعمال کے لیے)
const ADMIN_PIN = 'tazataza12A1';

type Panel = 'leads' | 'inventory' | 'rates';

export default function AdminPanel({
  rates, onRatesChange,
}: {
  rates: MaterialRates; onRatesChange: (r: MaterialRates) => void;
}) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6 text-center shadow-cyan-glow">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cyan/10 text-cyan">
            <Lock className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="font-display text-lg font-bold text-platinum">CEO Secure Access</h2>
          <p className="mt-1 text-xs text-platinum/60">Enter Master Key to access {CEO_NAME}'s command deck</p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (pin === ADMIN_PIN) { setAuthed(true); setErr(''); } else setErr('Incorrect PIN');
              }
            }}
            placeholder="••••"
            maxLength={4}
            className="mt-4 w-full rounded-md border border-cyan/30 bg-obsidian/80 py-2.5 text-center font-mono text-xl tracking-[0.5em] text-cyan focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
          />
          {err && <p className="mt-2 text-xs font-mono text-red-400">{err}</p>}
          <button
            type="button"
            onClick={() => { if (pin === ADMIN_PIN) { setAuthed(true); setErr(''); } else setErr('Incorrect PIN'); }}
            className="btn-cyan mt-4 w-full font-bold shadow-cyan-glow"
          >
            Authenticate Terminal
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => { setAuthed(false); setPin(''); }}
          className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-1.5 font-mono text-xs text-red-400 hover:border-red-400 hover:bg-red-900/30"
        >
          <LogOut className="h-3.5 w-3.5" /> Lock Command Terminal
        </button>
      </div>
      <AdminDashboard rates={rates} onRatesChange={onRatesChange} />
    </div>
  );
}

function AdminDashboard({ rates, onRatesChange }: { rates: MaterialRates; onRatesChange: (r: MaterialRates) => void }) {
  const [panel, setPanel] = useState<Panel>('leads');
  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan" />
            <h2 className="font-display text-base font-bold text-platinum">Executive Dashboard</h2>
          </div>
          <div className="flex gap-1 rounded-md border border-cyan/20 p-1">
            {([['leads', 'Leads'], ['inventory', 'Inventory'], ['rates', 'Rates']] as const).map(([id, label]) => (
              <button key={id} onClick={() => setPanel(id)}
                className={`rounded px-3 py-1 text-xs font-medium transition ${panel === id ? 'bg-cyan/20 text-cyan' : 'text-platinum/60 hover:text-cyan'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <DashboardSummary />
      {panel === 'leads' && <LeadsPanel />}
      {panel === 'inventory' && <InventoryPanel />}
      {panel === 'rates' && <RatesPanel rates={rates} onRatesChange={onRatesChange} />}
    </div>
  );
}

function DashboardSummary() {
  const statusCounts = MOCK_LEADS.reduce<Record<Lead['status'], number>>((counts, lead) => {
    counts[lead.status] += 1;
    return counts;
  }, { New: 0, Contacted: 0, 'In-Progress': 0, Closed: 0 });
  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);
  const metrics = [
    { label: 'Total Leads', value: MOCK_LEADS.length, detail: 'Pipeline inquiries', icon: TrendingUp, tone: 'text-cyan' },
    { label: 'Active Agents', value: MOCK_AGENTS.filter((agent) => agent.verified).length, detail: 'Verified partners', icon: Users, tone: 'text-green-400' },
    { label: 'Available Plots', value: MOCK_PROPERTIES.filter((property) => property.status === 'Available').length, detail: 'Ready for matching', icon: MapPin, tone: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-cyan/60">{metric.label}</p>
                <p className={`mt-1 font-display text-3xl font-black ${metric.tone}`}>{metric.value}</p>
              </div>
              <metric.icon className={`h-5 w-5 ${metric.tone}`} />
            </div>
            <p className="mt-2 text-[11px] text-platinum/50">{metric.detail}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-bold text-cyan">Lead Activity Overview</h3>
            <p className="mt-0.5 text-[11px] text-platinum/50">Current sample pipeline distribution</p>
          </div>
          <span className="chip">{MOCK_LEADS.length} total</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {(['New', 'Contacted', 'In-Progress', 'Closed'] as const).map((status) => (
            <div key={status}>
              <div className="flex items-end justify-between gap-1">
                <span className="truncate text-[10px] text-platinum/60">{status}</span>
                <span className="font-mono text-xs text-cyan">{statusCounts[status]}</span>
              </div>
              <div className="mt-1 h-16 rounded-md bg-obsidian/60 p-1">
                <div className="h-full rounded bg-gradient-to-t from-cyan/30 to-cyan" style={{ height: `${Math.max((statusCounts[status] / maxStatusCount) * 100, 8)}%`, marginTop: `${100 - Math.max((statusCounts[status] / maxStatusCount) * 100, 8)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  New: 'text-cyan', Contacted: 'text-yellow-400', 'In-Progress': 'text-blue-400', Closed: 'text-green-400',
};

function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | Lead['status']>('All');
  const [search, setSearch] = useState('');
  const [showNewLead, setShowNewLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) { setLeads(data as Lead[]); setLoading(false); return; }
    }
    setLeads(MOCK_LEADS);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: Lead['status']) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('leads').update({ status }).eq('id', id);
    }
  }

  async function remove(id: string) {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (isSupabaseConfigured && supabase) await supabase.from('leads').delete().eq('id', id);
  }

  const STATUS_OPTS: Lead['status'][] = ['New', 'Contacted', 'In-Progress', 'Closed'];
  const filteredLeads = useMemo(() => leads.filter((lead) => {
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const q = search.toLowerCase();
    return matchesStatus && (!q || lead.full_name.toLowerCase().includes(q) || (lead.society_interest || '').toLowerCase().includes(q));
  }), [leads, search, statusFilter]);

  function exportLeads() {
    const header = 'Name,Phone,Email,Society,Budget,Status,Created';
    const rows = filteredLeads.map((lead) => [lead.full_name, lead.phone || '', lead.email || '', lead.society_interest || '', lead.budget || '', lead.status, lead.created_at || ''].map((value) => `"${value.split('"').join('""')}"`).join(','));
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'bunyad-leads.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function createLead(lead: Omit<Lead, 'id' | 'created_at'>) {
    const localLead: Lead = { ...lead, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('leads').insert(lead).select().single();
      setLeads((prev) => [data ? data as Lead : localLead, ...prev]);
    } else {
      setLeads((prev) => [localLead, ...prev]);
    }
    setShowNewLead(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-sm font-bold text-cyan">Lead Pipeline ({filteredLeads.length})</h3>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setShowNewLead(true)} className="btn-cyan py-1 text-xs"><Plus className="h-3 w-3" /> New Lead</button>
          <button onClick={exportLeads} className="btn-ghost py-1 text-xs"><Download className="h-3 w-3" /> Export CSV</button>
          <button onClick={load} className="btn-ghost py-1 text-xs"><RefreshCw className="h-3 w-3" /> Refresh</button>
        </div>
      </div>
      <div className="glass flex flex-col gap-2 rounded-xl p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cyan/50" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or society" className="w-full rounded-md border border-cyan/20 bg-obsidian/60 py-1.5 pl-8 pr-3 text-xs text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-cyan/60" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'All' | Lead['status'])} className="rounded-md border border-cyan/20 bg-obsidian/60 px-2 py-1.5 text-xs text-platinum focus:border-cyan focus:outline-none">
            <option value="All">All statuses</option>
            {STATUS_OPTS.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </div>
      {loading ? (
        <p className="text-center text-xs text-cyan/50">Loading leads...</p>
      ) : leads.length === 0 ? (
        <div className="glass rounded-xl p-6 text-center text-sm text-platinum/50">
          No leads yet. The public inquiry form will populate this list automatically.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredLeads.map((l) => (
            <motion.div key={l.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedLead(l)} className="glass cursor-pointer rounded-lg p-3 transition hover:border-cyan/40">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-platinum">{l.full_name}</p>
                  <p className="font-mono text-[11px] text-cyan/60">{l.phone || l.email || '—'}</p>
                  {l.society_interest && <p className="text-[11px] text-platinum/50">Interest: {l.society_interest}</p>}
                  {l.budget && <p className="text-[11px] text-platinum/50">Budget: {l.budget}</p>}
                  {l.message && <p className="mt-1 text-xs text-platinum/70">{l.message}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                  {l.phone && (
                    <a href={waLink(`Asalam o Alaikum ${l.full_name}, regarding your inquiry on Bunyad.pk`, l.phone)}
                      target="_blank" rel="noopener noreferrer" className="rounded p-1.5 text-green-400 hover:bg-green-400/10" title="WhatsApp">
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); remove(l.id); }} className="rounded p-1.5 text-red-400 hover:bg-red-400/10" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
                {STATUS_OPTS.map((s) => (
                  <button key={s} onClick={() => updateStatus(l.id, s)}
                    className={`rounded px-2 py-0.5 text-[10px] font-mono uppercase transition ${
                      l.status === s ? `bg-cyan/20 ${STATUS_STYLES[s]}` : 'text-platinum/40 hover:text-cyan'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {showNewLead && <NewLeadModal onClose={() => setShowNewLead(false)} onCreate={createLead} />}
      {selectedLead && <LeadDetailDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} onStatusChange={(status) => { void updateStatus(selectedLead.id, status); setSelectedLead({ ...selectedLead, status }); }} />}
    </div>
  );
}

function LeadDetailDrawer({ lead, onClose, onStatusChange }: { lead: Lead; onClose: () => void; onStatusChange: (status: Lead['status']) => void }) {
  const statuses: Lead['status'][] = ['New', 'Contacted', 'In-Progress', 'Closed'];
  return (
    <div className="fixed inset-0 z-[110] bg-obsidian/70 backdrop-blur-sm" onClick={onClose}>
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-cyan/25 bg-[#07111d] p-5 shadow-2xl shadow-cyan/10" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-cyan/15 pb-4">
          <div><p className="font-mono text-[10px] uppercase tracking-wider text-cyan/60">Lead detail</p><h3 className="mt-1 font-display text-xl font-bold text-platinum">{lead.full_name}</h3></div>
          <button onClick={onClose} className="rounded p-1 text-cyan/60 hover:bg-cyan/10 hover:text-cyan" aria-label="Close lead details"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 space-y-3">
          {[['Phone', lead.phone || 'Not provided'], ['Email', lead.email || 'Not provided'], ['Society', lead.society_interest || 'Not selected'], ['Budget', lead.budget || 'Not provided'], ['Received', lead.created_at ? new Date(lead.created_at).toLocaleString() : 'Recently']].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan/15 bg-obsidian/40 p-3"><p className="font-mono text-[10px] uppercase text-cyan/60">{label}</p><p className="mt-1 text-sm text-platinum">{value}</p></div>
          ))}
          <div className="rounded-lg border border-cyan/15 bg-obsidian/40 p-3"><p className="font-mono text-[10px] uppercase text-cyan/60">Message</p><p className="mt-1 text-sm leading-6 text-platinum/80">{lead.message || 'No message was added.'}</p></div>
        </div>
        <div className="mt-5"><p className="font-mono text-[10px] uppercase text-cyan/60">Update status</p><div className="mt-2 grid grid-cols-2 gap-2">{statuses.map((status) => <button key={status} onClick={() => onStatusChange(status)} className={`rounded-md border px-3 py-2 text-xs transition ${lead.status === status ? 'border-cyan bg-cyan/15 text-cyan' : 'border-cyan/15 text-platinum/60 hover:border-cyan/40 hover:text-cyan'}`}>{status}</button>)}</div></div>
        {lead.phone && <a href={waLink(`Asalam o Alaikum ${lead.full_name}, regarding your Bunyad inquiry`, lead.phone)} target="_blank" rel="noopener noreferrer" className="btn-cyan mt-5 w-full"><MessageCircle className="h-4 w-4" /> Contact on WhatsApp</a>}
      </aside>
    </div>
  );
}

function NewLeadModal({ onClose, onCreate }: { onClose: () => void; onCreate: (lead: Omit<Lead, 'id' | 'created_at'>) => Promise<void> }) {
  const [form, setForm] = useState<Omit<Lead, 'id' | 'created_at'>>({ full_name: '', phone: '', email: '', society_interest: '', budget: '', message: '', status: 'New' });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = () => { if (form.full_name && form.phone) void onCreate(form); };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong w-full max-w-lg rounded-2xl p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div><h3 className="font-display text-base font-bold text-cyan">Create New Lead</h3><p className="mt-1 text-xs text-platinum/50">Add an inquiry directly to the pipeline.</p></div>
          <button onClick={onClose} className="rounded p-1 text-cyan/60 hover:bg-cyan/10 hover:text-cyan" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input placeholder="Full name *" value={form.full_name} onChange={(event) => update('full_name', event.target.value)} className="rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
          <input placeholder="Phone *" value={form.phone || ''} onChange={(event) => update('phone', event.target.value)} className="rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
          <input placeholder="Email" value={form.email || ''} onChange={(event) => update('email', event.target.value)} className="rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
          <input placeholder="Society interest" value={form.society_interest || ''} onChange={(event) => update('society_interest', event.target.value)} className="rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
          <input placeholder="Budget" value={form.budget || ''} onChange={(event) => update('budget', event.target.value)} className="rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
          <select value={form.status} onChange={(event) => update('status', event.target.value)} className="rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum focus:border-cyan focus:outline-none"><option>New</option><option>Contacted</option><option>In-Progress</option><option>Closed</option></select>
        </div>
        <textarea placeholder="Message" value={form.message || ''} onChange={(event) => update('message', event.target.value)} rows={3} className="mt-2 w-full rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
        <div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="btn-ghost">Cancel</button><button onClick={submit} className="btn-cyan"><Plus className="h-4 w-4" /> Create Lead</button></div>
      </div>
    </div>
  );
}

function InventoryPanel() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', society_name: '', plot_size: '', block: '', price: '' });
  const [reservationProperty, setReservationProperty] = useState<Property | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
      setItems(data && data.length > 0 ? data as Property[] : MOCK_PROPERTIES);
    } else {
      setItems(MOCK_PROPERTIES);
    }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function add() {
    if (!form.title || !form.society_name) return;
    const row: Omit<Property, 'id' | 'created_at'> = {
      title: form.title, society_name: form.society_name, plot_size: form.plot_size, block: form.block,
      plot_number: '', price: form.price, status: 'Available', verified_by_bintaha: true,
    };
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('properties').insert(row).select().single();
      if (data) setItems((prev) => [data as Property, ...prev]);
    } else {
      setItems((prev) => [{ ...row, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Property, ...prev]);
    }
    setForm({ title: '', society_name: '', plot_size: '', block: '', price: '' });
  }

  async function reserve(property: Property, reservation: { full_name: string; phone: string; message: string }) {
    const lead: Omit<Lead, 'id' | 'created_at'> = {
      full_name: reservation.full_name,
      phone: reservation.phone,
      email: '',
      society_interest: property.society_name,
      budget: property.price || '',
      message: `Reservation request for ${property.title} (${property.plot_size || 'plot'}${property.block ? `, Block ${property.block}` : ''}). ${reservation.message}`,
      status: 'New',
    };
    if (isSupabaseConfigured && supabase) await supabase.from('leads').insert(lead);
    setItems((prev) => prev.map((item) => item.id === property.id ? { ...item, status: 'Reserved' } : item));
    if (isSupabaseConfigured && supabase) await supabase.from('properties').update({ status: 'Reserved' }).eq('id', property.id);
    setReservationProperty(null);
  }

  async function cycle(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next: Property['status'] = item.status === 'Available' ? 'Reserved' : item.status === 'Reserved' ? 'Sold' : 'Available';
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: next } : i));
    if (isSupabaseConfigured && supabase) await supabase.from('properties').update({ status: next }).eq('id', id);
  }

  const STATUS_ICON: Record<string, typeof CircleDot> = {
    Available: CircleDot, Reserved: Clock, Sold: CheckCircle2,
  };

  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm font-bold text-cyan">Plot Inventory</h3>
      <div className="glass rounded-lg p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded border border-cyan/20 bg-obsidian/60 px-2 py-1.5 text-xs text-platinum focus:border-cyan focus:outline-none" />
          <input placeholder="Society" value={form.society_name} onChange={(e) => setForm({ ...form, society_name: e.target.value })} className="rounded border border-cyan/20 bg-obsidian/60 px-2 py-1.5 text-xs text-platinum focus:border-cyan focus:outline-none" />
          <input placeholder="Plot Size" value={form.plot_size} onChange={(e) => setForm({ ...form, plot_size: e.target.value })} className="rounded border border-cyan/20 bg-obsidian/60 px-2 py-1.5 text-xs text-platinum focus:border-cyan focus:outline-none" />
          <input placeholder="Block" value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })} className="rounded border border-cyan/20 bg-obsidian/60 px-2 py-1.5 text-xs text-platinum focus:border-cyan focus:outline-none" />
          <div className="flex gap-1">
            <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="flex-1 rounded border border-cyan/20 bg-obsidian/60 px-2 py-1.5 text-xs text-platinum focus:border-cyan focus:outline-none" />
            <button onClick={add} className="rounded bg-cyan/90 px-2.5 text-obsidian hover:bg-cyan"><Plus className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
      {loading ? (
        <p className="text-center text-xs text-cyan/50">Loading inventory...</p>
      ) : items.length === 0 ? (
        <div className="glass rounded-xl p-6 text-center text-sm text-platinum/50">
          <Package className="mx-auto mb-2 h-6 w-6 text-cyan/40" />
          No plots listed yet. Add one above.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((p) => {
            const Icon = STATUS_ICON[p.status] || CircleDot;
            return (
              <div key={p.id} className="glass rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-platinum">{p.title}</p>
                    <p className="font-mono text-[11px] text-cyan/60">{p.society_name} · {p.plot_size || '—'} {p.block ? `· Block ${p.block}` : ''} · {p.price || '—'}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {p.status === 'Available' && <button onClick={() => setReservationProperty(p)} className="rounded border border-cyan/30 px-2 py-1 text-[10px] font-medium text-cyan transition hover:bg-cyan/10">Reserve</button>}
                    <button onClick={() => cycle(p.id)} className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition ${
                    p.status === 'Available' ? 'bg-cyan/20 text-cyan' : p.status === 'Reserved' ? 'bg-yellow-400/15 text-yellow-400' : 'bg-green-400/15 text-green-400'
                  }`}>
                      <Icon className="h-3.5 w-3.5" /> {p.status}
                    </button>
                  </div>
                </div>
                {p.verified_by_bintaha && <span className="chip mt-1.5"><Building2 className="h-3 w-3" /> Verified</span>}
              </div>
            );
          })}
        </div>
      )}
      {reservationProperty && <ReservationModal property={reservationProperty} onClose={() => setReservationProperty(null)} onReserve={reserve} />}
    </div>
  );
}

function ReservationModal({ property, onClose, onReserve }: { property: Property; onClose: () => void; onReserve: (property: Property, reservation: { full_name: string; phone: string; message: string }) => Promise<void> }) {
  const [form, setForm] = useState({ full_name: '', phone: '', message: '' });
  const submit = () => { if (form.full_name && form.phone) void onReserve(property, form); };
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong w-full max-w-md rounded-2xl p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase text-cyan/60">Plot reservation</p><h3 className="mt-1 font-display text-lg font-bold text-platinum">{property.title}</h3><p className="mt-1 text-xs text-platinum/60">{property.society_name} · {property.plot_size} · {property.price}</p></div><button onClick={onClose} className="rounded p-1 text-cyan/60 hover:bg-cyan/10 hover:text-cyan" aria-label="Close reservation"><X className="h-5 w-5" /></button></div>
        <div className="mt-4 space-y-2"><input placeholder="Full name *" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} className="w-full rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" /><input placeholder="Phone / WhatsApp *" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="w-full rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" /><textarea placeholder="Notes or preferred callback time" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows={3} className="w-full rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" /></div>
        <div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="btn-ghost">Cancel</button><button onClick={submit} className="btn-cyan"><CheckCircle2 className="h-4 w-4" /> Submit Reservation</button></div>
      </div>
    </div>
  );
}

function RatesPanel({ rates, onRatesChange }: { rates: MaterialRates; onRatesChange: (r: MaterialRates) => void }) {
  const [form, setForm] = useState(rates);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    const payload = { ...form, updated_at: new Date().toISOString(), id: 1 };
    onRatesChange(form);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('material_rates').upsert(payload);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields: { key: keyof MaterialRates; label: string }[] = [
    { key: 'cement_bag', label: 'Cement (PKR / Bag)' },
    { key: 'steel_kg', label: 'Steel (PKR / Kg)' },
    { key: 'bricks_pc', label: 'Bricks (PKR / Pc)' },
    { key: 'crush_cft', label: 'Crush (PKR / CFT)' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm font-bold text-cyan">Material Rate Editor</h3>
      <div className="glass rounded-xl p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.key} className="block">
              <span className="font-mono text-[10px] uppercase text-cyan/60">{f.label}</span>
              <input type="number" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) })}
                className="mt-1 w-full rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum focus:border-cyan focus:outline-none" />
            </label>
          ))}
        </div>
        <button onClick={save} disabled={saving} className="btn-cyan mt-4">
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Update Rates'} {!saving && !saved && <RefreshCw className="h-4 w-4" />}
          {saved && <CheckCircle2 className="h-4 w-4" />}
        </button>
        {!isSupabaseConfigured && (
          <p className="mt-2 font-mono text-[10px] text-yellow-400/70">Local mode — rates persist in this session only.</p>
        )}
      </div>
    </div>
  );
}
