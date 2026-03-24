
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import { User, Listing, GroupChat } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import ItemDetailPage from './pages/ItemDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import ChatPage from './pages/ChatPage';
import DiscoveryPage from './pages/DiscoveryPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import SubscriptionPage from './pages/SubscriptionPage';
import ProfessionalDashboardPage from './pages/ProfessionalDashboardPage';
import BlockedUsersPage from './pages/BlockedUsersPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import MyRentalsPage from './pages/MyRentalsPage';
import FavoritesPage from './pages/FavoritesPage';
import WalletPage from './pages/WalletPage';
import { translations } from './i18n';
import { ShieldCheck, ShieldBan, Settings, Bell, Package, Sparkles, MessageSquare, Heart, Wallet } from 'lucide-react';
import SupportAI from './components/SupportAI';

const App: React.FC = () => {
  const [lang, setLang] = useState<string>(() => localStorage.getItem('my_rents_lang') || 'ar');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('my_rents_theme') === 'dark');
  const [isAiSupportOpen, setIsAiSupportOpen] = useState(false);
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('my_rents_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  
  const [allListings, setAllListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('my_rents_listings');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('my_rents_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [pointHistory, setPointHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('my_rents_points_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [groups, setGroups] = useState<GroupChat[]>(() => {
    try {
      const saved = localStorage.getItem('my_rents_groups');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [notifications, setNotifications] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('my_rents_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    localStorage.setItem('my_rents_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('my_rents_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    if (user) localStorage.setItem('my_rents_user', JSON.stringify(user));
    else localStorage.removeItem('my_rents_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('my_rents_listings', JSON.stringify(allListings));
  }, [allListings]);

  useEffect(() => {
    localStorage.setItem('my_rents_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('my_rents_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('my_rents_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('my_rents_points_history', JSON.stringify(pointHistory));
  }, [pointHistory]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const t = translations[lang] || translations['en'];

  const addPoints = (amount: number, reason: string) => {
    setUser(prev => prev ? { ...prev, points: prev.points + amount } : null);
    setPointHistory(prev => [{
      id: Date.now(),
      amount,
      reason,
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const handleCurrencyChange = (code: string) => {
    setUser(prev => prev ? { ...prev, currencyPreference: code } : null);
  };

  const handleBlockUser = (otherId: string) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, blockedUsers: [...(prev.blockedUsers || []), otherId] } : null);
  };

  const handleUnblockUser = (otherId: string) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, blockedUsers: (prev.blockedUsers || []).filter(id => id !== otherId) } : null);
  };

  const handleSignUp = (newUser: User) => {
    setUser(newUser);
  };

  const handleCreateGroup = (newGroup: GroupChat) => {
    setGroups(prev => [...prev, newGroup]);
  };

  const handleListingCreated = (newListing: Listing) => {
    setAllListings(prev => [newListing, ...prev]);
    // Fix: Ensure user count is updated to reflect the new listing
    setUser(prev => prev ? { ...prev, listingsCount: (prev.listingsCount || 0) + 1 } : null);
    addPoints(50, 'Listing Created');
    
    // Add internal notification
    const newNotif = {
      type: 'RENTAL',
      text: lang === 'ar' ? `تم نشر "${newListing.title}" في الشبكة الداخلية بنجاح!` : `"${newListing.title}" published to internal network!`,
      timestamp: new Date().toISOString(),
      image: newListing.images[0]
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const ProfileView = () => {
    const { username } = useParams<{ username?: string }>();
    const isSelf = !username || (user && username === user.username);
    const displayUser = isSelf ? user : null; 
    const userSpecificListings = allListings.filter(l => l.ownerUsername === (username || user?.username));
    
    return (
      <div className="p-4 sm:p-8 text-center max-w-4xl mx-auto animate-in fade-in">
        <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] p-6 sm:p-10 shadow-sm border dark:border-gray-800 relative overflow-hidden">
          <div className="relative inline-block mb-6">
            <img src={displayUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || user?.username}`} className="w-24 h-24 sm:w-32 h-32 rounded-full border-4 border-brand object-cover shadow-2xl" />
            <div className="absolute -bottom-1 -right-1 bg-brand text-white p-1.5 rounded-xl shadow-lg border-2 border-white dark:border-gray-900">
              <ShieldCheck size={16} fill="currentColor" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black dark:text-white uppercase tracking-tighter mb-1 italic">{displayUser?.fullName || username || user?.fullName}</h1>
          <p className="text-[#CCCCCC] mb-6 font-bold text-sm">@{username || user?.username}</p>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {isSelf && (
              <>
                <Link to="/settings" className="py-3 px-6 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <Settings size={16} /> {t.settings}
                </Link>
                <Link to="/my-rentals" className="py-3 px-6 bg-brand/5 text-brand rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <Package size={16} /> {t.myRentals}
                </Link>
                <Link to="/wallet" className="py-3 px-6 bg-orange-50 dark:bg-orange-900/10 text-orange-500 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <Wallet size={16} /> {t.wallet}
                </Link>
                <Link to="/favorites" className="py-3 px-6 bg-pink-50 dark:bg-pink-900/10 text-pink-500 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <Heart size={16} /> {t.favorites}
                </Link>
                <Link to="/blocked-users" className="py-3 px-6 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <ShieldBan size={16} /> {t.blockedUsers}
                </Link>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-10">
             <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] border dark:border-gray-700">
                <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Trust Score</span>
                <span className="text-2xl font-black text-brand">{isSelf ? user?.trustScore : '0'}%</span>
             </div>
             <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] border dark:border-gray-700">
                <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Points</span>
                <span className="text-2xl font-black text-brand">{isSelf ? user?.points : '0'}</span>
             </div>
          </div>

          <div className="mb-10 text-left">
            <h2 className="text-lg font-black dark:text-white uppercase tracking-tighter mb-4 px-2">Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userSpecificListings.length > 0 ? userSpecificListings.map(l => (
                <div key={l.id} className="relative group">
                   <Link to={`/item/${l.id}`} className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-[2rem] border dark:border-gray-700">
                      <img src={l.images[0]} className="w-full aspect-square object-cover rounded-[1.5rem] mb-3" />
                      <h3 className="font-black text-xs uppercase dark:text-white truncate">{l.title}</h3>
                      <p className="text-brand font-black text-sm">{l.price} {l.currency}</p>
                   </Link>
                </div>
              )) : (
                <div className="col-span-2 py-10 text-center opacity-20">
                   <p className="text-[9px] font-black uppercase">No Listings</p>
                </div>
              )}
            </div>
          </div>

          {isSelf && (
            <button onClick={() => { setUser(null); localStorage.clear(); window.location.reload(); }} className="w-full mt-2 py-4 text-red-500 font-black uppercase tracking-widest text-[10px] hover:underline">
              {t.logout}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <HashRouter>
      <div className={`min-h-screen ${lang === 'ar' ? 'rtl' : 'ltr'} bg-white dark:bg-gray-950 transition-colors duration-200 flex flex-col`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {user && <Navbar lang={lang} onLangChange={setLang} isDark={isDarkMode} toggleTheme={toggleTheme} user={user} onCurrencyChange={handleCurrencyChange} />}
        <main className={`flex-1 ${user ? 'pb-20' : ''}`}>
          <Routes>
            <Route path="/" element={!user ? <SignUpPage lang={lang} onSignUp={handleSignUp} /> : <HomePage lang={lang} user={user} userListings={allListings} onDeleteListing={(id) => setAllListings(prev => prev.filter(l => l.id !== id))} onAddPoints={addPoints} favorites={favorites} onToggleFavorite={toggleFavorite} />} />
            {user && (
              <>
                <Route path="/create" element={<CreateListingPage lang={lang} user={user} onCreated={handleListingCreated} />} />
                <Route path="/discovery" element={<DiscoveryPage lang={lang} user={user} />} />
                <Route path="/item/:id" element={<ItemDetailPage lang={lang} user={user} listings={allListings} onDelete={(id) => setAllListings(prev => prev.filter(l => l.id !== id))} onAddPoints={addPoints} favorites={favorites} onToggleFavorite={toggleFavorite} />} />
                <Route path="/profile/:username?" element={<ProfileView />} />
                <Route path="/chat/:otherId?" element={<ChatPage lang={lang} onAddPoints={addPoints} listings={allListings} user={user} onBlock={handleBlockUser} groups={groups} onCreateGroup={handleCreateGroup} />} />
                <Route path="/subscription" element={<SubscriptionPage lang={lang} user={user} onUpdateUser={setUser} />} />
                <Route path="/blocked-users" element={<BlockedUsersPage lang={lang} user={user} onUnblock={handleUnblockUser} />} />
                <Route path="/settings" element={<SettingsPage lang={lang} user={user} onUpdate={setUser} />} />
                <Route path="/notifications" element={<NotificationsPage lang={lang} notifications={notifications} onClear={() => setNotifications([])} />} />
                <Route path="/my-rentals" element={<MyRentalsPage lang={lang} user={user} listings={allListings} />} />
                <Route path="/favorites" element={<FavoritesPage lang={lang} user={user} listings={allListings} favorites={favorites} onToggleFavorite={toggleFavorite} onAddPoints={addPoints} />} />
                <Route path="/wallet" element={<WalletPage lang={lang} user={user} history={pointHistory} />} />
                <Route path="/pro-dashboard" element={user?.subscription?.tier ? <ProfessionalDashboardPage lang={lang} user={user} listings={allListings} /> : <Navigate to="/subscription" />} />
              </>
            )}
            <Route path="/privacy" element={<PrivacyPolicyPage lang={lang} />} />
            <Route path="/terms" element={<TermsOfUsePage lang={lang} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        {user && <Footer lang={lang} />}

        {user && (
          <>
            <button 
              onClick={() => setIsAiSupportOpen(true)}
              className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-brand text-white rounded-full shadow-2xl shadow-brand/40 flex items-center justify-center z-40 animate-bounce hover:scale-110 active:scale-95 transition-all"
            >
              <Sparkles size={28} />
            </button>
            {isAiSupportOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-2xl h-[600px] relative">
                  <button onClick={() => setIsAiSupportOpen(false)} className="absolute top-4 right-4 z-[110] p-2 bg-white/10 text-white rounded-full hover:bg-white/20"><MessageSquare size={20} /></button>
                  <SupportAI lang={lang as 'ar' | 'en'} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </HashRouter>
  );
};

export default App;
