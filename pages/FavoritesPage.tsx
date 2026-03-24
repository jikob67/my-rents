
import React from 'react';
import { translations } from '../i18n';
import { Listing } from '../types';
import ListingCard from '../components/ListingCard';
import { Heart, ArrowLeft, Ghost } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FavoritesPageProps {
  lang: string;
  user: any;
  listings: Listing[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddPoints: (a: number, reason: string) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ lang, user, listings, favorites, onToggleFavorite, onAddPoints }) => {
  const t = translations[lang] || translations['en'];
  const navigate = useNavigate();

  const favoriteItems = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto p-4 pt-10 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:text-white">
          <ArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
        <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
          <Heart className="text-pink-500 fill-pink-500" /> {t.favorites}
        </h1>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="py-32 text-center opacity-20 flex flex-col items-center">
          <Ghost size={80} className="mb-6" />
          <p className="text-sm font-black uppercase tracking-[0.2em]">{t.noFavorites}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {favoriteItems.map(item => (
            <ListingCard 
              key={item.id} 
              listing={item} 
              lang={lang} 
              isOwner={item.ownerId === user?.id} 
              onAddPoints={(a) => onAddPoints(a, 'Interaction')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
