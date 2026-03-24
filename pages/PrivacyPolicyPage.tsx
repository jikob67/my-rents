
import React from 'react';
import { translations } from '../i18n';
import { Shield, Eye, MapPin, Wallet, Bot, ShieldCheck, ArrowLeft, Camera, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage: React.FC<{ lang: string }> = ({ lang }) => {
  const t = translations[lang] || translations['en'];
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  return (
    <div className="max-w-4xl mx-auto p-6 pt-10 pb-20">
      <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4">
        <button onClick={() => navigate(-1)} className="mb-8 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand transition-colors">
          <ArrowLeft size={16} className={isRtl ? 'rotate-180' : ''} /> {t.back}
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-brand/10 text-brand rounded-2xl shadow-xl shadow-brand/10">
            <Shield size={40} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black dark:text-white uppercase tracking-tighter italic">{t.privacyPolicy}</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Effective Date: June 2026</p>
          </div>
        </div>

        <div className="space-y-12">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-xs">
              <Camera size={18} /> {isRtl ? 'الهوية والصورة الشخصية (إلزامي)' : 'Identity & Profile Media (Mandatory)'}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
              {isRtl 
                ? 'نحن نلزم جميع المستخدمين برفع صورة شخصية حقيقية لضمان موثوقية مجتمع التأجير. يتم تخزين هذه الصور في خوادم مشفرة وتُستخدم حصرياً للتعريف بصاحب السلعة والمستأجر.' 
                : 'We require all users to upload a real profile picture to ensure community reliability. These images are stored on encrypted servers and used exclusively for identifying owners and renters.'}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-xs">
              <Navigation size={18} /> {isRtl ? 'الموقع الجغرافي الحي GPS' : 'Live GPS Geolocation'}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
              {isRtl 
                ? 'يعتمد my rents على تقنية GPS لربط السلع بالمستخدمين القريبين. يتم جلب موقعك عند التسجيل وعند نشر كل سلعة لضمان دقة مكان التسليم والاستلام. لا يتم تتبع موقعك في الخلفية.' 
                : 'my rents uses GPS technology to link items with nearby users. Your location is captured during signup and for each listing to ensure accurate delivery/pickup points. We do not track your location in the background.'}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-xs">
              <Wallet size={18} /> {isRtl ? 'العملات الرقمية وحسابات PayPal' : 'Crypto & PayPal Financials'}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
              {isRtl 
                ? 'بيانات محافظك الرقمية (Solana, Ethereum, Monad, Base, Sui, Polygon, Bitcoin) وبريد PayPal تُستخدم فقط لاستلام أرباح التأجير الخاصة بك. تظل هذه البيانات سرية تماماً ولا تظهر لأطراف ثالثة.' 
                : 'Your crypto wallet data (Solana, Ethereum, Monad, Base, Sui, Polygon, Bitcoin) and PayPal email are used solely for receiving your rental earnings. This data remains strictly confidential.'}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-xs">
              <Bot size={18} /> {isRtl ? 'الرقابة الذكية والوسائط' : 'AI Monitoring & Media'}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
              {isRtl 
                ? 'يتم فحص الصور والفيديوهات والمحادثات بواسطة AI my rents لضمان عدم وجود محتوى مخل أو محاولات بيع غير قانونية على المنصة.' 
                : 'Photos, videos, and chats are screened by AI my rents to ensure no inappropriate content or illegal sales attempts occur on the platform.'}
            </p>
          </section>
          
          <div className="p-10 bg-brand/5 border border-brand/10 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
             <ShieldCheck className="text-brand shrink-0" size={40} />
             <p className="text-[10px] font-black text-gray-500 uppercase leading-relaxed tracking-widest">
               {isRtl 
                 ? 'خصوصيتك هي أولويتنا القصوى. من خلال التسجيل، أنت توافق على معالجة هذه البيانات لضمان تجربة آمنة وقانونية.' 
                 : 'Your privacy is our priority. By registering, you consent to the processing of this data for a safe and legal rental experience.'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
