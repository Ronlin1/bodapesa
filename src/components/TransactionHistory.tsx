import React from 'react';
import { Transaction, Language, TRANSLATIONS } from '../types';
import { ArrowDownLeft, ArrowUpRight, ShoppingBag, Car, Wallet } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  transactions: Transaction[];
  language: Language;
}

export const TransactionHistory: React.FC<Props> = ({ transactions, language }) => {
  const t = TRANSLATIONS[language];

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'transport': return <Car size={18} />;
      case 'shopping': return <ShoppingBag size={18} />;
      case 'savings': return <Wallet size={18} />;
      default: return <ArrowDownLeft size={18} />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-black">
      <h2 className="text-xl font-black uppercase mb-6">{t.transactions}</h2>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-yellow-400 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
              </div>
              <div>
                <div className="font-black text-sm uppercase">{tx.description}</div>
                <div className="text-[10px] uppercase font-bold opacity-40 flex items-center gap-2">
                  {getIcon(tx.category)} {tx.category} • {format(tx.timestamp, 'MMM dd, HH:mm')}
                </div>
              </div>
            </div>
            <div className={`font-black ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {tx.type === 'income' ? '+' : '-'} {tx.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
