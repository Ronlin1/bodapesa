import React from 'react';
import { MapPin, Navigation, Zap } from 'lucide-react';
import { Language, TRANSLATIONS } from '../types';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';

interface Props {
  recommendations: string;
  language: Language;
}

export const EarningsOptimizer: React.FC<Props> = ({ recommendations, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-black">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-yellow-400 p-2 rounded-xl">
          <Zap size={20} className="text-black" />
        </div>
        <h2 className="text-xl font-black uppercase">{t.optimizeEarnings}</h2>
      </div>

      <div className="relative h-48 bg-gray-100 rounded-2xl mb-6 overflow-hidden border border-gray-200">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-20 grayscale bg-[url('https://picsum.photos/seed/map/800/400')]" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative"
          >
            <MapPin size={40} className="text-red-600 fill-red-600" />
            <div className="absolute -inset-4 bg-red-600/20 rounded-full animate-ping" />
          </motion.div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 bg-black text-white p-3 rounded-xl flex items-center gap-3">
          <Navigation size={18} className="text-yellow-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Live Earning Hotspots</span>
        </div>
      </div>

      <div className="prose prose-sm max-w-none">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="text-sm font-medium leading-relaxed">
            <ReactMarkdown>
              {recommendations}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      
      <button className="w-full mt-6 bg-black text-yellow-400 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors">
        Navigate to Peak Area
      </button>
    </div>
  );
};
