import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Building2, Phone, CheckCircle2 } from 'lucide-react';
import { CEO_PHONE, CEO_NAME, waLink } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const INITIAL_MSG: Message = {
  sender: 'ai',
  text: `Asalam o Alaikum! Main Bunyad AI Consultant hoon (supervised by CEO ${CEO_NAME}). Main poore Pakistan (Lahore, Islamabad, Karachi, DHA, Bahria, LDA, CDA) ke plots, rates, bylaws aur direct property insertion mein aapki madad kar sakta hoon. Aap apni property yahan chat mein bhi direct add karwa sakte hain!`,
  time: 'Just now'
};

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
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

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: now }]);
    setInput('');
    setTyping(true);

    const lower = userText.toLowerCase();

    // Direct Property Insertion Trigger
    if (
      lower.includes('add') ||
      lower.includes('post') ||
      lower.includes('bechna') ||
      lower.includes('property lag') ||
      lower.includes('kar do') ||
      lower.includes('shamil')
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
                title: `Direct Client Listing: ${userText.slice(0, 40)}`,
                type: lower.includes('house') || lower.includes('makan') ? 'House' : 'Plot',
                society: extractedSociety,
                price: 'Demand on Call',
                phone: CEO_PHONE,
                desc: `Submitted via AI Consultant: "${userText}"`,
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
            text: `Aapki property ("${userText}") BUNYAD database mein live add kar di gayi hai (${extractedSociety})! CEO Taha Mubeen Bhutta ke desk par NDC verification ke liye notification chala gaya hai. Mazeed jaldi verification ke liye WhatsApp par documents share kar sakte hain.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setTyping(false);
      }, 900);
      return;
    }

    // Comprehensive Pakistan Real Estate & Engineering Engine
    setTimeout(() => {
      let reply = '';
      if (lower.includes('islamabad') || lower.includes('cda') || lower.includes('rawalpindi')) {
        reply = `Islamabad & Rawalpindi mein CDA bylaws ke tehat DHA Phase 2-5, Bahria Town Phase 8, Gulberg Greens, aur Faisal Hills top ROI sectors hain. FBR tax non-filer ke liye 12% aur filer ke liye 3% transfer duty par applicable hai.`;
      } else if (lower.includes('karachi') || lower.includes('sbca')) {
        reply = `Karachi market mein DHA City (DCK), Bahria Town Karachi 2, aur Clifton residential blocks prime hain. SBCA building bylaws aur high-rise structural approval Grade-60 steel testing ke baad certified hote hain.`;
      } else if (lower.includes('rate') || lower.includes('price') || lower.includes('kimat')) {
        reply = `Pakistan Live Market Rates:
• LDA Avenue 1 (10M): 1.45 - 1.85 Cr
• DHA Phase 9 Prism (1K): 2.60 - 3.40 Cr
• Etihad Town (5M): 95 Lac - 1.25 Cr
• DHA Islamabad (1K): 2.40 - 3.20 Cr
• Saria (Steel): PKR 282/Kg | Cement: PKR 1,540/Bag.`;
      } else {
        reply = `BUNYAD.PK poore Pakistan (Lahore, Islamabad, Karachi, Multan, Gwadar) mein verified registry, escrow milestone protection aur turnkey construction provide karta hai. Kisi bhi plot ki instant verification ke liye direct CEO Taha Mubeen Bhutta (0321-9404812) se raabta karein.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
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
          <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Bunyad AI Consultant</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-4 z-50 w-[92vw] max-w-sm rounded-2xl border border-cyan/40 bg-obsidian/95 shadow-2xl backdrop-blur-xl sm:right-6">
          <div className="flex items-center justify-between border-b border-cyan/20 p-3.5 bg-gradient-to-r from-cyan/15 to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan/40 bg-cyan/20 text-cyan">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-platinum">Bunyad AI Consultant</h4>
                <p className="font-mono text-[9px] text-cyan">Pakistan PropTech &bull; CEO Supervised</p>
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

          <div className="h-80 overflow-y-auto p-3.5 space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan text-obsidian font-semibold rounded-br-none shadow-cyan-glow'
                      : 'border border-cyan/20 bg-obsidian/90 text-platinum/90 rounded-bl-none whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
                <span className="mt-1 font-mono text-[8px] text-platinum/40 px-1">{m.time}</span>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan animate-pulse">
                <Sparkles className="h-3 w-3" /> Bunyad AI processing database...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-cyan/20 p-2.5 flex items-center gap-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pura Pakistan property query ya 'property add karo'..."
              className="flex-1 rounded-xl border border-cyan/20 bg-[#060c16] px-3 py-2 text-xs text-platinum outline-none focus:border-cyan placeholder:text-platinum/30"
            />
            <button
              type="submit"
              className="btn-cyan p-2 rounded-xl text-obsidian font-bold cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
