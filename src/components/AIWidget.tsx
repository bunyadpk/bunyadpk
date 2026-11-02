import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { askBunyadAI } from '@/lib/gemini';

type Msg = { role: 'user' | 'ai'; text: string };

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'ai', text: "Asalam o Alaikum! I'm the Bunyad AI Consultant. Ask me about Lahore societies, LDA bylaws, construction costs, or escrow milestones." }]);

  useEffect(() => {
    const openAssistant = () => setOpen(true);
    window.addEventListener('bunyad:open-ai', openAssistant);
    return () => window.removeEventListener('bunyad:open-ai', openAssistant);
  }, []);

  async function send() {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setMsgs((previous) => [...previous, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    const answer = await askBunyadAI(question);
    setMsgs((previous) => [...previous, { role: 'ai', text: answer }]);
    setLoading(false);
  }

  return <>
    <motion.button type="button" onClick={() => setOpen((value) => !value)} className="fixed bottom-5 right-5 z-[150] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-cyan/90 text-obsidian shadow-cyan-glow hover:scale-110" whileHover={{ scale: 1.1 }} aria-label="AI Consultant">{open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}</motion.button>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.9 }} className="glass-strong fixed bottom-24 right-5 z-[150] flex h-[440px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-cyan/30">
      <div className="flex items-center gap-2 border-b border-cyan/20 bg-cyan/5 px-4 py-3"><Bot className="h-5 w-5 text-cyan" /><div><p className="font-display text-sm font-bold text-platinum">Bunyad AI Consultant</p><p className="font-mono text-[9px] text-cyan/50">CEO Supervised</p></div></div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">{msgs.map((message, index) => <div key={index} className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${message.role === 'user' ? 'ml-auto bg-cyan/20 text-cyan' : 'bg-obsidian/60 text-platinum/90'}`}><pre className="whitespace-pre-wrap font-sans">{message.text}</pre></div>)}{loading && <div className="flex items-center gap-2 text-xs text-cyan/60"><Loader2 className="h-3 w-3 animate-spin" /> Consulting...</div>}</div>
      <div className="border-t border-cyan/20 p-3"><div className="flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void send(); }} placeholder="Ask about societies, costs, bylaws..." className="flex-1 rounded-md border border-cyan/20 bg-obsidian/60 px-3 py-2 text-sm text-platinum placeholder:text-cyan/30 focus:border-cyan focus:outline-none" /><button type="button" onClick={() => void send()} disabled={loading} className="cursor-pointer rounded-md bg-cyan/90 px-3 text-obsidian hover:bg-cyan disabled:opacity-50"><Send className="h-4 w-4" /></button></div></div>
    </motion.div>}</AnimatePresence>
  </>;
}
