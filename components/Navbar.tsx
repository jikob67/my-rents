
import React, { useState } from 'react';
import { Home, Search, PlusCircle, MessageCircle, User as UserIcon, Sun, Moon, Bell, Globe, Languages } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { translations } from '../i18n';
import { CURRENCIES } from '../constants';

interface NavbarProps {
  lang: string;
  onLangChange: (newLang: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  user: any;
  onCurrencyChange: (code: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, onLangChange, isDark, toggleTheme, user, onCurrencyChange }) => {
  const t = translations[lang] || translations['en'];
  const location = useLocation();
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const navItems = [
    { icon: <Home size={22} />, label: t.home, path: '/' },
    { icon: <Search size={22} />, label: t.discovery, path: '/discovery' },
    { icon: <PlusCircle size={28} className="text-brand" />, label: t.createListing, path: '/create' },
    { icon: <MessageCircle size={22} />, label: t.chat, path: '/chat' },
    { icon: <UserIcon size={22} />, label: t.profile, path: '/profile' },
  ];

  const handleToggleLang = () => {
    onLangChange(lang === 'ar' ? 'en' : 'ar');
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-colors shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl font-bold text-brand tracking-tighter flex items-center gap-2 group active:scale-95 transition-transform">
              <div className="px-3 h-10 bg-brand text-white rounded-xl flex items-center justify-center shadow-xl shadow-brand/20 transition-transform group-hover:rotate-1">
                <span className="text-sm font-black lowercase tracking-tighter italic">my rents</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link to="/notifications" className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-brand transition-all relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border-2 border-white dark:border-gray-900"></div>
            </Link>

            <button 
              onClick={handleToggleLang}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-500 hover:text-brand transition-all flex items-center gap-2 font-black text-[10px] uppercase group"
              title={lang === 'ar' ? 'Switch to English' : 'تغيير للغة العربية'}
            >
              <Languages size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <div className="relative">
              <button onClick={() => setShowCurrencyMenu(!showCurrencyMenu)} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-brand transition-all flex items-center gap-2 font-black text-[10px] uppercase">
                <Globe size={18} /> {user?.currencyPreference || 'USD'}
              </button>
              {showCurrencyMenu && (
                <div className="absolute top-14 right-0 w-48 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border dark:border-gray-800 p-3 z-[100] animate-in fade-in zoom-in-95">
                  {CURRENCIES.map(curr => (
                    <button 
                      key={curr.code} 
                      onClick={() => { onCurrencyChange(curr.code); setShowCurrencyMenu(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span className="text-xs font-black dark:text-white">{curr.code}</span>
                      <span className="text-[10px] font-bold text-gray-400">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleTheme} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl text-gray-400 hover:text-brand transition-all active:scale-90">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link to="/profile" className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden border-2 border-brand/20 flex items-center justify-center text-gray-400 active:scale-90 transition-all">
              {user ? (
                <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={22} />
              )}
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-gray-900/95 backdrop-blur-2xl border-t border-gray-100 dark:border-gray-800 px-8 py-3 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[2.5rem]">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center gap-1.5 transition-all active:scale-75 ${location.pathname === item.path ? 'text-brand' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <div className={`p-1 transition-transform ${location.pathname === item.path ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${location.pathname === item.path ? 'opacity-100' : 'opacity-40'}`}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
