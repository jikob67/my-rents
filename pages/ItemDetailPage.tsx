
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { translations } from '../i18n';
import { Listing } from '../types';
import { MapPin, Share2, Heart, MessageCircle, ArrowLeft, Flag, Eye, ShieldCheck, Trash2, Clock, Check, MessageSquare } from 'lucide-react';
import { POINTS_SYSTEM } from '../constants';

interface ItemDetailPageProps {
  lang: string;
  user?: any;
  listings: Listing[];
  onDelete?: (id: string) => void;
  onAddPoints: (a: number, reason: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ lang, user, listings, onDelete, onAddPoints, favorites, onToggleFavorite }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = translations[lang] || translations['en'];
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [copied, setCopied] = useState(false);

  const item = listings.find(l => l.id === id);
  if (!item) return <div className="p-20 text-center font-black">Item Not Found</div>;

  const isOwner = user?.id === item.ownerId;
  const isFavorite = favorites.includes(item.id);

  const handleReport = () => {
    alert(lang === 'ar' ? 'تم استلام بلاغك. نظام AI my rents سيعيد فحص المنتج فوراً.' : 'Report received. AI my rents will re-examine the product immediately.');
    onAddPoints(2, 'Security Audit');
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onAddPoints(POINTS_SYSTEM.SHARE, 'Content Sharing');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFav = () => {
    onToggleFavorite(item.id);
    if (!isFavorite) onAddPoints(POINTS_SYSTEM.LIKE, 'Watchlist Addition');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pt-10 pb-20 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:text-white hover:scale-105 transition-transform">
          <ArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
        <div className="flex gap-2">
          {isOwner && <button onClick={() => { if(window.confirm('Delete?')) { onDelete?.(id!); navigate('/'); } }} className="p-4 text-brand bg-brand/5 rounded-2xl hover:bg-brand hover:text-white transition-all"><Trash2 size={20} /></button>}
          <button onClick={handleReport} className="p-4 text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:text-brand transition-colors" title="Report"><Flag size={20} /></button>
          <button onClick={handleToggleFav} className={`p-4 rounded-2xl shadow-xl transition-all ${isFavorite ? 'bg-brand text-white' : 'bg-white dark:bg-gray-800 text-gray-400'}`}>
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button onClick={handleShare} className={`p-4 rounded-2xl shadow-2xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-brand text-white shadow-brand/30'}`}>
            {copied ? <Check size={20} /> : <Share2 size={20} />}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[4rem] overflow-hidden shadow-2xl border dark:border-gray-800 grid grid-cols-1 lg:grid-cols-2">
        {/* Media Section */}
        <div className="bg-black space-y-1 overflow-y-auto max-h-[700px] scrollbar-hide">
          {item.images.map((img, i) => <img key={i} src={img} className="w-full aspect-square object-cover" />)}
          {item.video && (
             <div className="p-2 bg-gray-950">
               <video src={item.video} controls className="w-full rounded-3xl" />
             </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-12 flex flex-col">
          <div className="flex items-center gap-4 mb-10 pb-10 border-b dark:border-gray-800">
            <img src={item.ownerAvatar} className="w-16 h-16 rounded-full border-4 border-brand object-cover" />
            <div>
              <h2 className="text-xl font-black dark:text-white uppercase leading-none italic">{item.ownerName}</h2>
              <p className="text-sm font-bold text-[#CCCCCC]">@{item.ownerUsername}</p>
            </div>
            <div className="ml-auto flex items-center gap-1 px-4 py-2 rounded-full text-[10px] font-black uppercase text-green-500 bg-green-50 dark:bg-green-900/20">
              <ShieldCheck size={14} /> AI Verified
            </div>
          </div>

          <h1 className="text-4xl font-black dark:text-white mb-2 uppercase tracking-tighter italic leading-none">{item.title}</h1>
          <div className="flex gap-4 mb-8">
             <span className="text-[10px] font-black text-brand bg-brand/5 px-4 py-1.5 rounded-full uppercase tracking-widest">{item.category}</span>
             <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase"><Eye size={14} /> {item.views} {t.views}</div>
          </div>

          <div className="space-y-8 flex-1">
            <div className="cursor-pointer" onClick={() => setShowFullDesc(!showFullDesc)}>
               <h3 className="text-[10px] font-black text-brand uppercase tracking-widest mb-3 flex items-center justify-between">
                 {t.description} <span className="text-[8px] opacity-50">{showFullDesc ? 'Hide' : 'Show More'}</span>
               </h3>
               <p className={`text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium ${showFullDesc ? '' : 'line-clamp-3'}`}>
                 {item.description}
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 bg-brand/5 dark:bg-gray-800 rounded-3xl border border-brand/10">
                  <span className="text-[10px] text-gray-400 font-black block mb-2 uppercase">{t.payoutMethod}</span>
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-black dark:text-white uppercase italic">{item.payoutMethod === 'CRYPTO' ? item.cryptoCurrency : 'PayPal'}</span>
                  </div>
                  <code className="text-[9px] font-mono text-brand mt-2 block truncate opacity-60">{item.payoutAddress}</code>
               </div>
               <div className="p-5 bg-brand/5 dark:bg-gray-800 rounded-3xl border border-brand/10">
                  <span className="text-[10px] text-gray-400 font-black block mb-2 uppercase">{t.location}</span>
                  <div className="flex items-center gap-1.5 mb-1">
                     <MapPin size={14} className="text-brand" />
                     <span className="text-xs font-black dark:text-white uppercase italic">{item.location.city}</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase truncate">{item.location.district}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center gap-3">
                  <Clock size={20} className="text-brand" />
                  <div>
                    <span className="text-[10px] text-gray-400 font-black block uppercase">Rental Period</span>
                    <span className="text-xs font-black dark:text-white uppercase italic">{t.periods[item.rentalPeriod]}</span>
                  </div>
               </div>
               <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center gap-3">
                  <ShieldCheck size={20} className="text-green-500" />
                  <div>
                    <span className="text-[10px] text-gray-400 font-black block uppercase">Security Status</span>
                    <span className="text-xs font-black dark:text-white uppercase italic">Active</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t dark:border-gray-800 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-brand italic tracking-tighter">{item.price}</span>
                <span className="text-sm font-bold text-gray-400">{item.currency}</span>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total per {t.periods[item.rentalPeriod]}</span>
            </div>
            {!isOwner && (
               <div className="flex gap-2">
                 <button onClick={() => alert(lang === 'ar' ? 'السجل العام قيد المزامنة...' : 'Public Ledger syncing...')} className="p-5 bg-gray-100 dark:bg-gray-800 rounded-[2rem] text-gray-500 hover:text-brand transition-all"><MessageSquare size={24}/></button>
                 <button onClick={() => navigate(`/chat/${item.ownerId}?item=${item.id}`)} className="bg-brand text-white font-black px-12 py-5 rounded-[2.5rem] shadow-2xl shadow-brand/40 flex items-center gap-3 active:scale-95 transition-all text-sm">
                   <MessageCircle size={24} /> {lang === 'ar' ? 'استئجار وتواصل' : 'Rent & Chat'}
                 </button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
