import React from 'react';
import { motion } from 'motion/react';
import { Bell, Sparkles, ArrowRight } from 'lucide-react';
import { SavingsNudge, Language, TRANSLATIONS } from '../types';

interface Props {
  nudge: SavingsNudge;
  language: Language;
  onSave: (amount: number) => void;
}

export const SavingsNudgeCard: React.FC<Props> = ({ nudge, language, onSave }) => {
  const t = TRANSLATIONS[language];

  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-yellow-400 text-black p-5 rounded-3xl shadow-xl relative overflow-hidden group"
    >
      <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
        <Sparkles size={120} />
      </div>
      
      <div className="flex items-start gap-4">
        <div className="bg-black text-yellow-400 p-3 rounded-2xl">
          <Bell size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-black text-lg uppercase tracking-tight">{nudge.title}</h3>
          <p className="text-sm font-medium mt-1 leading-tight opacity-90">
            {nudge.message}
          </p>
          
          <div className="mt-4 flex items-center justify-between bg-black/5 p-3 rounded-2xl border border-black/10">
            <div>
              <span className="text-[10px] uppercase font-bold opacity-60">Suggested Save</span>
              <div className="text-xl font-black">UGX {nudge.amount.toLocaleString()}</div>
            </div>
            <button 
              onClick={() => onSave(nudge.amount)}
              className="bg-black text-yellow-400 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
            >
              Save Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
