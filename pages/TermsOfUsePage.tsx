
import React from 'react';
import { translations } from '../i18n';
import { Gavel, AlertTriangle, Users, Bot, ShieldAlert, ArrowLeft, Trash2, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfUsePage: React.FC<{ lang: string }> = ({ lang }) => {
  const t = translations[lang] || translations['en'];
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  return (
    <div className="max-w-4xl mx-auto p-6 pt-10 pb-20">
      <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4">
        <button onClick={() => navigate(-1)} className="mb-8 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand transition-all">
          <ArrowLeft size={16} className={isRtl ? 'rotate-180' : ''} /> {t.back}
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-brand/10 text-brand rounded-2xl shadow-xl shadow-brand/10">
            <Gavel size={40} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black dark:text-white uppercase tracking-tighter italic">{t.termsOfUse}</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Updated: June 2026</p>
          </div>
        </div>

        <div className="space-y-10">
          <section className="p-8 bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] border-2 border-red-100 dark:border-red-900/20 shadow-lg">
            <div className="flex items-center gap-3 text-red-600 font-black mb-4 uppercase tracking-[0.2em] text-sm">
              <Ban size={24} className="animate-pulse" /> {isRtl ? 'قانون منع البيع البات' : 'STRICT NO-SALE POLICY'}
            </div>
            <p className="text-red-800 dark:text-red-300 font-black text-xs leading-relaxed uppercase tracking-widest">
              {isRtl 
                ? 'يمنع منعاً باتاً نشر أي منتج للبيع. المنصة مخصصة للتأجير فقط. أي مستخدم يحاول عرض سلع للبيع سيتم حذف إعلانه فوراً وحظر حسابه بشكل نهائي بواسطة نظام AI my rents دون سابق إنذار.' 
                : 'Posting any item for SALE is strictly forbidden. This platform is for RENTALS only. Any user attempting to sell items will have their listing removed and account PERMANENTLY BANNED by AI my rents without warning.'}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-xs">
              <Bot size={18} /> {isRtl ? 'فحص المنتجات والبلاغات الحية' : 'AI Screening & Live Reporting'}
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-bold text-sm leading-relaxed">
              {isRtl 
                ? 'تخضع جميع السلع لفحص الذكاء الاصطناعي (Gemini) قبل النشر لضمان الالتزام بقانون التأجير. عند استلام بلاغ من أي مستخدم، يقوم النظام بإعادة فحص المنتج فوراً واتخاذ قرار الإزالة التلقائية في حال المخالفة.' 
                : 'All items undergo AI screening (Gemini) before publishing to ensure rental compliance. Upon receiving a report, the system re-evaluates the item immediately and may trigger automatic removal.'}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-xs">
              <Users size={18} /> {isRtl ? 'إدارة المجتمعات والمشرفين' : 'Communities & Admin Rules'}
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-bold text-sm leading-relaxed">
              {isRtl 
                ? 'منشئ المجموعة هو المشرف التلقائي عليها. المشرف مسؤول عن المحتوى داخل مجموعته. يمنع تداول أي روابط خارجية غير آمنة أو محتويات خارج سياق التأجير، ويحق للنظام حظر مجموعات كاملة في حال المخالفة.' 
                : 'The group creator is the default admin. Admins are responsible for group content. Sharing unsafe links or non-rental content is prohibited and may lead to group termination.'}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand font-black uppercase tracking-widest text-xs">
              <Trash2 size={18} /> {isRtl ? 'حقوق حذف المحتوى' : 'Right to Erasure'}
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-bold text-sm leading-relaxed">
              {isRtl 
                ? 'يحق للمستخدم حذف إعلاناته ومسح سجل الدردشة الخاص به في أي وقت. يتم مسح البيانات نهائياً من سجلاتنا لضمان الخصوصية التامة.' 
                : 'Users have the right to delete their listings and clear their chat history at any time. Data is permanently erased from our records to ensure privacy.'}
            </p>
          </section>
          
          <div className="pt-10 border-t dark:border-gray-800 text-center">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
               {isRtl ? 'باستخدامك للتطبيق، أنت توقع على الالتزام الصارم بهذه الشروط' : 'By using the app, you sign and agree to strict compliance with these terms'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
