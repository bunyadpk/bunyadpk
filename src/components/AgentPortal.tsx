import { useCallback, useEffect, useState } from 'react';
import { motion } from '@/lib/motion';
import { Briefcase, BadgeCheck, RefreshCw, Phone, User, Building2, IdCard, Percent } from 'lucide-react';
import { supabase, isSupabaseConfigured, type Agent } from '@/lib/supabase';

export default function AgentPortal() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ agent_name: '', agency_name: '', cnic: '', phone: '', commission_split: '' });
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('agents').select('*').order('created_at', { ascending: false });
      if (data) setAgents(data as Agent[]);
    }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function register() {
    if (!form.agent_name || !form.phone) return;
    const row: Omit<Agent, 'id' | 'created_at' | 'verified'> = { ...form, verified: false };
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('agents').insert({ ...row, verified: false }).select().single();
      if (data) setAgents((prev) => [data as Agent, ...prev]);
    } else {
      setAgents((prev) => [{ ...row, verified: false, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Agent, ...prev]);
    }
    setForm({ agent_name: '', agency_name: '', cnic: '', phone: '', commission_split: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-cyan" />
          <h2 className="font-display text-base font-bold text-platinum">Authorized Associate Partner Portal</h2>
        </div>
        <p className="mt-1 text-xs text-platinum/60">
          Register with Bin Taha Associates &amp; Builders. Verified agents earn commission splits and can submit plots directly.
        </p>
      </div>

      <div className="glass rounded-xl p-4">
        <h3 className="font-display text-sm font-bold text-cyan">Agent Registration</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field icon={User} label="Agent Name" value={form.agent_name} onChange={(v) => setForm({ ...form, agent_name: v })} placeholder="Your full name" />
          <Field icon={Building2} label="Agency Name" value={form.agency_name} onChange={(v) => setForm({ ...form, agency_name: v })} placeholder="Agency / Company" />
          <Field icon={IdCard} label="CNIC" value={form.cnic} onChange={(v) => setForm({ ...form, cnic: v })} placeholder="00000-0000000-0" />
          <Field icon={Phone} label="Phone / WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="03xx-xxxxxxx" />
          <Field icon={Percent} label="Commission Split (%)" value={form.commission_split} onChange={(v) => setForm({ ...form, commission_split: v })} placeholder="e.g. 50/50" />
          <div className="flex items-end">
            <button onClick={register} className="btn-cyan w-full">
              {submitted ? 'Registered!' : 'Register as Agent'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-cyan">Registered Agents ({agents.length})</h3>
          <button onClick={load} className="btn-ghost py-1 text-xs"><RefreshCw className="h-3 w-3" /> Refresh</button>
        </div>
        {loading ? (
          <p className="text-center text-xs text-cyan/50">Loading agents...</p>
        ) : agents.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center text-sm text-platinum/50">
            No agents registered yet. Be the first.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {agents.map((a) => (
              <motion.div key={a.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-platinum">{a.agent_name}</p>
                    <p className="font-mono text-[11px] text-cyan/60">{a.phone}</p>
                    {a.agency_name && <p className="text-[11px] text-platinum/50">{a.agency_name}</p>}
                    {a.commission_split && <p className="text-[11px] text-platinum/50">Split: {a.commission_split}</p>}
                  </div>
                  {a.verified ? (
                    <span className="chip"><BadgeCheck className="h-3 w-3 text-green-400" /> Verified</span>
                  ) : (
                    <span className="chip border-yellow-400/30 text-yellow-400/80">Pending</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder }: {
  icon: typeof User; label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase text-cyan/60">{label}</span>
      <div className="relative mt-1">
        <Icon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cyan/40" />
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full rounded-md border border-cyan/20 bg-obsidian/60 py-2 pl-8 pr-3 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
      </div>
    </label>
  );
}
