import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { askDhammeRealEstateAI } from '../services/geminiService';
import { DhammeLogo } from './DhammeLogo';

interface DhammeRealEstateAIModalProps {
  onClose: () => void;
}

export const DhammeRealEstateAIModal: React.FC<DhammeRealEstateAIModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Asc! Waxaan ahay **DHAMME Real Estate AI**. Waxaan kugu caawin karaa raadinta guryaha kiro/iibka ah ee Jigjiga iyo guud ahaan Deegaanka Soomaalida. Maxaad jeceshahay inaad waydiiso?'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#111315]/65 backdrop-blur-md"
      />

      {/* Modal Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative bg-white max-w-md w-full rounded-[28px] p-5 sm:p-6 shadow-2xl space-y-4 flex flex-col max-h-[85vh] border border-[#E8E5DF] z-10"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
          <div className="flex items-center space-x-2">
            <DhammeLogo variant="sm" animated={true} showSubtitle={false} />
            <div>
              <h3 className="font-serif font-bold text-sm text-[#111315]">DHAMME AI Assistant</h3>
              <span className="text-[10px] text-[#C8A96B] font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B] animate-ping" />
                <span>Gemini Powered • Active</span>
              </span>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="text-[#74777B] hover:text-[#111315] p-1.5 rounded-full hover:bg-[#FAF9F6] transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </motion.button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 p-1 min-h-[240px]">
          <AnimatePresence initial={false}>
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#111315] text-white ml-auto max-w-[85%] shadow-xs font-medium'
                    : 'bg-[#FAF9F6] text-[#111315] mr-auto max-w-[88%] border border-[#E8E5DF]'
                }`}
              >
                {m.text}
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[#C8A96B] font-semibold p-3 bg-[#FAF9F6] rounded-2xl max-w-xs border border-[#C8A96B]/30 flex items-center space-x-2"
            >
              <span className="material-symbols-outlined text-[18px] animate-spin text-[#C8A96B]">sync</span>
              <span>Dhamme AI wuxuu diyaarinayaa jawaabta...</span>
            </motion.div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pt-1">
          {['Guri kiro Jigjiga Kebele 06', 'Qiimaha guryaha Jigjiga', 'Sidee loo soo dhigaa guri?'].map((sug, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend(sug)}
              className="px-3 py-1.5 bg-[#FAF9F6] text-[#111315] rounded-full text-[11px] font-medium whitespace-nowrap hover:bg-[#111315] hover:text-white border border-[#E8E5DF] transition-all cursor-pointer shadow-2xs"
            >
              {sug}
            </motion.button>
          ))}
        </div>

        {/* Query Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Waydiiso Dhamme AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3.5 bg-[#FAF9F6] rounded-2xl text-xs border border-[#E8E5DF] text-[#111315] focus:outline-none focus:border-[#C8A96B] focus:bg-white transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3.5 bg-gradient-to-r from-[#C8A96B] to-[#D4B97F] text-[#111315] rounded-2xl font-bold text-xs disabled:opacity-50 transition-all shadow-xs cursor-pointer"
          >
            Dir
          </motion.button>
        </form>

      </motion.div>
    </div>
  );
};
