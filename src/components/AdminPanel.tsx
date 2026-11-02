import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import {
  Shield, Lock, Phone, MessageCircle, Trash2, Plus, RefreshCw, Building2,
  CircleDot, Clock, CheckCircle2, XCircle, Package,
} from 'lucide-react';
import {
  supabase, isSupabaseConfigured, type Lead, type Property, type MaterialRates, DEFAULT_RATES,
} from '@/lib/supabase';
import { CEO_NAME, CEO_PHONE, waLink } from '@/lib/constants';

const ADMIN_PIN = '0321';

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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cyan/10 text-cyan">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="font-display text-lg font-bold text-platinum">CEO Secure Access</h2>
          <p className="mt-1 text-xs text-platinum/60">Enter PIN to access {CEO_NAME}'s command center</p>
          <input
            type="password" value={pin} onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (pin === ADMIN_PIN) { setAuthed(true); setErr(''); } else setErr('Incorrect PIN');
              }
            }}
            placeholder="••••" maxLength={4}
            className="mt-4 w-full rounded-md border border-cyan/20 bg-obsidian/60 py-2 text-center font-mono text-lg tracking-[0.5em] text-cyan focus:border-cyan focus:outline-none"
          />
          {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
          <button
            onClick={() => { if (pin === ADMIN_PIN) { setAuthed(true); setErr(''); } else setErr('Incorrect PIN'); }}
            className="btn-cyan mt-4 w-full"
          >Unlock</button>
          <p className="mt-3 font-mono text-[10px] text-cyan/40">Demo PIN: 0321 · Production: CEO-managed</p>
        </motion.div>
      </div>
    );
  }

  return <AdminDashboard rates={rates} onRatesChange={onRatesChange} />;
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
      {panel === 'leads' && <LeadsPanel />}
      {panel === 'inventory' && <InventoryPanel />}
      {panel === 'rates' && <RatesPanel rates={rates} onRatesChange={onRatesChange} />}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  New: 'text-cyan', Contacted: 'text-yellow-400', 'In-Progress': 'text-blue-400', Closed: 'text-green-400',
};

function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (!error && data) { setLeads(data as Lead[]); setLoading(false); return; }
    }
    setLeads([]);
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-cyan">Lead Pipeline</h3>
        <button onClick={load} className="btn-ghost py-1 text-xs"><RefreshCw className="h-3 w-3" /> Refresh</button>
      </div>
      {loading ? (
        <p className="text-center text-xs text-cyan/50">Loading leads...</p>
      ) : leads.length === 0 ? (
        <div className="glass rounded-xl p-6 text-center text-sm text-platinum/50">
          No leads yet. The public inquiry form will populate this list automatically.
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map((l) => (
            <motion.div key={l.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="glass rounded-lg p-3">
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
                  <button onClick={() => remove(l.id)} className="rounded p-1.5 text-red-400 hover:bg-red-400/10" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
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
    </div>
  );
}

function InventoryPanel() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', society_name: '', plot_size: '', block: '', price: '' });

  const load = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
      if (data) setItems(data as Property[]);
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
      {/* add form */}
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
                  <button onClick={() => cycle(p.id)} className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition ${
                    p.status === 'Available' ? 'bg-cyan/20 text-cyan' : p.status === 'Reserved' ? 'bg-yellow-400/15 text-yellow-400' : 'bg-green-400/15 text-green-400'
                  }`}>
                    <Icon className="h-3.5 w-3.5" /> {p.status}
                  </button>
                </div>
                {p.verified_by_bintaha && <span className="chip mt-1.5"><Building2 className="h-3 w-3" /> Verified</span>}
              </div>
            );
          })}
        </div>
      )}
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
