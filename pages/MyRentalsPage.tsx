
import React, { useState, useMemo } from 'react';
import { translations } from '../i18n';
import { Listing } from '../types';
import { ArrowLeft, Package, Clock, CheckCircle2, History, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MyRentalsPageProps {
  lang: string;
  user: any;
  listings: Listing[];
}

const MyRentalsPage: React.FC<MyRentalsPageProps> = ({ lang, user, listings }) => {
  const t = translations[lang] || translations['en'];
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'BY_ME' | 'FROM_ME'>('BY_ME');

  // Simulated Rental History (Real app would fetch from backend)
  const myRentals = useMemo(() => {
    // Just an example structure based on current listings to show interactivity
    return listings.slice(0, 3).map(l => ({
      ...l,
      rentalStatus: Math.random() > 0.5 ? 'ACTIVE' : 'ENDED',
      startDate: '2024-05-10',
      endDate: '2024-05-15'
    }));
  }, [listings]);

  return (
    <div className="max-w-4xl mx-auto p-4 pt-10 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:text-white">
          <ArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
        <h1 className="text-2xl font-black dark:text-white uppercase tracking-tighter italic">{t.myRentals}</h1>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-8">
        <button onClick={() => setActiveTab('BY_ME')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'BY_ME' ? 'bg-white dark:bg-gray-900 text-brand shadow' : 'text-gray-400'}`}>
          <Package size={16} /> {t.rentedByMe}
        </button>
        <button onClick={() => setActiveTab('FROM_ME')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'FROM_ME' ? 'bg-white dark:bg-gray-900 text-brand shadow' : 'text-gray-400'}`}>
          <History size={16} /> {t.rentedFromMe}
        </button>
      </div>

      <div className="space-y-4">
        {myRentals.length === 0 ? (
          <div className="py-32 text-center opacity-20 flex flex-col items-center">
            <Package size={64} className="mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">{lang === 'ar' ? 'لا توجد إيجارات نشطة' : 'No active rentals'}</p>
          </div>
        ) : (
          myRentals.map(r => (
            <div key={r.id} className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border dark:border-gray-800 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
               <img src={r.images[0]} className="w-24 h-24 rounded-[1.5rem] object-cover" />
               <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-black dark:text-white uppercase text-sm mb-1">{r.title}</h3>
                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-[9px] font-black text-gray-400 uppercase">
                     <span className="flex items-center gap-1"><Clock size={12} className="text-brand" /> {r.startDate} - {r.endDate}</span>
                     <span className="flex items-center gap-1"><CreditCard size={12} className="text-brand" /> {r.price} {r.currency}</span>
                  </div>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 ${r.rentalStatus === 'ACTIVE' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400'}`}>
                    <CheckCircle2 size={12} /> {r.rentalStatus === 'ACTIVE' ? t.statusActive : t.statusEnded}
                  </span>
                  {r.rentalStatus === 'ENDED' && (
                    <button onClick={() => navigate(`/item/${r.id}`)} className="text-[9px] font-black text-brand uppercase hover:underline">
                      {lang === 'ar' ? 'ترك تقييم' : 'Leave Rating'}
                    </button>
                  )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyRentalsPage;
