
import React, { useState } from 'react';
import { translations } from '../i18n';
import { Mic, Image, Video, Trash2, MapPin, Flag, ShieldBan, Send, Users, UserPlus, Search, ShieldCheck, Camera } from 'lucide-react';

const ChatPage: React.FC<{ lang: string }> = ({ lang }) => {
  const t = translations[lang] || translations['en'];
  const [activeTab, setActiveTab] = useState<'PRIVATE' | 'GROUPS'>('PRIVATE');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [groupData, setGroupData] = useState({ name: '', description: '', image: '' });

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'me' }]);
    setInput('');
  };

  const handleCreateGroup = () => {
    if (groupData.name && groupData.image) {
      alert(lang === 'ar' ? 'تم إنشاء المجموعة! أنت الآن المشرف.' : 'Community created! You are now the admin.');
      setShowGroupCreate(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex h-[calc(100vh-160px)] mt-4 bg-white dark:bg-gray-900 rounded-[3.5rem] overflow-hidden shadow-2xl border dark:border-gray-800 animate-in fade-in duration-500">
      {/* Sidebar - Empty initially */}
      <div className="w-1/3 border-r dark:border-gray-800 flex flex-col bg-gray-50/20 dark:bg-gray-950/20 p-6">
        <h1 className="text-2xl font-black dark:text-white mb-6 italic text-brand uppercase tracking-tighter">my rents chat</h1>
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <button onClick={() => setActiveTab('PRIVATE')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'PRIVATE' ? 'bg-white dark:bg-gray-900 text-brand shadow' : 'text-gray-400'}`}>{lang === 'ar' ? 'خاص' : 'Direct'}</button>
          <button onClick={() => setActiveTab('GROUPS')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'GROUPS' ? 'bg-white dark:bg-gray-900 text-brand shadow' : 'text-gray-400'}`}>{t.groups}</button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3">
          {activeTab === 'GROUPS' && (
            <button onClick={() => setShowGroupCreate(true)} className="w-full p-6 border-2 border-dashed dark:border-gray-800 rounded-3xl flex items-center justify-center gap-2 text-gray-400 font-black text-xs uppercase hover:text-brand hover:border-brand transition-all">
               <UserPlus size={18} /> {t.createGroup}
            </button>
          )}
          
          <div className="py-24 text-center opacity-10">
            <Users size={64} className="mx-auto text-brand mb-2" />
            <p className="text-[10px] font-black uppercase dark:text-white tracking-widest">{lang === 'ar' ? 'لا توجد محادثات نشطة' : 'No active chats'}</p>
          </div>
        </div>
      </div>

      {/* Chat Area - Empty initially */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-gray-900">
        <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
             <div className="px-3 h-10 rounded-xl bg-brand text-white flex items-center justify-center font-black text-[10px] italic shadow-lg shadow-brand/20">AI SECURE</div>
             <h2 className="font-black dark:text-white text-sm uppercase tracking-tighter">{lang === 'ar' ? 'قناة مشفرة' : 'Secured Channel'}</h2>
          </div>
          <div className="flex gap-1">
             <button onClick={() => setMessages([])} className="p-2.5 text-gray-400 hover:text-red-500 rounded-xl transition-all active:scale-90" title="Clear Chat"><Trash2 size={20} /></button>
             <button onClick={() => alert('Report logged.')} className="p-2.5 text-gray-400 hover:text-brand rounded-xl transition-all active:scale-90" title="Report Abuse"><Flag size={20} /></button>
             <button onClick={() => alert(t.userBlocked)} className="p-2.5 text-gray-400 hover:text-brand rounded-xl transition-all active:scale-90" title="Block User"><ShieldBan size={20} /></button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto space-y-4">
           {messages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                <ShieldCheck size={72} className="mb-4 text-brand" />
                <p className="text-xs font-black dark:text-white max-w-xs leading-relaxed uppercase tracking-widest">{lang === 'ar' ? 'اختر محادثة للبدء. جميع الرسائل مراقبة بواسطة AI my rents لضمان الأمان.' : 'Select a chat to begin. All conversations are monitored by AI my rents to ensure safety.'}</p>
             </div>
           ) : messages.map(m => (
               <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`p-4 rounded-[1.8rem] shadow-xl text-sm font-medium ${m.sender === 'me' ? 'bg-brand text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 dark:text-white rounded-tl-none'}`}>{m.text}</div>
               </div>
             ))
           }
        </div>

        {/* Dynamic Action Bar */}
        <div className="p-8 border-t dark:border-gray-800">
           <div className="flex items-center gap-4 mb-6">
              <button onClick={() => alert(t.voiceSent)} className="p-3.5 text-gray-400 hover:text-brand bg-gray-50 dark:bg-gray-800 rounded-2xl active:scale-90 transition-all shadow-sm"><Mic size={22} /></button>
              <button className="p-3.5 text-gray-400 hover:text-brand bg-gray-50 dark:bg-gray-800 rounded-2xl active:scale-90 transition-all shadow-sm"><Image size={22} /></button>
              <button className="p-3.5 text-gray-400 hover:text-brand bg-gray-50 dark:bg-gray-800 rounded-2xl active:scale-90 transition-all shadow-sm"><Video size={22} /></button>
              <button onClick={() => alert(t.locationSent)} className="p-3.5 text-gray-400 hover:text-brand bg-gray-50 dark:bg-gray-800 rounded-2xl active:scale-90 transition-all shadow-sm"><MapPin size={22} /></button>
           </div>
           <div className="flex gap-4">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white px-8 py-5 rounded-[2.2rem] outline-none font-bold shadow-inner focus:ring-2 focus:ring-brand transition-all" placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Message...'} />
              <button onClick={handleSend} className="p-6 bg-brand text-white rounded-[2.2rem] shadow-xl shadow-brand/40 active:scale-90 transition-all hover:scale-105"><Send size={28} /></button>
           </div>
        </div>
      </div>

      {/* Group Create Modal - Starts Empty */}
      {showGroupCreate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
           <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-2xl font-black mb-8 dark:text-white text-center uppercase tracking-tighter">{t.createGroup}</h3>
              <div className="space-y-4">
                 <label className="w-24 h-24 rounded-[2rem] bg-gray-100 dark:bg-gray-800 mx-auto flex items-center justify-center border-4 border-dashed border-brand cursor-pointer overflow-hidden relative group">
                   {groupData.image ? <img src={groupData.image} className="w-full h-full object-cover" /> : <Camera size={32} className="text-gray-400 group-hover:text-brand" />}
                   <input type="file" required className="hidden" onChange={e => e.target.files && setGroupData({...groupData, image: URL.createObjectURL(e.target.files[0])})} />
                 </label>
                 <input type="text" placeholder={lang === 'ar' ? 'اسم المجتمع*' : 'Community Name*'} value={groupData.name} onChange={e => setGroupData({...groupData, name: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none font-bold focus:ring-2 focus:ring-brand" />
                 <textarea placeholder={lang === 'ar' ? 'وصف المجتمع*' : 'Description*'} value={groupData.description} onChange={e => setGroupData({...groupData, description: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white h-24 outline-none font-bold focus:ring-2 focus:ring-brand" />
                 <button onClick={handleCreateGroup} disabled={!groupData.name || !groupData.image} className="w-full py-5 bg-brand text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-brand/20 disabled:opacity-30 transition-transform active:scale-95">Launch Community</button>
                 <button onClick={() => setShowGroupCreate(false)} className="w-full py-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">{t.back}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
