import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ExternalLink, Info } from 'lucide-react';
import { LoanProvider, Language, TRANSLATIONS } from '../types';

const MOCK_PROVIDERS: LoanProvider[] = [
  { id: '1', name: 'Tugende', minScore: 650, interestRate: '12%', maxAmount: 5000000, logo: 'https://picsum.photos/seed/tugende/100/100' },
  { id: '2', name: 'M-KOPA', minScore: 600, interestRate: '15%', maxAmount: 2000000, logo: 'https://picsum.photos/seed/mkopa/100/100' },
  { id: '3', name: 'Asaak', minScore: 700, interestRate: '10%', maxAmount: 10000000, logo: 'https://picsum.photos/seed/asaak/100/100' },
];

interface Props {
  userScore: number;
  language: Language;
}

export const LoanConnect: React.FC<Props> = ({ userScore, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-black">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-black text-yellow-400 p-2 rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <h2 className="text-xl font-black uppercase">{t.loanProviders}</h2>
        </div>
        <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
          <Info size={12} /> Verified Partners
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_PROVIDERS.map((provider) => {
          const isEligible = userScore >= provider.minScore;
          
          return (
            <motion.div 
              key={provider.id}
              whileHover={isEligible ? { x: 5 } : {}}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all flex items-center justify-between",
                isEligible ? "border-gray-100 bg-gray-50" : "border-gray-100 opacity-50 grayscale"
              )}
            >
              <div className="flex items-center gap-4">
                <img src={provider.logo} alt="" className="w-12 h-12 rounded-xl border border-gray-200" />
                <div>
                  <div className="font-black text-sm uppercase">{provider.name}</div>
                  <div className="text-[10px] font-bold opacity-50 uppercase">
                    Rate: {provider.interestRate} • Max: UGX {(provider.maxAmount/1000000).toFixed(1)}M
                  </div>
                  {!isEligible && (
                    <div className="text-[9px] text-red-600 font-black uppercase mt-1">
                      Requires {provider.minScore} Score
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                disabled={!isEligible}
                className={cn(
                  "px-4 py-2 rounded-xl font-black uppercase text-xs flex items-center gap-2",
                  isEligible ? "bg-black text-yellow-400" : "bg-gray-200 text-gray-400"
                )}
              >
                {t.connect} <ExternalLink size={14} />
              </button>
            </motion.div>
          );
        })}
      </div>
      
      <p className="mt-6 text-[10px] text-center opacity-40 font-medium italic">
        BodaPesa only connects you with regulated financial institutions.
      </p>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
