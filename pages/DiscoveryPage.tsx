
import React, { useState } from 'react';
import { translations } from '../i18n';
import { Search, MapPin, Sparkles, Loader2, Globe, ArrowUpRight, Navigation } from 'lucide-react';
import { getDiscoveryInsights } from '../services/geminiService';

const DiscoveryPage: React.FC<{ lang: string; user: any }> = ({ lang, user }) => {
  const t = translations[lang] || translations['en'];
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ text: string, links: any[] } | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const locationStr = user.location?.address || "Nearby";
    const data = await getDiscoveryInsights(locationStr, query);
    setResults(data);
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 pt-10 pb-24 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          <Sparkles size={14} /> AI POWERED DISCOVERY
        </div>
        <h1 className="text-4xl md:text-5xl font-black dark:text-white uppercase tracking-tighter italic leading-none mb-4">
          {lang === 'ar' ? 'اكتشف ما يحيط بك' : 'Explore Your Surroundings'}
        </h1>
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <MapPin size={16} className="text-brand" /> {user.location?.address}
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size={24} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ماذا تريد أن تستأجر اليوم؟ (مثلاً: كاميرا سوني، أدوات بناء...)' : 'What do you want to rent? (e.g. Sony Camera, Tools...)'} 
            className="w-full pl-16 pr-24 py-6 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] outline-none focus:border-brand font-bold shadow-xl transition-all" 
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand text-white px-8 py-3.5 rounded-[2rem] font-black uppercase text-[10px] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : (lang === 'ar' ? 'بحث ذكي' : 'AI SEARCH')}
          </button>
        </form>
      </div>

      {results && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border-2 border-brand/10 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center">
                   <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter italic">{lang === 'ar' ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}</h2>
             </div>
             <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-10 whitespace-pre-wrap">
               {results.text}
             </div>

             {results.links && results.links.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t dark:border-gray-800">
                  {results.links.map((chunk: any, i: number) => {
                    const place = chunk.maps || chunk.web;
                    if (!place) return null;
                    return (
                      <a key={i} href={place.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-brand/5 group transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white dark:bg-gray-950 rounded-xl flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                               <Navigation size={24} />
                            </div>
                            <div>
                               <p className="text-xs font-black dark:text-white uppercase truncate max-w-[200px]">{place.title || "View on Map"}</p>
                               <p className="text-[9px] text-gray-400 font-bold uppercase">Google Maps Grounding</p>
                            </div>
                         </div>
                         <ArrowUpRight size={20} className="text-gray-300 group-hover:text-brand" />
                      </a>
                    );
                  })}
               </div>
             )}
          </div>
        </div>
      )}

      {!results && !isLoading && (
        <div className="py-20 text-center opacity-10 flex flex-col items-center">
           <Globe size={100} className="text-brand mb-6" />
           <p className="text-xs font-black uppercase tracking-[0.5em]">{lang === 'ar' ? 'ابدأ البحث الآن' : 'Start your search now'}</p>
        </div>
      )}
    </div>
  );
};

export default DiscoveryPage;
