import React, { useState } from 'react';
import { askDhammeRealEstateAI } from '../services/geminiService';

interface DhammeRealEstateAIModalProps {
  onClose: () => void;
}

export const DhammeRealEstateAIModal: React.FC<DhammeRealEstateAIModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Asc! Waxaan ahay **DHAMME Real Estate AI**. Waxaan kugu caawin karaa raadinta guryaha kiro/iibka ah, qiimaha kireysiga Mogadishu, Hargeysa, Garowe, ama habka loo soo dhigo guryaha. Maxaad jeceshahay inaad waydiiso?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const reply = await askDhammeRealEstateAI(text, 'so');
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Khadka ayaa xoogaa gaabis ah, fadlan mar kale isku day.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fcf9f8] max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4 relative flex flex-col max-h-[85vh]">
        
        <div className="flex items-center justify-between border-b border-[#bec9c5]/40 pb-3">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#005145] text-[28px]">auto_awesome</span>
            <div>
              <h3 className="font-poppins font-bold text-base text-[#1b1b1c]">DHAMME Real Estate AI</h3>
              <span className="text-[10px] text-[#005145] font-semibold">Gemini 2.5 Active</span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#645d54] hover:text-[#1b1b1c]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 p-1 min-h-[250px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#005145] text-white ml-auto max-w-[80%]'
                  : 'bg-[#f0eded] text-[#1b1b1c] mr-auto max-w-[85%] border border-[#bec9c5]/40'
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="text-xs text-[#005145] font-bold p-2 bg-[#f0eded] rounded-xl max-w-xs animate-pulse">
              Dhamme AI wuxuu diyaarinayaa jawaabta...
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pt-1">
          {['Guri kiro 3 qol Mogadishu', 'Qiimaha guryaha Hargeysa', 'Side loo soo dhigaa guri?'].map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="px-3 py-1 bg-[#ebe1d5] text-[#1b1b1c] rounded-full text-[11px] font-semibold whitespace-nowrap hover:bg-[#005145] hover:text-white transition"
            >
              {sug}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Waydiiso Dhamme AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 bg-[#f0eded] rounded-2xl text-xs border-none text-[#1b1b1c]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-[#005145] text-white rounded-2xl font-bold text-xs disabled:opacity-50"
          >
            Dir
          </button>
        </form>

      </div>
    </div>
  );
};
