import React, { useState } from 'react';
import { askDhammeRealEstateAI } from '../services/geminiService';
import { DhammeLogo } from './DhammeLogo';

interface DhammeRealEstateAIModalProps {
  onClose: () => void;
}

export const DhammeRealEstateAIModal: React.FC<DhammeRealEstateAIModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Asc! Waxaan ahay **DHAMME Real Estate AI**. Waxaan kugu caawin karaa raadinta guryaha kiro/iibka ah ee Jigjiga, Mogadishu, Hargeysa, ama Garowe. Maxaad jeceshahay inaad waydiiso?'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white max-w-md w-full rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 relative flex flex-col max-h-[85vh] border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <DhammeLogo variant="sm" animated={true} showSubtitle={false} />
            <div>
              <h3 className="font-poppins font-bold text-sm text-slate-900">Real Estate AI</h3>
              <span className="text-[10px] text-rose-600 font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                <span>Gemini Powered • Active</span>
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 p-1 min-h-[240px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white ml-auto max-w-[85%] shadow-sm font-medium'
                  : 'bg-slate-100 text-slate-900 mr-auto max-w-[88%] border border-slate-200 shadow-xs'
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="text-xs text-rose-600 font-bold p-3 bg-slate-100 rounded-2xl max-w-xs animate-pulse border border-rose-200 flex items-center space-x-2">
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              <span>Dhamme AI wuxuu diyaarinayaa jawaabta...</span>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pt-1">
          {['Guri kiro Jigjiga Kebele 06', 'Qiimaha guryaha Hargeysa', 'Sidee loo soo dhigaa guri?'].map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-[11px] font-semibold whitespace-nowrap hover:bg-rose-600 hover:text-white transition-all shadow-xs"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Waydiiso Dhamme AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3.5 bg-slate-50 rounded-2xl text-xs border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs disabled:opacity-50 transition-all shadow-md active:scale-95"
          >
            Dir
          </button>
        </form>

      </div>
    </div>
  );
};
