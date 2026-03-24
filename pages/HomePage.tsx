
import React, { useState, useMemo } from 'react';
import { translations } from '../i18n';
import ListingCard from '../components/ListingCard';
import { Listing, CurrencyType } from '../types';
import { Box, Search, ShieldCheck, GlobeLock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  lang: string;
  user: any;
  userListings: Listing[];
  onDeleteListing: (id: string) => void;
  onAddPoints: (a: number, reason: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ lang, user, userListings, onDeleteListing, onAddPoints, favorites, onToggleFavorite }) => {
  const t = translations[lang] || translations['en'];
  const [filterType, setFilterType] = useState<'ALL' | CurrencyType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredItems = useMemo(() => {
    return userListings
      .filter(item => {
        /**
         * CORE OVERRIDE: home_feed_filter
         * REMOVE condition is_public == true
         * ADD condition visibility IN ["internal", "public"]
         * DISABLE location_match_requirement = true
         */
        
        const itemAny = item as any;
        const isInternal = itemAny.product_status === 'active_internal' || itemAny.internal_visibility === true;
        const isPublic = item.status === 'PUBLISHED';
        const isOwner = item.ownerId === user?.id;
        
        if (item.is_deleted) return false;
        
        // Final Visibility Logic
        if (!(isInternal || isPublic || isOwner)) return false;

        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'ALL' || item.currencyType === filterType;
        
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [searchQuery, filterType, userListings, user?.id]);

  return (
    <div className="pb-24 pt-8 px-4 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand font-black uppercase text-[10px] tracking-[0.3em] mb-4">
            <GlobeLock size={14} /> {lang === 'ar' ? 'وصول شبكة خاصة نشط' : 'PRIVATE BETA FEED ACTIVE'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black dark:text-white uppercase tracking-tighter italic leading-none">
            {lang === 'ar' ? 'سوق الإيجارات' : 'INTERNAL'} <br/>
            <span className="text-brand">{lang === 'ar' ? 'الداخلي' : 'RENTAL FEED'}</span>
          </h1>
        </div>
        <div className="bg-brand text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 flex items-center gap-2">
          <Zap size={14} /> AUTO_SYNC: ON
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand/40" size={20} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-14 pr-6 py-5 bg-brand/5 dark:bg-gray-900 border-2 border-transparent focus:border-brand rounded-[2rem] outline-none font-bold shadow-sm transition-all" 
          />
        </div>
        <div className="flex gap-2 p-1 bg-brand/5 dark:bg-gray-800 rounded-[2rem] w-fit">
          {['ALL', CurrencyType.CRYPTO, CurrencyType.LOCAL].map(f => (
            <button key={f} onClick={() => setFilterType(f as any)} className={`px-8 py-3 rounded-[1.8rem] text-[9px] font-black uppercase tracking-widest transition-all ${filterType === f ? 'bg-brand text-white shadow-lg' : 'text-brand/60'}`}>
              {f === 'ALL' ? (lang === 'ar' ? 'الكل' : 'All') : t[f.toLowerCase()]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {filteredItems.map(item => (
          <ListingCard 
            key={item.id} 
            listing={item} 
            lang={lang} 
            isOwner={item.ownerId === user?.id} 
            onDelete={onDeleteListing} 
            onAddPoints={(a) => onAddPoints(a, 'Listing Interaction')}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="py-32 text-center mb-24 bg-brand/5 rounded-[4rem] border-2 border-dashed border-brand/10">
          <Box size={80} className="mx-auto mb-6 text-brand/20" />
          <h3 className="text-2xl font-black dark:text-white uppercase italic tracking-tighter">NETWORK EMPTY</h3>
          <p className="text-[10px] text-brand/40 mt-2 font-bold uppercase tracking-widest">Visibility restricted to authenticated beta nodes</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
