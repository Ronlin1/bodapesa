import React from 'react';
import { motion } from 'motion/react';
import { BodaRiderAnimation } from './BodaRiderAnimation';
import { Language, TRANSLATIONS } from '../types';
import { ArrowLeft, Rocket } from 'lucide-react';

interface Props {
  language: Language;
  onBack: () => void;
}

export const UpcomingFeature: React.FC<Props> = ({ language, onBack }) => {
  const t = TRANSLATIONS[language];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-yellow-400 z-[200] flex flex-col items-center justify-center p-8 text-black text-center"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-black text-yellow-400 p-12 rounded-[60px] border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400" />
          
          <div className="flex justify-center mb-8">
            <div className="bg-yellow-400 p-6 rounded-full border-4 border-black">
              <Rocket size={64} className="text-black animate-bounce" />
            </div>
          </div>

          <h1 className="text-5xl font-black uppercase mb-6 tracking-tighter leading-none">
            {t.upcomingTitle}
          </h1>
          
          <p className="text-xl font-bold opacity-80 mb-12 leading-tight">
            {t.upcomingDesc}
          </p>

          <div className="relative h-40 mb-12">
            <BodaRiderAnimation className="absolute inset-0 flex items-center" />
          </div>

          <button 
            onClick={onBack}
            className="bg-yellow-400 text-black px-8 py-4 rounded-3xl font-black uppercase flex items-center gap-3 mx-auto hover:scale-110 transition-transform border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <ArrowLeft size={24} /> {t.backToDashboard}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
