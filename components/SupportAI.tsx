
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Mail, ExternalLink } from 'lucide-react';
import { getAISupportResponse } from '../services/geminiService';
import { CONTACT_EMAIL, SUPPORT_LINKS } from '../constants';

const SupportAI: React.FC<{ lang: 'ar' | 'en' }> = ({ lang }) => {
  // Empty message history initially
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await getAISupportResponse(userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-4 bg-brand text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold">AI Support</h2>
            <p className="text-xs opacity-80">Powered by Gemini</p>
          </div>
        </div>
        <a href={`mailto:${CONTACT_EMAIL}`} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Mail size={20} />
        </a>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
            <Bot size={48} className="mb-4 text-brand" />
            <p className="text-sm font-medium dark:text-gray-400">
              {lang === 'ar' ? 'كيف يمكنني مساعدتك بخصوص تأجير السلع؟' : 'How can I help you with renting items?'}
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-gray-200' : 'bg-brand/10 text-brand'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-brand text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 dark:text-white rounded-tl-none'}`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-brand" />
              <span className="text-xs text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={lang === 'ar' ? 'اكتب استفسارك هنا...' : 'Type your query...'}
            className="flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-brand"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs text-gray-500">
          {SUPPORT_LINKS.map(link => (
            <a key={link.url} href={link.url} target="_blank" className="flex items-center gap-1 hover:text-brand">
              <ExternalLink size={12} />
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportAI;
