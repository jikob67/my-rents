
import React, { useState } from 'react';
import { Camera, MapPin, Mail, Lock, User as UserIcon, ShieldCheck, Loader2, Navigation, CheckCircle2, Wallet, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n';
import { Gender, User, LocationDetail, PayoutMethods } from '../types';
import { reverseGeocode } from '../services/locationService';

interface SignUpPageProps {
  lang: string;
  onSignUp: (user: User) => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ lang, onSignUp }) => {
  const t = translations[lang] || translations['en'];
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showPayouts, setShowPayouts] = useState(false);
  
  const [formData, setFormData] = useState({
    avatar: '',
    fullName: '',
    username: '',
    email: '',
    password: '',
    location: null as LocationDetail | null,
    payoutMethods: {
      paypal: '',
      solana: '',
      ethereum: ''
    } as PayoutMethods,
    agreed: false
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const details = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setFormData({
          ...formData,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: details.address || '',
            country: details.country || '',
            city: details.city || '',
            district: details.district || ''
          }
        });
        setIsLocating(false);
      }, () => {
        alert(lang === 'ar' ? 'يرجى تفعيل صلاحية الوصول للموقع' : 'Please enable location access');
        setIsLocating(false);
      });
    }
  };

  const isFormValid = formData.avatar && formData.fullName && formData.username && formData.email && formData.password && formData.location && formData.agreed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: 'u_' + Date.now(),
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        avatar: formData.avatar,
        gender: Gender.OTHER,
        birthDate: '',
        location: formData.location!,
        status: 'Active',
        points: 100,
        listingsCount: 0,
        walletBalance: 0,
        currencyPreference: 'USD',
        trustScore: 90,
        badges: ['New User'],
        payoutMethods: formData.payoutMethods,
        blockedUsers: [],
        isVerified: true
      };
      onSignUp(newUser);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 py-20">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-[3.5rem] p-10 shadow-2xl border dark:border-gray-800 animate-in zoom-in-95">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-brand italic tracking-tighter mb-2">my rents</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ar' ? 'إنشاء حساب حقيقي وموثق' : 'Create Real Verified Account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <label className="w-28 h-28 rounded-[2rem] bg-gray-50 dark:bg-gray-800 border-4 border-dashed border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center cursor-pointer hover:border-brand transition-all relative shadow-inner">
              {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" /> : <Camera size={32} className="text-gray-300" />}
              <input type="file" accept="image/*" required className="hidden" onChange={handleImageUpload} />
            </label>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ar' ? 'الصورة الشخصية (مطلوبة)*' : 'Profile Picture (Required)*'}</span>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" required placeholder={t.fullName + '*'} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none font-bold border-2 border-transparent focus:border-brand shadow-inner" />
            </div>

            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
              <input type="text" required placeholder={t.username + '*'} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none font-bold border-2 border-transparent focus:border-brand shadow-inner" />
            </div>

            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" required placeholder={t.email + '*'} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none font-bold border-2 border-transparent focus:border-brand shadow-inner" />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="password" required placeholder={t.password + '*'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none font-bold border-2 border-transparent focus:border-brand shadow-inner" />
            </div>

            <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
               <button type="button" onClick={handleGetLocation} className="w-full flex items-center justify-between group">
                  <div className="flex items-center gap-4 text-left">
                     <div className={`p-3 rounded-2xl transition-all ${formData.location ? 'bg-brand text-white shadow-lg' : 'bg-white dark:bg-gray-900 text-gray-400 group-hover:text-brand'}`}>
                        {isLocating ? <Loader2 className="animate-spin" size={24} /> : <MapPin size={24} />}
                     </div>
                     <div>
                        <p className="text-[10px] font-black dark:text-white uppercase tracking-widest">{lang === 'ar' ? 'استخراج بيانات الموقع (مطلوب)*' : 'Extract Location Data (Required)*'}</p>
                        {formData.location ? (
                          <div className="text-[9px] font-black text-brand uppercase mt-1 animate-in slide-in-from-left">
                             {formData.location.country} • {formData.location.city}
                          </div>
                        ) : (
                          <p className="text-[8px] text-gray-400 font-bold uppercase">{lang === 'ar' ? 'اضغط للبدء بالفحص الجغرافي' : 'Tap to start geo-extraction'}</p>
                        )}
                     </div>
                  </div>
                  {formData.location && <CheckCircle2 className="text-brand" size={20} />}
               </button>
            </div>

            {/* Dedicated Payout Section in Sign Up */}
            <div className="border-2 border-brand/5 rounded-[2rem] overflow-hidden">
               <button 
                  type="button" 
                  onClick={() => setShowPayouts(!showPayouts)}
                  className="w-full p-5 flex items-center justify-between bg-brand/5 text-brand"
               >
                  <div className="flex items-center gap-3">
                     <Wallet size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'ar' ? 'وسائل استلام الأرباح (اختياري)' : 'Payout Methods (Optional)'}</span>
                  </div>
                  {showPayouts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
               </button>
               {showPayouts && (
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 space-y-4 animate-in slide-in-from-top-2">
                     <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                           type="email" 
                           placeholder="PayPal Email Address" 
                           value={formData.payoutMethods.paypal || ''}
                           onChange={e => setFormData({...formData, payoutMethods: {...formData.payoutMethods, paypal: e.target.value}})}
                           className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 dark:text-white outline-none text-xs font-bold border border-transparent focus:border-brand"
                        />
                     </div>
                     <div className="relative">
                        <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                           type="text" 
                           placeholder="Solana Wallet (SOL)" 
                           value={formData.payoutMethods.solana || ''}
                           onChange={e => setFormData({...formData, payoutMethods: {...formData.payoutMethods, solana: e.target.value}})}
                           className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 dark:text-white outline-none text-xs font-mono border border-transparent focus:border-brand"
                        />
                     </div>
                     <p className="text-[8px] text-gray-400 font-bold text-center uppercase">{lang === 'ar' ? 'يمكنك إكمال بقية المحافظ لاحقاً من الإعدادات' : 'You can complete other wallets later in settings'}</p>
                  </div>
               )}
            </div>

            <div className="flex items-start gap-3 p-5 bg-brand/5 rounded-2xl border border-brand/10">
              <input type="checkbox" id="agreed" checked={formData.agreed} onChange={e => setFormData({...formData, agreed: e.target.checked})} className="mt-1 accent-brand w-5 h-5 cursor-pointer" />
              <label htmlFor="agreed" className="text-[10px] font-bold text-gray-500 uppercase leading-tight cursor-pointer">
                {t.acceptTerms}*
                <div className="flex gap-4 mt-2">
                   <Link to="/privacy" className="text-brand underline">{t.privacyPolicy}</Link>
                   <Link to="/terms" className="text-brand underline">{t.termsOfUse}</Link>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" disabled={!isFormValid || loading} className="w-full py-6 bg-brand text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl shadow-brand/30 transition-all active:scale-95 disabled:opacity-30">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : (lang === 'ar' ? 'إطلاق حسابي الفعلي' : 'Launch My Real Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
