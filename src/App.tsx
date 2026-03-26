import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, limit } from 'firebase/firestore';
import { auth, db, signIn, logOut } from './firebase';
import { Transaction, TrustScore, SavingsNudge, Language, TRANSLATIONS } from './types';
import { calculateTrustScore, generateSavingsNudge, getEarningOptimization } from './services/geminiService';
import { TrustScoreCard } from './components/TrustScoreCard';
import { SavingsNudgeCard } from './components/SavingsNudgeCard';
import { EarningsOptimizer } from './components/EarningsOptimizer';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { TransactionHistory } from './components/TransactionHistory';
import { ChatBot } from './components/ChatBot';
import { LoanConnect } from './components/LoanConnect';
import { UpcomingFeature } from './components/UpcomingFeature';
import { BodaRiderAnimation } from './components/BodaRiderAnimation';
import { LogIn, LogOut, Plus, Wallet, TrendingUp, MapPin, Download, Bike, DollarSign, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 5000, type: 'income', category: 'Transport', timestamp: Date.now() - 3600000, description: 'Boda Ride - Central' },
  { id: '2', amount: 2000, type: 'expense', category: 'Fuel', timestamp: Date.now() - 7200000, description: 'Shell Petrol' },
  { id: '3', amount: 15000, type: 'income', category: 'Transport', timestamp: Date.now() - 86400000, description: 'Airport Drop' },
  { id: '4', amount: 3000, type: 'expense', category: 'Food', timestamp: Date.now() - 90000000, description: 'Lunch - Mama Nina' },
  { id: '5', amount: 10000, type: 'income', category: 'Savings', timestamp: Date.now() - 172800000, description: 'Weekly Save' },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [nudge, setNudge] = useState<SavingsNudge | null>(null);
  const [recommendations, setRecommendations] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isLoggingEarnings, setIsLoggingEarnings] = useState(false);
  const [logAmount, setLogAmount] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const t = TRANSLATIONS[language];

  const requireAuth = (action: () => void) => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    action();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, `users/${user.uid}/transactions`),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
        if (txs.length > 0) {
          setTransactions(txs);
        }
      });
      return unsubscribe;
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const score = await calculateTrustScore(transactions);
      setTrustScore(score);
      
      const newNudge = await generateSavingsNudge(transactions, language);
      setNudge(newNudge);

      const recs = await getEarningOptimization({ lat: 0.3476, lng: 32.5825 }, language);
      setRecommendations(recs);
    };
    
    fetchData();
  }, [transactions, language]);

  const handleAddTransaction = async () => {
    requireAuth(async () => {
      const newTx = {
        amount: Math.floor(Math.random() * 10000) + 1000,
        type: Math.random() > 0.3 ? 'income' : 'expense',
        category: 'Transport',
        timestamp: Date.now(),
        description: 'New Ride Payment'
      };
      await addDoc(collection(db, `users/${user!.uid}/transactions`), newTx);
    });
  };

  const handleLogEarnings = async () => {
    requireAuth(async () => {
      if (!logAmount) return;
      const newTx = {
        amount: parseInt(logAmount),
        type: 'income',
        category: 'Transport',
        timestamp: Date.now(),
        description: 'Daily Earnings Log'
      };
      await addDoc(collection(db, `users/${user!.uid}/transactions`), newTx);
      setLogAmount('');
      setIsLoggingEarnings(false);
    });
  };

  const handleSave = async (amount: number) => {
    requireAuth(async () => {
      const saveTx = {
        amount,
        type: 'expense',
        category: 'Savings',
        timestamp: Date.now(),
        description: 'AI Suggested Saving'
      };
      await addDoc(collection(db, `users/${user!.uid}/transactions`), saveTx);
      setNudge(null);
    });
  };

  const handleDownloadReport = () => {
    requireAuth(() => {
      setShowUpcoming(true);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden">
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-yellow-400 z-[300] flex flex-col items-center justify-center"
          >
            <BodaRiderAnimation 
              once 
              className="w-full" 
              onComplete={() => setShowIntro(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming Feature View */}
      <AnimatePresence>
        {showUpcoming && (
          <UpcomingFeature language={language} onBack={() => setShowUpcoming(false)} />
        )}
      </AnimatePresence>

      {/* Auth Prompt Modal */}
      <AnimatePresence>
        {showAuthPrompt && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[250] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-[40px] w-full max-w-md border-4 border-black shadow-2xl text-center"
            >
              <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={32} />
              </div>
              <h2 className="text-2xl font-black uppercase mb-4">{t.loginRequired}</h2>
              <button 
                onClick={() => {
                  signIn();
                  setShowAuthPrompt(false);
                }}
                className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase mb-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {t.login}
              </button>
              <button 
                onClick={() => setShowAuthPrompt(false)}
                className="text-sm font-bold opacity-50 uppercase"
              >
                Maybe Later
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-black text-yellow-400 p-6 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ x: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-yellow-400 p-2 rounded-xl"
            >
              <Bike size={24} className="text-black" />
            </motion.div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">BodaPesa</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <LanguageSwitcher current={language} onChange={setLanguage} />
            {user ? (
              <div className="flex items-center gap-4">
                <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full border-2 border-yellow-400" />
                <button onClick={logOut} className="text-yellow-400 hover:opacity-80">
                  <LogOut size={24} />
                </button>
              </div>
            ) : (
              <button 
                onClick={signIn}
                className="bg-yellow-400 text-black px-6 py-2 rounded-xl font-black uppercase text-sm flex items-center gap-2"
              >
                <LogIn size={18} /> {t.login}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Trust Score & Nudges */}
        <div className="lg:col-span-4 space-y-8">
          {trustScore && (
            <div className="space-y-4">
              <TrustScoreCard trustScore={trustScore} language={language} />
              <button 
                onClick={handleDownloadReport}
                className="w-full bg-black text-yellow-400 py-3 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 border-2 border-yellow-400 hover:bg-gray-900 transition-colors"
              >
                <Download size={16} /> {t.downloadReport}
              </button>
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {nudge && (
              <SavingsNudgeCard 
                key={nudge.id}
                nudge={nudge} 
                language={language} 
                onSave={handleSave}
              />
            )}
          </AnimatePresence>

          <div className="bg-black text-yellow-400 p-6 rounded-3xl border-2 border-yellow-400">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black uppercase text-sm">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => requireAuth(() => setIsLoggingEarnings(true))}
                className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <DollarSign size={20} /> {t.logEarnings}
              </button>
              <button 
                onClick={handleAddTransaction}
                className="w-full bg-gray-900 text-yellow-400 py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform border border-yellow-400/20"
              >
                <Plus size={20} /> Add Transaction
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column: Earnings & Map */}
        <div className="lg:col-span-4 space-y-8">
          <EarningsOptimizer recommendations={recommendations} language={language} />
          
          {trustScore && <LoanConnect userScore={trustScore.score} language={language} />}
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-4">
          <TransactionHistory transactions={transactions} language={language} />
        </div>
      </main>

      {/* Logging Earnings Modal */}
      <AnimatePresence>
        {isLoggingEarnings && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-yellow-400 p-8 rounded-[40px] w-full max-w-md border-4 border-black shadow-2xl"
            >
              <h2 className="text-2xl font-black uppercase mb-6 text-black">{t.logEarnings}</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase opacity-60 mb-2 block">Amount (UGX)</label>
                  <input 
                    type="number" 
                    value={logAmount}
                    onChange={(e) => setLogAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full bg-white border-4 border-black p-4 rounded-2xl text-xl font-black outline-none focus:ring-4 ring-black/10"
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsLoggingEarnings(false)}
                    className="flex-1 bg-black text-white py-4 rounded-2xl font-black uppercase"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogEarnings}
                    className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                  >
                    Log Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ChatBot */}
      <ChatBot language={language} />

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-black text-yellow-400 p-4 rounded-3xl shadow-2xl flex justify-around items-center border border-yellow-400/20">
        <button className="p-2 bg-yellow-400 text-black rounded-xl"><Wallet size={24} /></button>
        <button className="p-2 opacity-50" onClick={() => setShowUpcoming(true)}><TrendingUp size={24} /></button>
        <button className="p-2 opacity-50" onClick={() => setShowUpcoming(true)}><MapPin size={24} /></button>
        <button className="p-2 opacity-50" onClick={() => requireAuth(() => setIsLoggingEarnings(true))}><Plus size={24} /></button>
      </nav>
    </div>
  );
}
