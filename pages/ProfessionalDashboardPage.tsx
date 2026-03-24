
import React, { useMemo } from 'react';
import { translations } from '../i18n';
import { 
  TrendingUp, Eye, DollarSign, ArrowLeft, LayoutDashboard, Activity, BarChart3, Package, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Listing } from '../types';

interface ProDashboardProps {
  lang: string;
  user: any;
  listings: Listing[];
}

const ProfessionalDashboardPage: React.FC<ProDashboardProps> = ({ lang, user, listings }) => {
  const t = translations[lang] || translations['en'];
  const navigate = useNavigate();

  const userListings = useMemo(() => listings.filter(l => l.ownerId === user.id), [listings, user.id]);
  
  const stats = useMemo(() => {
    const totalViews = userListings.reduce((sum, l) => sum + (l.views || 0), 0);
    const potentialEarnings = userListings.reduce((sum, l) => sum + l.price, 0);
    const activeRentals = userListings.filter(l => l.status === 'PUBLISHED').length;
    
    return [
      { label: t.totalEarnings, value: `${potentialEarnings.toFixed(2)} ${user.currencyPreference}`, icon: <DollarSign className="text-emerald-500" />, trend: '+100%' },
      { label: t.views, value: totalViews.toString(), icon: <Eye className="text-brand" />, trend: totalViews > 0 ? 'Active' : '0%' },
      { label: t.activeRentals, value: activeRentals.toString(), icon: <Package className="text-blue-500" />, trend: 'Live' },
      { label: lang === 'ar' ? 'نقاط التفاعل' : 'Engagement', value: user.points.toString(), icon: <Activity className="text-orange-500" />, trend: 'Stable' },
    ];
  }, [userListings, user.currencyPreference, user.points, lang, t]);

  const categoriesDist = useMemo(() => {
    const dist: Record<string, number> = {};
    userListings.forEach(l => {
      dist[l.category] = (dist[l.category] || 0) + 1;
    });
    return Object.entries(dist);
  }, [userListings]);

  return (
    <div className="max-w-7xl mx-auto p-4 pt-10 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:text-white">
            <ArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
          </button>
          <div>
            <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
              <LayoutDashboard className="text-brand" /> {t.proDashboard}
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{lang === 'ar' ? 'تحليلات الأداء الحقيقية' : 'Real-time Performance Analytics'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
               <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
               <span className={`text-[10px] font-black px-3 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400'}`}>
                 {stat.trend}
               </span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-10 rounded-[3rem] border dark:border-gray-800">
           <h3 className="text-lg font-black dark:text-white uppercase mb-8 flex items-center gap-2 italic"><TrendingUp className="text-brand" /> {t.performance}</h3>
           {userListings.length > 0 ? (
             <div className="space-y-6">
                {userListings.map(l => (
                  <div key={l.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                     <div className="flex items-center gap-4">
                        <img src={l.images[0]} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                           <p className="text-xs font-black dark:text-white uppercase truncate max-w-[150px]">{l.title}</p>
                           <p className="text-[9px] text-gray-400 font-bold uppercase">{l.views} {t.views}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-brand">{l.price} {l.currency}</p>
                        <p className="text-[8px] text-gray-400 uppercase font-black">{t.periods[l.rentalPeriod]}</p>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-20 text-center opacity-20">
                <BarChart3 size={48} className="mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase">{lang === 'ar' ? 'لا توجد سلع نشطة' : 'No Active Listings'}</p>
             </div>
           )}
        </div>

        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border dark:border-gray-800">
           <h3 className="text-lg font-black dark:text-white uppercase mb-8 italic">{lang === 'ar' ? 'توزيع الفئات' : 'Category Split'}</h3>
           <div className="space-y-4">
              {categoriesDist.length > 0 ? categoriesDist.map(([cat, count]) => (
                <div key={cat} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="dark:text-white">{cat}</span>
                      <span className="text-brand">{Math.round((count / userListings.length) * 100)}%</span>
                   </div>
                   <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: `${(count / userListings.length) * 100}%` }} />
                   </div>
                </div>
              )) : (
                <p className="text-[10px] text-gray-400 font-bold uppercase text-center py-10 italic">No category data</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboardPage;
