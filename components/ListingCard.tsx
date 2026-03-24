
import React, { useState } from 'react';
import { Heart, MapPin, Eye, Share2, MessageCircle, Trash2, ShieldCheck, PlayCircle, MessageSquare, Check, GlobeLock } from 'lucide-react';
import { Listing } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { translations } from '../i18n';
import { POINTS_SYSTEM } from '../constants';

interface ListingCardProps {
  listing: Listing;
  lang: string;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
  onAddPoints?: (a: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, lang, isOwner, onDelete, onAddPoints, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const t = translations[lang] || translations['en'];
  const [copied, setCopied] = useState(false);
  
  const [views, setViews] = useState(() => {
    const key = `views_${listing.id}`;
    return parseInt(localStorage.getItem(key) || '0') + listing.views;
  });

  const incrementViews = () => {
    const key = `views_${listing.id}`;
    const newViews = views + 1;
    setViews(newViews);
    localStorage.setItem(key, newViews.toString());
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    onToggleFavorite?.(listing.id);
    if (!isFavorite) onAddPoints?.(POINTS_SYSTEM.LIKE);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    const shareUrl = `${window.location.origin}/#/item/${listing.id}`;
    if (navigator.share) {
      navigator.share({ title: listing.title, url: shareUrl }).catch(() => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    onAddPoints?.(POINTS_SYSTEM.SHARE);
  };

  const handleCommentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/item/${listing.id}`);
    setTimeout(() => alert(lang === 'ar' ? 'السجل العام قيد المزامنة...' : 'Public Ledger syncing...'), 500);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-brand/5 dark:border-gray-800 flex flex-col h-full group">
      {/* Header with User Info */}
      <div className="p-4 flex items-center justify-between border-b border-brand/5 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <img src={listing.ownerAvatar} className="w-9 h-9 rounded-full border-2 border-brand/20 object-cover" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black dark:text-white uppercase leading-none">{listing.ownerName}</span>
            <span className="text-[9px] font-bold text-brand/40">@{listing.ownerUsername}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={handleFavorite} className={`p-2 rounded-xl transition-all ${isFavorite ? 'text-white bg-brand shadow-lg' : 'text-brand/40 hover:text-brand bg-brand/5'}`}>
             <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          {isOwner && (
            <button onClick={(e) => { e.preventDefault(); onDelete?.(listing.id); }} className="p-2 text-brand bg-brand/5 rounded-xl hover:bg-brand hover:text-white transition-all">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <Link to={`/item/${listing.id}`} onClick={incrementViews} className="block px-3 pt-3">
        <div className="aspect-square overflow-hidden rounded-[2rem] relative bg-brand/5">
          <img src={listing.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          {listing.video && <div className="absolute top-4 left-4 bg-brand text-white p-2 rounded-xl shadow-lg"><PlayCircle size={16} /></div>}
          
          {/* Internal Only Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-brand px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[8px] font-black uppercase shadow-xl border border-brand/10">
             <GlobeLock size={12} /> INTERNAL
          </div>

          <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-gray-900/95 px-4 py-2 rounded-2xl shadow-xl flex flex-col items-center border border-brand/10">
             <span className="text-xs font-black text-brand italic tracking-tighter">{listing.price} {listing.currency}</span>
             <span className="text-[6px] font-black text-brand/40 uppercase">{t.periods[listing.rentalPeriod]}</span>
          </div>
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-black dark:text-white uppercase text-xs truncate max-w-[140px] tracking-tighter italic">{listing.title}</h3>
          <span className="text-[7px] font-black text-brand bg-brand/5 px-2 py-1 rounded-lg uppercase">{listing.category}</span>
        </div>

        <div className="flex items-center gap-1 text-brand/40 text-[8px] font-black uppercase mb-4">
          <MapPin size={10} className="text-brand" /> {listing.location.city}, {listing.location.district}
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-brand/5 dark:border-gray-800">
          <button onClick={handleCommentsClick} className="flex flex-col items-center gap-1 text-brand/40 hover:text-brand transition-colors">
            <MessageSquare size={16} />
            <span className="text-[7px] font-black uppercase">{t.comments || 'Comments'}</span>
          </button>
          <button onClick={handleShare} className={`flex flex-col items-center gap-1 transition-all ${copied ? 'text-green-500' : 'text-brand/40 hover:text-brand'}`}>
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span className="text-[7px] font-black uppercase">{copied ? 'Copied' : t.share}</span>
          </button>
          <button onClick={(e) => { e.preventDefault(); navigate(`/chat/${listing.ownerId}?item=${listing.id}`); }} className="flex flex-col items-center gap-1 text-white bg-brand p-2 rounded-xl transition-all active:scale-90 shadow-lg shadow-brand/20">
            <MessageCircle size={16} />
            <span className="text-[7px] font-black uppercase">Rent & Chat</span>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-[7px] font-black uppercase pt-2 opacity-50">
           <div className="flex items-center gap-1 text-brand"><Eye size={10} /> {views} Views</div>
           <div className="text-brand flex items-center gap-1"><ShieldCheck size={10} /> AI VERIFIED</div>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
