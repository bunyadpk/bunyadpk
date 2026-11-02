import { useState } from 'react';
import { motion } from '@/lib/motion';
import { Loader2, CheckCircle2, Phone } from 'lucide-react';
import { supabase, isSupabaseConfigured, type Lead } from '@/lib/supabase';
import { SOCIETIES } from '@/data/societies';
import { CEO_PHONE } from '@/lib/constants';

export default function LeadForm() {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', society_interest: '', budget: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  async function submit() {
    if (!form.full_name || !form.phone) return;
    setStatus('loading');
    if (isSupabaseConfigured && supabase) {
      await supabase.from('leads').insert({ ...form, whatsapp: form.phone, status: 'New' } as Partial<Lead>);
    }
    setStatus('done');
    setForm({ full_name: '', phone: '', email: '', society_interest: '', budget: '', message: '' });
    setTimeout(() => setStatus('idle'), 4000);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
      <h3 className="font-display text-sm font-bold text-cyan">Submit a Lead / Inquiry</h3>
      <p className="mt-1 text-xs text-platinum/60">All inquiries go directly to CEO Taha Mubeen Bhutta's CRM desk.</p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input placeholder="Full Name *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
        <input placeholder="Phone / WhatsApp *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
        <select value={form.society_interest} onChange={(e) => setForm({ ...form, society_interest: e.target.value })}
          className="rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum focus:border-cyan focus:outline-none">
          <option value="">Select Society</option>
          {SOCIETIES.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
        <input placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
          className="rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" />
      </div>
      <textarea placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="mt-2 w-full rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" rows={2} />
      <button onClick={submit} disabled={status === 'loading'} className="btn-cyan mt-3 w-full">
        {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === 'done' && <CheckCircle2 className="h-4 w-4" />}
        {status === 'idle' && 'Submit Inquiry'}
        {status === 'loading' && 'Submitting...'}
        {status === 'done' && 'Submitted!'}
      </button>
      <p className="mt-2 flex items-center justify-center gap-1 font-mono text-[10px] text-cyan/50">
        <Phone className="h-3 w-3" /> {CEO_PHONE}
      </p>
    </motion.div>
  );
}
