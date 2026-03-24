
import React from 'react';
import { translations } from '../i18n';
import { ShieldBan, ArrowLeft, UserX, Ghost } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BlockedUsersPageProps {
  lang: string;
  user: any;
  onUnblock: (id: string) => void;
}

const BlockedUsersPage: React.FC<BlockedUsersPageProps> = ({ lang, user, onUnblock }) => {
  const t = translations[lang] || translations['en'];
  const navigate = useNavigate();
  const blockedList = user?.blockedUsers || [];

  return (
    <div className="max-w-2xl mx-auto p-6 pt-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:text-white hover:scale-105 transition-transform">
          <ArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
        <div>
          <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter italic">{t.blockedUsers}</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manage Privacy & Restrictions</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] p-10 border dark:border-gray-800 shadow-2xl">
        {blockedList.length === 0 ? (
          <div className="py-32 text-center opacity-10 flex flex-col items-center">
            <Ghost size={80} className="mb-6 text-brand" />
            <h3 className="text-xl font-black uppercase dark:text-white">Clean List</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2">No accounts are currently blocked</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blockedList.map((id: string) => (
              <div key={id} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border dark:border-gray-700 hover:border-brand transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <ShieldBan size={28} />
                  </div>
                  <div>
                    <p className="text-xs font-black dark:text-white uppercase italic tracking-tighter">Verified User Account</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">ID: {id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onUnblock(id)}
                  className="px-6 py-3 bg-brand/10 text-brand rounded-2xl font-black text-[10px] uppercase hover:bg-brand hover:text-white transition-all shadow-sm active:scale-95"
                >
                  {t.unblock}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedUsersPage;
