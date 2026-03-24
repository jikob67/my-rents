
import React, { useState } from 'react';
import { translations } from '../i18n';
import { User, PayoutMethods } from '../types';
import { 
  ArrowLeft, Camera, MapPin, Navigation, Edit3, Save, 
  CreditCard, Wallet, ShieldCheck, Globe, Loader2, CheckCircle2, Circle, Mail, Coins, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CURRENCIES } from '../constants';

interface SettingsPageProps {
  lang: string;
  user: User;
  onUpdate: (user: User) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ lang, user, onUpdate }) => {
  const t = translations[lang] || translations['en'];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isManualLocation, setIsManualLocation] = useState(false);
  
  const [formData, setFormData] = useState<User>({
    ...user,
    payoutMethods: user.payoutMethods || {}
  });

  const [manualAddress, setManualAddress] = useState(user.location.address);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const updatePayout = (method: keyof PayoutMethods, value: string) => {
    setFormData({
      ...formData,
      payoutMethods: { ...formData.payoutMethods, [method]: value }
    });
  };

  const handleSave = () => {
    setLoading(true);
    const updatedUser: User = {
      ...formData,
      location: isManualLocation 
        ? { ...formData.location, address: manualAddress } 
        : formData.location
    };
    
    setTimeout(() => {
      onUpdate(updatedUser);
      setLoading(false);
      alert(lang === 'ar' ? 'تم حفظ التعديلات والبيانات المالية بنجاح!' : 'Settings and financial data saved successfully!');
    }, 1200);
  };

  const cryptoOptions = [
    { key: 'solana', label: 'Solana (SOL)', color: 'text-purple-500' },
    { key: 'ethereum', label: 'Ethereum (ETH)', color: 'text-blue-500' },
    { key: 'bitcoin', label: 'Bitcoin (BTC)', color: 'text-orange-500' },
    { key: 'polygon', label: 'Polygon (MATIC)', color: 'text-indigo-500' },
    { key: 'base', label: 'Base L2', color: 'text-blue-600' },
    { key: 'sui', label: 'Sui Network', color: 'text-cyan-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 pt-10 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:text-white hover:scale-105 transition-transform">
          <ArrowLeft className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
        <div>
          <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter italic">{t.settings}</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ar' ? 'إدارة الهوية والبيانات المالية' : 'Identity & Financial Management'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 border dark:border-gray-800 shadow-xl">
            <div className="flex flex-col items-center mb-8">
              <label className="w-28 h-28 rounded-[2rem] bg-gray-50 dark:bg-gray-800 border-4 border-brand/20 overflow-hidden flex items-center justify-center cursor-pointer group relative shadow-inner mb-4">
                <img src={formData.avatar} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                <Camera className="absolute opacity-0 group-hover:opacity-100 text-brand" size={24} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <h2 className="text-xl font-black dark:text-white uppercase italic tracking-tighter">{formData.fullName}</h2>
              <span className="text-[10px] font-black text-brand bg-brand/5 px-3 py-1 rounded-full uppercase mt-2">Verified User</span>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1 px-2">Display Name</label>
                  <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white font-bold outline-none border-2 border-transparent focus:border-brand" />
               </div>
               <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1 px-2">Preferred Currency</label>
                  <select value={formData.currencyPreference} onChange={e => setFormData({...formData, currencyPreference: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white font-bold outline-none border-2 border-transparent focus:border-brand appearance-none">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label} ({c.symbol})</option>)}
                  </select>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 border dark:border-gray-800 shadow-xl">
            <h3 className="text-sm font-black text-brand uppercase mb-6 italic flex items-center gap-2"><MapPin size={18}/> {t.location}</h3>
            <div className="space-y-4">
               <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Current Geo-Address</p>
                  <p className="text-xs font-bold dark:text-white leading-tight">{formData.location.address}</p>
               </div>
               <button 
                  onClick={() => {
                    setIsLocating(true);
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setFormData({ ...formData, location: { ...formData.location, lat: pos.coords.latitude, lng: pos.coords.longitude, address: 'Updated GPS Location' }});
                      setIsLocating(false);
                    });
                  }}
                  className="w-full py-3 bg-brand/5 text-brand rounded-xl font-black text-[9px] uppercase flex items-center justify-center gap-2 hover:bg-brand hover:text-white transition-all"
               >
                  {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />} Update from GPS
               </button>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Payouts */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 border dark:border-gray-800 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Coins size={200} />
             </div>

             <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-2xl font-black text-brand uppercase tracking-tighter italic flex items-center gap-3">
                      <Wallet size={28}/> {lang === 'ar' ? 'وسائل استلام الأرباح' : 'Payout Methods'}
                   </h3>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{lang === 'ar' ? 'أدخل بياناتك المالية لاستلام أموال التأجير' : 'Enter your financial details to receive rental funds'}</p>
                </div>
             </div>

             <div className="space-y-10">
                {/* PayPal Section */}
                <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2.5rem] border-2 border-blue-100 dark:border-blue-900/20">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                            <CreditCard size={24} />
                         </div>
                         <div>
                            <h4 className="font-black text-sm dark:text-white uppercase italic">PayPal Account</h4>
                            <p className="text-[8px] font-black text-gray-400 uppercase">Universal Fiat Payouts</p>
                         </div>
                      </div>
                      {formData.payoutMethods.paypal && <CheckCircle2 size={20} className="text-blue-500" />}
                   </div>
                   <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                      <input 
                        type="email" 
                        value={formData.payoutMethods.paypal || ''}
                        onChange={(e) => updatePayout('paypal', e.target.value)}
                        placeholder="your-email@paypal.com"
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white dark:bg-gray-900 dark:text-white font-bold outline-none border-2 border-blue-500/10 focus:border-blue-500 shadow-sm"
                      />
                   </div>
                </div>

                {/* Crypto Section */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 px-2">
                      <Coins className="text-brand" size={24} />
                      <h4 className="font-black text-sm dark:text-white uppercase tracking-tighter italic">{lang === 'ar' ? 'عناوين المحافظ الرقمية' : 'Digital Wallet Addresses'}</h4>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cryptoOptions.map(opt => {
                        const val = formData.payoutMethods[opt.key as keyof PayoutMethods];
                        const isActive = !!(val && val.trim());
                        return (
                          <div key={opt.key} className={`p-6 rounded-[2rem] border-2 transition-all ${isActive ? 'border-brand bg-brand/5 shadow-inner' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50'}`}>
                             <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] font-black uppercase ${opt.color}`}>{opt.label}</span>
                                {isActive ? <CheckCircle2 size={16} className="text-brand" /> : <Circle size={16} className="text-gray-200" />}
                             </div>
                             <input 
                                type="text" 
                                value={val || ''}
                                onChange={(e) => updatePayout(opt.key as keyof PayoutMethods, e.target.value)}
                                placeholder={lang === 'ar' ? 'أدخل العنوان هنا...' : 'Enter address...'}
                                className="w-full bg-white dark:bg-gray-900 p-3.5 rounded-xl text-[9px] font-mono font-bold outline-none border border-transparent focus:border-brand dark:text-white"
                             />
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
          </div>

          <button onClick={handleSave} disabled={loading} className="w-full py-6 bg-brand text-white rounded-[2.5rem] font-black uppercase shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            {lang === 'ar' ? 'حفظ كافة البيانات المالية' : 'Save All Financial Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
