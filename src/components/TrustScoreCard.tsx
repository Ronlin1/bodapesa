import React from 'react';
import { motion } from 'motion/react';
import { Shield, TrendingUp, Wallet, Users } from 'lucide-react';
import { TrustScore, Language, TRANSLATIONS } from '../types';
import { cn } from '../lib/utils';

interface Props {
  trustScore: TrustScore;
  language: Language;
}

export const TrustScoreCard: React.FC<Props> = ({ trustScore, language }) => {
  const t = TRANSLATIONS[language];
  const scorePercentage = (trustScore.score / 1000) * 100;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'text-blue-400';
      case 'Gold': return 'text-yellow-500';
      case 'Silver': return 'text-gray-400';
      default: return 'text-orange-700';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black text-white p-6 rounded-3xl shadow-2xl border-2 border-yellow-400"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold uppercase tracking-widest text-yellow-400">{t.trustScore}</h2>
        <span className={cn("font-black text-2xl", getLevelColor(trustScore.level))}>
          {trustScore.level}
        </span>
      </div>

      <div className="relative h-48 flex items-center justify-center">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-800"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={440}
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: 440 - (440 * scorePercentage) / 100 }}
            className="text-yellow-400"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-black text-yellow-400">{trustScore.score}</span>
          <span className="text-xs uppercase opacity-50">/ 1000</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <Factor icon={<Shield size={16} />} label="Repayment" value={trustScore.factors.repaymentHistory} />
        <Factor icon={<TrendingUp size={16} />} label="Volume" value={trustScore.factors.transactionVolume} />
        <Factor icon={<Wallet size={16} />} label="Savings" value={trustScore.factors.savingsConsistency} />
        <Factor icon={<Users size={16} />} label="Community" value={trustScore.factors.communityVouching} />
      </div>

      <p className="mt-6 text-sm italic opacity-80 text-center">
        {trustScore.score > 700 ? t.highScore : t.lowScore}
      </p>
    </motion.div>
  );
};

const Factor = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-xl border border-gray-800">
    <div className="text-yellow-400">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase opacity-50">{label}</span>
      <div className="w-full bg-gray-800 h-1 rounded-full mt-1 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="bg-yellow-400 h-full"
        />
      </div>
    </div>
  </div>
);
