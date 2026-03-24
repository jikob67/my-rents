
import React, { useState } from 'react';
import { translations } from '../i18n';
import { PLANS, WALLETS } from '../constants';
// Added Loader2 to the imports
import { ChevronLeft, Wallet, Copy, ShieldCheck, Zap, ArrowRight, CreditCard, Key, CheckCircle, Info, Sparkles, Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionPageProps {
  lang: string;
  user: any;
  onUpdateUser: (userData: any) => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ lang, user, onUpdateUser }) => {
  const t = translations[lang] || translations['en'];
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [userWallet, setUserWallet] = useState('');
  const [txHash, setTxHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const subSteps = t.subSteps;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(lang === 'ar' ? 'تم نسخ العنوان!' : 'Address Copied!');
  };

  const validateStep = () => {
    if (step === 1 && !selectedPlan) return false;
    if (step === 2 && !selectedWallet) return false;
    if (step === 3 && !userWallet.trim()) return false;
    if (step === 4 && !txHash.trim()) return false;
    return true;
  };

  const handleFinalize = () => {
    if (!txHash.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      const updatedUser = {
        ...user,
        subscription: {
          tier: selectedPlan.name,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      };
      onUpdateUser(updatedUser);
      setStep(5);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pt-10 pb-24 animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-16">
        <div className="flex gap-3 mb-8">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`h-2 rounded-full transition-all duration-700 ${step >= s ? 'w-16 bg-brand shadow-lg shadow-brand/20' : 'w-10 bg-gray-100 dark:bg-gray-800'}`} />
          ))}
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter italic mb-2">{subSteps[step-1]}</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{lang === 'ar' ? 'اختر مستقبل إيجاراتك' : 'Choose the future of your rentals'}</p>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-12 animate-in slide-in-from-bottom-8">
          <div className="flex justify-center p-1.5 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] w-fit mx-auto shadow-inner">
            {['daily', 'monthly', 'yearly'].map(p => (
              <button key={p} onClick={() => setSelectedPeriod(p as any)} className={`px-10 py-3 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${selectedPeriod === p ? 'bg-white dark:bg-gray-900 text-brand shadow-xl scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
                {t.periods[p.toUpperCase()]}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map(plan => {
              const price = plan.pricing[selectedPeriod];
              return (
                <div 
                  key={plan.id} 
                  onClick={() => setSelectedPlan(plan)} 
                  className={`p-10 rounded-[4rem] border-4 transition-all duration-500 cursor-pointer flex flex-col relative group ${selectedPlan?.id === plan.id ? 'border-brand bg-white dark:bg-gray-900 shadow-2xl scale-105 z-10' : 'border-transparent bg-gray-50 dark:bg-gray-800 opacity-60 hover:opacity-100'}`}
                >
                  {plan.isSpecial && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand text-white px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                       <Sparkles size={12} /> Recommended
                    </div>
                  )}
                  
                  <div className="text-center mb-10">
                    <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter italic mb-4">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-black text-brand italic">${price}</span>
                      <span className="text-xs font-bold text-gray-400">/{selectedPeriod.slice(0, 3)}</span>
                    </div>
                  </div>

                  <ul className="space-y-5 mb-10 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-[10px] font-black uppercase text-gray-500 flex items-start gap-3 leading-tight">
                        <CheckCircle size={14} className="text-brand mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] transition-all ${selectedPlan?.id === plan.id ? 'bg-brand text-white shadow-xl shadow-brand/30' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    {selectedPlan?.id === plan.id ? 'Selected Plan' : 'Choose Plan'}
                  </button>
                </div>
              );
            })}
          </div>

          <button onClick={() => validateStep() && setStep(2)} disabled={!selectedPlan} className="w-full max-w-xl mx-auto block py-6 bg-brand text-white rounded-[2.5rem] font-black uppercase shadow-2xl shadow-brand/40 disabled:opacity-30 active:scale-95 transition-all text-sm tracking-[0.2em] group">
            <span className="flex items-center justify-center gap-3">
              {lang === 'ar' ? 'التالي: إتمام عملية الدفع' : 'Next: Complete Payment'}
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-8">
          <div className="bg-brand/5 border-2 border-dashed border-brand/20 p-10 rounded-[3.5rem] text-center relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-brand opacity-20" />
             <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Amount to Send</p>
             <h2 className="text-6xl font-black text-brand italic tracking-tighter">${selectedPlan.pricing[selectedPeriod]}</h2>
             <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-[9px] font-black uppercase tracking-widest">
                <Star size={12} /> {selectedPlan.name} Activation
             </div>
          </div>
          
          <div className="space-y-4">
             {Object.entries(WALLETS).map(([name, addr]) => (
               <div key={name} onClick={() => setSelectedWallet(name)} className={`p-8 rounded-[3rem] border-4 transition-all cursor-pointer flex items-center justify-between ${selectedWallet === name ? 'border-brand bg-white dark:bg-gray-900 shadow-2xl scale-105' : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:border-gray-200'}`}>
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-brand text-white rounded-[1.5rem] flex items-center justify-center font-black text-xl italic shadow-lg shadow-brand/20">{name.slice(0,1)}</div>
                     <div className="text-left">
                        <p className="text-sm font-black dark:text-white uppercase tracking-tighter">{name} Network</p>
                        <p className="text-[9px] text-gray-400 font-mono truncate w-40 sm:w-64">{addr}</p>
                     </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleCopy(addr); }} className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-brand rounded-2xl transition-all active:scale-90"><Copy size={20} /></button>
               </div>
             ))}
          </div>
          <button onClick={() => validateStep() && setStep(3)} disabled={!selectedWallet} className="w-full py-6 bg-brand text-white rounded-[2.5rem] font-black uppercase shadow-2xl disabled:opacity-30 flex items-center justify-center gap-3">
            {lang === 'ar' ? 'التالي: ربط محفظتي' : 'Next: Link My Wallet'} <ArrowRight size={20} />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-xl mx-auto space-y-10 animate-in slide-in-from-bottom-8">
          <div className="text-center">
             <div className="w-24 h-24 bg-brand/10 text-brand rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl"><Wallet size={40} /></div>
             <p className="text-sm text-gray-500 font-black uppercase tracking-widest mb-2 leading-relaxed px-6">
                {lang === 'ar' ? 'لضمان التحقق السريع، الصق عنوان محفظتك الحقيقي الذي تمت العملية من خلاله' : 'For instant verification, paste your real sender wallet address'}
             </p>
          </div>
          <div className="relative group">
             <div className="absolute inset-0 bg-brand/5 rounded-[2.5rem] scale-105 opacity-0 group-focus-within:opacity-100 transition-opacity" />
             <CreditCard className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size={24} />
             <input type="text" value={userWallet} onChange={e => setUserWallet(e.target.value)} placeholder={lang === 'ar' ? 'الصق عنوان محفظتك هنا...' : 'Paste sender wallet address...'} className="w-full pl-20 pr-8 py-7 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800 dark:text-white outline-none font-bold text-sm border-4 border-transparent focus:border-brand shadow-inner transition-all" />
          </div>
          <button onClick={() => validateStep() && setStep(4)} disabled={!userWallet.trim()} className="w-full py-6 bg-brand text-white rounded-[2.5rem] font-black uppercase shadow-2xl disabled:opacity-30 flex items-center justify-center gap-3">
             {lang === 'ar' ? 'التالي: كود العملية' : 'Next: Transaction Hash'} <ArrowRight size={20} />
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="max-w-xl mx-auto space-y-10 animate-in slide-in-from-bottom-8">
          <div className="text-center">
             <div className="w-24 h-24 bg-brand/10 text-brand rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl"><Key size={40} /></div>
             <p className="text-sm text-gray-500 font-black uppercase tracking-widest mb-2 px-6">
                {lang === 'ar' ? 'أدخل رمز العملية (TXID) المكون من أرقام وحروف لتأكيد عملية الدفع' : 'Enter the TXID / Hash code of your payment to confirm transaction'}
             </p>
          </div>
          <div className="relative group">
             <div className="absolute inset-0 bg-brand/5 rounded-[2.5rem] scale-105 opacity-0 group-focus-within:opacity-100 transition-opacity" />
             <Zap className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size={24} />
             <input type="text" value={txHash} onChange={e => setTxHash(e.target.value)} placeholder={lang === 'ar' ? 'الصق رمز التحقق (TXID)...' : 'Paste TXID Hash...'} className="w-full pl-20 pr-8 py-7 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800 dark:text-white outline-none font-bold text-sm border-4 border-transparent focus:border-brand shadow-inner transition-all" />
          </div>
          <button onClick={handleFinalize} disabled={!txHash.trim() || isLoading} className="w-full py-6 bg-brand text-white rounded-[2.5rem] font-black uppercase shadow-2xl disabled:opacity-30 flex items-center justify-center gap-4 transition-all active:scale-95">
            {/* Added Loader2 here which was causing the error */}
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : (lang === 'ar' ? 'تفعيل عضويتي الفورية' : 'Activate My Membership')}
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="max-w-xl mx-auto py-24 px-6 text-center animate-in zoom-in-95 duration-500">
          <div className="w-32 h-32 bg-green-500 text-white rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl mb-12 rotate-6 animate-bounce"><CheckCircle size={64} /></div>
          <h2 className="text-4xl font-black dark:text-white uppercase italic tracking-tighter mb-4">{lang === 'ar' ? 'تم التفعيل بنجاح!' : 'Activation Success!'}</h2>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.4em] mb-12">{lang === 'ar' ? `أهلاً بك في فئة ${selectedPlan.name}` : `Welcome to ${selectedPlan.name} Class`}</p>
          <button onClick={() => navigate('/')} className="w-full py-6 bg-brand text-white rounded-[2.5rem] font-black uppercase shadow-2xl hover:scale-105 transition-all text-sm tracking-widest">
            {lang === 'ar' ? 'بدء تجربة التأجير الاحترافية' : 'Start Pro Experience'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
