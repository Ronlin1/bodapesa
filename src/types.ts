export type Language = 'en' | 'sw' | 'lg';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  timestamp: number;
  description: string;
}

export interface TrustScore {
  score: number; // 0-1000
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  lastUpdated: number;
  factors: {
    repaymentHistory: number;
    transactionVolume: number;
    savingsConsistency: number;
    communityVouching: number;
  };
}

export interface SavingsNudge {
  id: string;
  title: string;
  message: string;
  amount: number;
  timestamp: number;
  isRead: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  language: Language;
  trustScore?: TrustScore;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface LoanProvider {
  id: string;
  name: string;
  minScore: number;
  interestRate: string;
  maxAmount: number;
  logo: string;
}

export const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    trustScore: 'Trust Score',
    savings: 'Savings',
    earnings: 'Earnings',
    transactions: 'Transactions',
    nudgeTitle: 'Savings Tip',
    optimizeEarnings: 'Optimize Earnings',
    language: 'Language',
    login: 'Login with Google',
    logout: 'Logout',
    welcome: 'Welcome back',
    lowScore: 'Keep transacting to build your score!',
    highScore: 'Great job! You qualify for lower interest rates.',
    chatPlaceholder: 'Ask BodaPesa anything...',
    voiceInput: 'Tap to speak (Luganda/Swahili)',
    loanProviders: 'Loan Providers',
    connect: 'Connect',
    downloadReport: 'Download Credit Report',
    logEarnings: 'Log Daily Earnings',
    upcomingTitle: 'Coming Soon!',
    upcomingDesc: 'Our engineers are working hard to bring this feature to your fingertips. Stay tuned!',
    loginRequired: 'Please login to access this feature',
    backToDashboard: 'Back to Dashboard',
  },
  sw: {
    dashboard: 'Dashibodi',
    trustScore: 'Alama ya Imani',
    savings: 'Akiba',
    earnings: 'Mapato',
    transactions: 'Miamala',
    nudgeTitle: 'Kidokezo cha Akiba',
    optimizeEarnings: 'Boresha Mapato',
    language: 'Lugha',
    login: 'Ingia na Google',
    logout: 'Ondoka',
    welcome: 'Karibu tena',
    lowScore: 'Endelea kufanya miamala ili kukuza alama yako!',
    highScore: 'Kazi nzuri! Unastahili viwango vya chini vya riba.',
    chatPlaceholder: 'Uliza BodaPesa chochote...',
    voiceInput: 'Gusa ili uzungumze (Luganda/Swahili)',
    loanProviders: 'Watoa Mikopo',
    connect: 'Unganisha',
    downloadReport: 'Pakua Ripoti ya Mkopo',
    logEarnings: 'Rekodi Mapato ya Kila Siku',
    upcomingTitle: 'Inakuja Hivi Karibuni!',
    upcomingDesc: 'Wahandisi wetu wanafanya kazi kwa bidii kuleta kipengele hiki kiganjani mwako. Endelea kufuatilia!',
    loginRequired: 'Tafadhali ingia ili kufikia kipengele hiki',
    backToDashboard: 'Rudi kwenye Dashibodi',
  },
  lg: {
    dashboard: 'Dashboard',
    trustScore: 'Obwesigwa',
    savings: 'Okutereka',
    earnings: 'Enfuna',
    transactions: 'Ebikolebwa',
    nudgeTitle: 'Amagezi ku Kutereka',
    optimizeEarnings: 'Longosa Enfuna',
    language: 'Olulimi',
    login: 'Yingira ne Google',
    logout: 'Ffuluma',
    welcome: 'Tukusanyukidde okudda',
    lowScore: 'Genda mu maaso n\'okukola ebintu okukuza obwesigwa bwo!',
    highScore: 'Okoze bulungi! Osaana okufuna amagoba amatonotono.',
    chatPlaceholder: 'Buuza BodaPesa kyonna...',
    voiceInput: 'Nyiga okwogera (Luganda/Swahili)',
    loanProviders: 'Abawa Obuyambi',
    connect: 'Yungako',
    downloadReport: 'Ggyako Ripoti y\'Obwesigwa',
    logEarnings: 'Wandiika Enfuna yo eya Bulijjo',
    upcomingTitle: 'Kijja mangu!',
    upcomingDesc: 'Bainjiniya baffe bakola nnyo okuleeta enkyukakyuka eno mu ngalo zo. Linda mangu!',
    loginRequired: 'Yingira okukozesa enkyukakyuka eno',
    backToDashboard: 'Dda ku Dashboard',
  }
};
