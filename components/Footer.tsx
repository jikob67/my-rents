
import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n';
import { Mail, ShieldCheck, Heart } from 'lucide-react';
import { CONTACT_EMAIL } from '../constants';

const Footer: React.FC<{ lang: string }> = ({ lang }) => {
  const t = translations[lang] || translations['en'];
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand text-white rounded-lg flex items-center justify-center font-black italic text-xs rotate-3 shadow-lg shadow-brand/20">R</div>
            <span className="text-xl font-black dark:text-white lowercase tracking-tighter italic">my rents</span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {lang === 'ar' ? 'منصة التأجير الأولى في منطقتك' : 'The #1 Rental Marketplace in your area'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <Link to="/privacy" className="text-[11px] font-black text-gray-400 hover:text-brand uppercase tracking-widest transition-colors">{t.privacyPolicy}</Link>
          <Link to="/terms" className="text-[11px] font-black text-gray-400 hover:text-brand uppercase tracking-widest transition-colors">{t.termsOfUse}</Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[11px] font-black text-gray-400 hover:text-brand uppercase tracking-widest transition-colors flex items-center gap-2">
            <Mail size={12} /> {lang === 'ar' ? 'الدعم الفني' : 'Support'}
          </a>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[10px] font-black text-gray-300 uppercase">
            <ShieldCheck size={14} className="text-brand" /> AI Secured
          </div>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800"></div>
          <p className="text-[10px] font-black text-gray-300 uppercase flex items-center gap-1">
            Made with <Heart size={10} className="text-brand fill-brand" /> for community
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-100 dark:border-gray-900 text-center">
        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">© 2026 my rents - All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
