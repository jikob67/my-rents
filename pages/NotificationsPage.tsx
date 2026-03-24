
import React from 'react';
import { translations } from '../i18n';
import { Bell, ArrowLeft, Heart, MessageCircle, Star, Package, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationsPageProps {
  lang: string;
  notifications: any[];
  onClear: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ lang, notifications, onClear }) => {
  const t = translations[lang] || translations['en'];
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'LIKE': return <Heart className="text-red-500" size={18} />;
      case 'MESSAGE': return <MessageCircle className="text-brand" size={18} />;
      case 'RENTAL': return <Package className="text-blue-500" size={18} />;
      case 'RATE': return <Star className="text-yellow-500" size={18} />;
      default: return <Bell className="text-gray-400" size={18} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pt-10 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:text-white">
            <ArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
          </button>
          <h1 className="text-2xl font-black dark:text-white uppercase tracking-tighter italic">{t.notifications}</h1>
        </div>
        {notifications.length > 0 && (
          <button onClick={onClear} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-colors">
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-4 border dark:border-gray-800 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-32 text-center opacity-20 flex flex-col items-center">
            <Bell size={64} className="mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">{t.noNotifications}</p>
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-800">
            {notifications.map((n, i) => (
              <div key={i} className="p-6 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0 shadow-sm">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                   <p className="text-sm font-bold dark:text-white mb-1 leading-snug">{n.text}</p>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{new Date(n.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                </div>
                {n.image && (
                  <img src={n.image} className="w-10 h-10 rounded-lg object-cover ml-auto" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
