
import React from 'react';
import { translations } from '../i18n';
import { 
  Wallet, ArrowLeft, TrendingUp, History, 
  ArrowUpRight, Award, Zap, Coins 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WalletPageProps {
  lang: string;
  user: any;
  history: any[];
}

const WalletPage: React.FC<WalletPageProps> = ({ lang, user, history }) => {
  const t = translations[lang] || translations['en'];
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4 pt-10 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:text-white">
          <ArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
        <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
          <Wallet className="text-brand" /> {t.wallet}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gradient-to-br from-brand to-red-700 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Coins size={120} />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Points Balance</p>
           <h2 className="text-6xl font-black italic tracking-tighter leading-none mb-6">{user.points}</h2>
           <div className="flex gap-4">
              <div className="px-4 py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase flex items-center gap-2">
                 <Zap size={14} className="text-yellow-400" /> Fast Accumulation
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border-4 border-gray-50 dark:border-gray-800 shadow-sm flex flex-col justify-between">
           <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Earnings Value</p>
              <h2 className="text-4xl font-black dark:text-white italic tracking-tighter">{user.walletBalance} {user.currencyPreference}</h2>
           </div>
           <button onClick={() => navigate('/subscription')} className="w-full mt-6 py-4 bg-brand text-white rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-brand/20 active:scale-95 transition-all">
             Buy Points / Subscribe
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 border dark:border-gray-800">
         <h3 className="text-lg font-black dark:text-white uppercase mb-8 flex items-center gap-3 italic">
            <History className="text-brand" /> {t.pointHistory}
         </h3>
         
         {history.length === 0 ? (
           <div className="py-20 text-center opacity-10 flex flex-col items-center">
              <Award size={64} className="mb-4" />
              <p className="text-[10px] font-black uppercase">{lang === 'ar' ? 'لا توجد عمليات سابقة' : 'No history yet'}</p>
           </div>
         ) : (
           <div className="space-y-6">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-3xl group hover:border-brand border-2 border-transparent transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center text-brand shadow-sm">
                         <TrendingUp size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-black dark:text-white uppercase">{h.reason}</p>
                         <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(h.timestamp).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-green-500">+{h.amount}</p>
                      <p className="text-[8px] text-gray-400 font-black uppercase">{t.transactionId}: {h.id.toString().slice(-6)}</p>
                   </div>
                </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
};

export default WalletPage;
