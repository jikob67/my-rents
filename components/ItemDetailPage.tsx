
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { translations } from '../i18n';
import { MapPin, Star, Share2, Heart, MessageCircle, ArrowLeft, Copy, Send, ExternalLink, Flag, Info, Eye, ShieldCheck, Clock } from 'lucide-react';

const ItemDetailPage: React.FC<{ lang: string }> = ({ lang }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = translations[lang] || translations['en'];
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const isRtl = lang === 'ar';

  // State to simulate real views count
  const [viewCount] = useState(Math.floor(Math.random() * 500) + 120);

  // Mock item for display
  const item = {
    id,
    title: 'Professional Photography Rig',
    description: 'A complete kit for professional videography and cinema. Includes 4K camera, tripod, and external lighting. Only for rental in local area.',
    price: 120,
    currency: 'USD',
    currencyType: 'CRYPTO',
    payoutAddress: '0xC5BC11e...8C50 (Solana)',
    rating: 4.9,
    reviews: 8,
    location: { address: 'Riyadh, Financial District', lat: 24.7, lng: 46.6 },
    owner: { name: 'Khalid Al-Saud', username: 'khalid_rigs', avatar: '', id: 'o1' },
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200'],
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    rentalPeriod: 'DAY',
    category: 'Cameras'
  };

  const handleReport = () => {
    alert(lang === 'ar' ? 'تم إرسال بلاغك لنظام AI my rents للفحص وإعادة التقييم.' : 'Report sent to AI my rents for re-evaluation.');
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(t.linkCopied || 'Link Copied!');
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm dark:text-white hover:scale-105 transition-transform">
          <ArrowLeft size={24} className={isRtl ? 'rotate-180' : ''} />
        </button>
        <div className="flex gap-2">
          <button onClick={handleReport} className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-2xl hover:scale-105 transition-transform" title={t.report}>
            <Flag size={20} />
          </button>
          <button onClick={() => setShowShareMenu(true)} className="p-3 bg-brand text-white rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-brand/20">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Media Slider */}
          <div className="bg-black space-y-1">
            {item.images.map((img, i) => <img key={i} src={img} className="w-full aspect-square object-cover" alt={`Item ${i}`} />)}
            {item.video && (
              <div className="p-1 bg-gray-950">
                 <video src={item.video} controls className="w-full aspect-video rounded-xl" />
              </div>
            )}
          </div>

          <div className="p-10 flex flex-col">
            {/* User Info #CCCCCC */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b dark:border-gray-800">
               <div className="w-14 h-14 rounded-full border-2 border-brand overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.owner.username}`} className="w-full h-full object-cover" />
               </div>
               <div>
                  <h2 className="font-bold text-lg dark:text-white leading-tight">{item.owner.name}</h2>
                  <p className="text-sm font-medium text-[#CCCCCC]">@{item.owner.username}</p>
               </div>
               <div className="ml-auto flex items-center gap-1 text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                 <ShieldCheck size={12} /> AI Verified
               </div>
            </div>

            <div className="flex justify-between items-start mb-2">
              <h1 className="text-4xl font-black dark:text-white leading-tight">{item.title}</h1>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                   <Star size={16} fill="currentColor" />
                   <span className="font-bold text-lg">{item.rating}</span>
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.reviews} Reviews</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 text-xs font-bold uppercase text-gray-400">
               <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                  <Eye size={14} className="text-brand" /> {viewCount} {t.views}
               </div>
               <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                  <Info size={14} className="text-brand" /> {item.category}
               </div>
               <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                  <Clock size={14} className="text-brand" /> {t.periods[item.rentalPeriod]}
               </div>
            </div>

            <div className="space-y-6 mb-10 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
               <div>
                  <h3 className="font-bold text-xs text-brand uppercase tracking-widest mb-2">{t.description}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <h3 className="font-bold text-[10px] text-gray-400 uppercase mb-1">{t.payoutMethod}</h3>
                    <p className="font-bold dark:text-white text-xs">{item.currencyType === 'CRYPTO' ? 'Crypto Payment' : 'Local Currency'}</p>
                    <code className="text-[10px] text-brand block truncate mt-1">{item.payoutAddress}</code>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <h3 className="font-bold text-[10px] text-gray-400 uppercase mb-1">{t.location}</h3>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-brand" />
                      <span className="text-[10px] font-bold dark:text-white truncate">{item.location.address}</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="mt-auto pt-6 border-t dark:border-gray-800 grid grid-cols-2 gap-4">
               <div className="flex flex-col justify-center">
                  <div className="flex items-baseline gap-1">
                     <span className="text-3xl font-black text-brand">{item.price}</span>
                     <span className="text-sm font-bold text-gray-400">{item.currency}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{t.periods[item.rentalPeriod]} Rent</p>
               </div>
               <button onClick={() => navigate(`/chat/${item.owner.id}`)} className="bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all py-4">
                  <MessageCircle size={22} /> {t.rent}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareMenu && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-black mb-6 dark:text-white text-center">{t.share}</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <button onClick={copyUrl} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl flex flex-col items-center gap-2 font-bold dark:text-white">
                    <Copy className="text-brand" /> Link
                 </button>
                 <button className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl flex flex-col items-center gap-2 font-bold dark:text-white">
                    <Send className="text-blue-500" /> WhatsApp
                 </button>
              </div>
              <button onClick={() => setShowShareMenu(false)} className="w-full py-4 text-gray-400 font-bold">{t.back}</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;
