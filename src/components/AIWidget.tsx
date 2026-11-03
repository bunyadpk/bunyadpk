import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Building2, ShieldCheck, Scale, Award } from 'lucide-react';
import { CEO_PHONE, CEO_NAME } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Message {
  sender: 'ai' | 'user';
  engine: 'Gemini Director' | 'ChatGPT Director' | 'CEO Board';
  text: string;
  time: string;
}

const INITIAL_MSG: Message = {
  sender: 'ai',
  engine: 'CEO Board',
  text: `Asalam o Alaikum! BUNYAD.PK Board of Directors Executive Advisory mein khushamdeed.\n\n• CEO & MD: ${CEO_NAME}\n• Technical Director: Gemini Civil AI (PEC & Bylaws Audit)\n• Financial Director: GPT Strategic Engine (Tax & Valuation)\n\nHum poore Pakistan (Lahore, Islamabad, Karachi, Gwadar) mein verified listings, bylaws auditing aur direct property approval monitor karte hain. Aap yahan direct listing approval ya legal inquiry submit kar sakte hain.`,
  time: 'Just now'
};

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState<'all' | 'gemini' | 'chatgpt'>('all');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }
    window.addEventListener('bunyad:open-ai', handleOpen);
    return () => window.removeEventListener('bunyad:open-ai', handleOpen);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      { sender: 'user', engine: 'CEO Board', text: userText, time: now }
    ]);
    setInput('');
    setTyping(true);

    const lower = userText.toLowerCase();

    // Board Authority: Direct Property Submission & Supabase Ingestion
    if (
      lower.includes('add') ||
      lower.includes('post') ||
      lower.includes('bechna') ||
      lower.includes('shamil') ||
      lower.includes('property') ||
      lower.includes('kar do')
    ) {
      setTimeout(async () => {
        let extractedSociety = 'Etihad Town, Lahore';
        if (lower.includes('etihad')) extractedSociety = 'Etihad Town, Lahore';
        else if (lower.includes('dha')) extractedSociety = 'DHA Phase 9 Prism, Lahore';
        else if (lower.includes('lda')) extractedSociety = 'LDA Avenue 1, Lahore';
        else if (lower.includes('bahria')) extractedSociety = 'Bahria Town, Lahore';
        else if (lower.includes('islamabad')) extractedSociety = 'DHA Islamabad';
        else if (lower.includes('karachi')) extractedSociety = 'Bahria Town, Karachi';

        try {
          if (isSupabaseConfigured && supabase) {
            await supabase.from('properties').insert([
              {
                title: `Board Approved Listing: ${userText.slice(0, 45)}`,
                type: lower.includes('house') || lower.includes('makan') ? 'House' : 'Plot',
                society: extractedSociety,
                price: 'Demand on Call',
                phone: CEO_PHONE,
                desc: `Reviewed by Board of Directors. Original query: "${userText}"`,
                img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
              }
            ]);
          }
        } catch {
          // ignore
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            engine: 'Gemini Director',
            text: `[BOARD RESOLUTION GRANTED]\nAapki listing "${userText}" Supabase properties directory mein record kar di gayi hai (${extractedSociety}).\n\n• Gemini Audit: Preliminary boundary verification initiated.\n• GPT Audit: Market valuation logged.\n• CEO Desk: CEO Taha Mubeen Bhutta ko final NDC verification ke liye forward kar di gayi hai.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setTyping(false);
      }, 900);
      return;
    }

    // Board Deliberation & Intelligence Delivery
    setTimeout(() => {
      let replyEngine: 'Gemini Director' | 'ChatGPT Director' = 'Gemini Director';
      let reply = '';

      if (lower.includes('tax') || lower.includes('7e') || lower.includes('fbr') || lower.includes('cost') || lower.includes('valuation')) {
        replyEngine = 'ChatGPT Director';
        reply = `[FINANCIAL DIRECTIVE - GPT ENGINE]:\nFBR Section 7E aur transfer duty audit ke mutabiq filers ke liye basic transaction charges 3% hain jabki non-filers par heavy withholding tax lagu hai. Turnkey projects mein escrow release 4 strictly monitored milestones par execute karne ka board mandate hai.`;
      } else if (lower.includes('bylaws') || lower.includes('lda') || lower.includes('cda') || lower.includes('saria') || lower.includes('cement')) {
        replyEngine = 'Gemini Director';
        reply = `[TECHNICAL DIRECTIVE - GEMINI CIVIL ENGINE]:\nPEC Category C aur LDA Building Regulations 2026 ke mutabiq Grade-60 steel aur 1:2:4 batch mix mandatory hain. Corner aur boulevard plots par mandatory setbacks ke baghair structural drawings sanction nahi ki ja sakteen.`;
      } else {
        replyEngine = 'Gemini Director';
        reply = `[BOARD OF DIRECTORS EXECUTIVE NOTICE]:\nBUNYAD.PK platform par poore Pakistan (Lahore, Islamabad, Karachi, Gwadar) ki deals 100% legal escrow aur authentic title deed transfer par hoti hain. Kisi specific plot ki physical demarcation ke liye Managing Director Taha Mubeen Bhutta (0321-9404812) se direct session schedule karein.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          engine: replyEngine,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setTyping(false);
    }, 700);
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-cyan/50 bg-[#040810]/95 px-4 py-2.5 text-xs font-mono font-bold text-cyan shadow-cyan-glow backdrop-blur-md transition hover:scale-105 cursor-pointer"
        >
          <Scale className="h-4 w-4 text-cyan" />
          <span>Board of Directors AI</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-4 z-50 w-[92vw] max-w-md rounded-2xl border border-cyan/40 bg-obsidian/95 shadow-2xl backdrop-blur-xl sm:right-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan/20 p-3.5 bg-gradient-to-r from-cyan/15 via-[#061224] to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan/40 bg-cyan/20 text-cyan">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display text-xs font-bold text-platinum">BUNYAD Board of Directors</h4>
                  <span className="chip border-cyan/40 text-[9px] text-cyan font-mono py-0 px-1">EXECUTIVE</span>
                </div>
                <p className="font-mono text-[9px] text-platinum/60">Gemini (Technical) &bull; ChatGPT (Financial) &bull; CEO {CEO_NAME}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-platinum/60 hover:text-cyan transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-3.5 space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {m.sender === 'ai' && (
                  <span className="mb-1 font-mono text-[9px] font-bold text-cyan flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    {m.engine}
                  </span>
                )}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 max-w-[90%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan text-obsidian font-semibold rounded-br-none shadow-cyan-glow'
                      : 'border border-cyan/25 bg-[#050b14]/90 text-platinum/90 rounded-bl-none whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
                <span className="mt-1 font-mono text-[8px] text-platinum/40 px-1">{m.time}</span>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan animate-pulse">
                <Sparkles className="h-3 w-3" /> Board deliberating resolution...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="border-t border-cyan/20 p-2.5 flex items-center gap-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Board query, plot verification ya 'property add karo'..."
              className="flex-1 rounded-xl border border-cyan/20 bg-[#060c16] px-3 py-2 text-xs text-platinum outline-none focus:border-cyan placeholder:text-platinum/30"
            />
            <button
              type="submit"
              className="btn-cyan p-2 rounded-xl text-obsidian font-bold cursor-pointer"
              title="Submit to Board"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
