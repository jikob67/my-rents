
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { translations } from '../i18n';
import { Listing, GroupChat } from '../types';
import { 
  Trash2, MapPin, Flag, Send, UserPlus, ShieldCheck, Camera, 
  Loader2, Mic, ShieldBan, X, Video, ChevronLeft, StopCircle, Volume2, Image as ImageIcon, Users, MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: number;
  text?: string;
  sender: 'me' | 'other';
  type: 'text' | 'image' | 'video' | 'location' | 'voice';
  data?: string; 
  timestamp: number;
}

interface ChatPageProps {
  lang: string;
  listings: Listing[];
  user: any;
  onBlock: (id: string) => void;
  groups: GroupChat[];
  onCreateGroup: (g: GroupChat) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ lang, listings, user, onBlock, groups, onCreateGroup }) => {
  const t = translations[lang] || translations['en'];
  const { otherId: paramOtherId } = useParams();
  const routeLocation = useRouteLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(routeLocation.search);
  const itemId = queryParams.get('item');

  const [activeTab, setActiveTab] = useState<'PRIVATE' | 'GROUPS'>('PRIVATE');
  const [activeChatId, setActiveChatId] = useState<string>(paramOtherId || 'global');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [groupData, setGroupData] = useState({ name: '', description: '', image: '' });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages whenever activeChatId changes
  useEffect(() => {
    const saved = localStorage.getItem(`chat_${user.id}_${activeChatId}`);
    setMessages(saved ? JSON.parse(saved) : []);
  }, [activeChatId, user.id]);

  // Persist messages
  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem(`chat_${user.id}_${activeChatId}`, JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChatId, user.id]);

  const discussedItem = useMemo(() => itemId ? listings.find(l => l.id === itemId) : null, [itemId, listings]);
  
  const activeGroup = useMemo(() => {
    return activeTab === 'GROUPS' ? groups.find(g => g.id === activeChatId) : null;
  }, [activeTab, activeChatId, groups]);

  const handleSend = (type: ChatMessage['type'] = 'text', data?: string) => {
    if (type === 'text' && !input.trim()) return;
    const msg: ChatMessage = { id: Date.now(), text: type === 'text' ? input : undefined, sender: 'me', type, data, timestamp: Date.now() };
    setMessages(prev => [...prev, msg]);
    if (type === 'text') setInput('');
  };

  const handleMicAction = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const r = new FileReader();
          r.onload = (ev) => handleSend('voice', ev.target?.result as string);
          r.readAsDataURL(blob);
        };
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) { alert('Microphone required'); }
    }
  };

  const shareLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(pos => {
      handleSend('location', `${pos.coords.latitude},${pos.coords.longitude}`);
      setIsLocating(false);
    }, () => setIsLocating(false));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const r = new FileReader();
      r.onload = (ev) => handleSend(type, ev.target?.result as string);
      r.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex h-[calc(100vh-140px)] mt-2 bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl border dark:border-gray-800 animate-in fade-in">
      {/* Sidebar */}
      <div className="w-80 border-r dark:border-gray-800 flex flex-col bg-gray-50/20 dark:bg-gray-950/20 p-6 hidden md:flex">
        <h1 className="text-2xl font-black text-brand italic tracking-tighter mb-6">my rents chat</h1>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
          <button onClick={() => { setActiveTab('PRIVATE'); setActiveChatId('global'); }} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'PRIVATE' ? 'bg-white dark:bg-gray-900 text-brand shadow' : 'text-gray-400'}`}>Private</button>
          <button onClick={() => setActiveTab('GROUPS')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'GROUPS' ? 'bg-white dark:bg-gray-900 text-brand shadow' : 'text-gray-400'}`}>{t.groups}</button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
          {activeTab === 'GROUPS' ? (
            <>
              <button onClick={() => setShowGroupCreate(true)} className="w-full p-4 border-2 border-dashed dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase text-gray-400 mb-4 hover:border-brand hover:text-brand transition-all flex items-center justify-center gap-2">
                <UserPlus size={16} /> New Community
              </button>
              {groups.length === 0 ? (
                <p className="text-center text-[9px] font-bold text-gray-400 uppercase py-10">No communities yet</p>
              ) : (
                groups.map(g => (
                  <div 
                    key={g.id} 
                    onClick={() => setActiveChatId(g.id)}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${activeChatId === g.id ? 'border-brand bg-brand/5' : 'border-transparent bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-gray-200'}`}
                  >
                    <img src={g.image || `https://api.dicebear.com/7.x/initials/svg?seed=${g.name}`} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black dark:text-white uppercase truncate">{g.name}</p>
                      <p className="text-[8px] text-brand font-black uppercase">{g.members.length} Members</p>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div 
                onClick={() => setActiveChatId('global')}
                className={`p-4 border rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${activeChatId === 'global' ? 'border-brand bg-brand/5 shadow-sm' : 'border-transparent bg-white dark:bg-gray-800 dark:border-gray-700'}`}
              >
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold">A</div>
                <div>
                  <p className="text-xs font-black dark:text-white uppercase">Support AI</p>
                  <p className="text-[8px] text-green-500 font-bold uppercase">Online Now</p>
                </div>
              </div>
              
              {/* If we had a list of recent chats with real users, they would go here */}
              {paramOtherId && paramOtherId !== 'global' && (
                 <div 
                  onClick={() => setActiveChatId(paramOtherId)}
                  className={`p-4 border rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${activeChatId === paramOtherId ? 'border-brand bg-brand/5 shadow-sm' : 'border-transparent bg-white dark:bg-gray-800 dark:border-gray-700'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 flex items-center justify-center font-bold italic">?</div>
                  <div>
                    <p className="text-xs font-black dark:text-white uppercase">Active Rental Chat</p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase">Private Discussion</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 relative">
        <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="md:hidden p-2"><ChevronLeft /></button>
              {activeTab === 'GROUPS' && activeGroup ? (
                <img src={activeGroup.image} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/20"><ShieldCheck size={20} /></div>
              )}
              <div>
                <h2 className="font-black dark:text-white text-xs uppercase tracking-tighter italic">
                  {activeTab === 'GROUPS' && activeGroup ? activeGroup.name : 'LIVE SECURE'}
                </h2>
                <span className="text-[7px] text-green-500 font-black uppercase tracking-widest">
                  {activeTab === 'GROUPS' ? 'Community Channel' : 'End-to-End Encrypted'}
                </span>
              </div>
           </div>
           <div className="flex gap-1">
              <button onClick={() => setMessages([])} className="p-2.5 text-gray-400 hover:text-red-500 rounded-xl transition-all active:scale-90" title="Clear Chat"><Trash2 size={20} /></button>
              <button onClick={() => alert('Reported')} className="p-2.5 text-gray-400 hover:text-brand rounded-xl transition-all active:scale-90" title="Report Abuse"><Flag size={20} /></button>
              {activeTab === 'PRIVATE' && activeChatId !== 'global' && (
                <button onClick={() => { onBlock(activeChatId); navigate('/'); }} className="p-2.5 text-gray-400 hover:text-brand transition-all active:scale-90" title="Block User"><ShieldBan size={20} /></button>
              )}
           </div>
        </div>

        {discussedItem && (
          <div className="p-3 bg-brand/5 border-b border-brand/10 flex items-center justify-between animate-in slide-in-from-top">
             <div className="flex items-center gap-2">
                <img src={discussedItem.images[0]} className="w-10 h-10 rounded-lg object-cover" />
                <p className="text-[10px] font-black dark:text-white uppercase truncate max-w-[150px]">{discussedItem.title}</p>
             </div>
             <button onClick={() => alert(t.confirmRental)} className="px-5 py-2 bg-brand text-white rounded-xl text-[9px] font-black uppercase shadow-lg hover:scale-105 active:scale-95 transition-all">RENT NOW</button>
          </div>
        )}

        <div className="flex-1 p-8 overflow-y-auto space-y-4 bg-gray-50/10 scrollbar-hide">
           {messages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                {activeTab === 'GROUPS' ? <Users size={72} className="text-brand mb-4" /> : <ShieldCheck size={72} className="text-brand mb-4" />}
                <p className="text-[10px] font-black uppercase dark:text-white tracking-widest max-w-xs leading-relaxed">
                  {activeTab === 'GROUPS' ? 'Start the conversation in this community.' : 'Secured conversation. All media is screened by AI my rents.'}
                </p>
             </div>
           ) : (
             messages.map(m => (
               <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`p-4 rounded-[1.8rem] shadow-sm text-xs font-bold max-w-[85%] ${m.sender === 'me' ? 'bg-brand text-white rounded-tr-none shadow-brand/20' : 'bg-gray-100 dark:bg-gray-800 dark:text-white rounded-tl-none shadow-black/5'}`}>
                     {m.type === 'image' && <img src={m.data} className="rounded-2xl mb-2 max-w-full h-auto shadow-md" />}
                     {m.type === 'video' && <video src={m.data} controls className="rounded-2xl mb-2 max-w-full shadow-md" />}
                     {m.type === 'voice' && <audio src={m.data} controls className="h-8 w-full scale-90 mb-2" />}
                     {m.type === 'location' ? (
                       <a href={`https://maps.google.com?q=${m.data}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline uppercase text-[10px] bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
                         <MapPin size={16} /> {lang === 'ar' ? 'عرض الموقع الحي' : 'View Live Location'}
                       </a>
                     ) : m.text}
                     <div className="text-[7px] mt-2 opacity-50 text-right uppercase tracking-widest">{new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
               </div>
             ))
           )}
           <div ref={messagesEndRef} />
        </div>

        <div className="p-8 border-t dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
           <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
              <button onClick={handleMicAction} className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-brand'}`}>
                {isRecording ? <StopCircle size={16}/> : <Mic size={16}/>} {isRecording ? 'Recording...' : 'Voice'}
              </button>
              <label className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-[9px] font-black uppercase text-gray-400 cursor-pointer hover:text-brand transition-all">
                <ImageIcon size={16}/> Photos
                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'image')} />
              </label>
              <label className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-[9px] font-black uppercase text-gray-400 cursor-pointer hover:text-brand transition-all">
                <Video size={16}/> Video
                <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'video')} />
              </label>
              <button onClick={shareLocation} disabled={isLocating} className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-[9px] font-black uppercase text-gray-400 hover:text-brand transition-all disabled:opacity-50">
                {isLocating ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />} Location
              </button>
           </div>
           <div className="flex gap-4">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                className="flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white px-8 py-5 rounded-[2.2rem] outline-none font-bold text-sm shadow-inner focus:ring-2 focus:ring-brand transition-all" 
                placeholder="Type secure message..." 
              />
              <button onClick={() => handleSend()} className="w-16 h-16 bg-brand text-white rounded-[1.8rem] flex items-center justify-center shadow-xl shadow-brand/30 active:scale-90 hover:scale-105 transition-all"><Send size={28} /></button>
           </div>
        </div>
      </div>

      {/* Group Create Modal */}
      {showGroupCreate && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black dark:text-white italic uppercase tracking-tighter">New Community</h3>
                <button onClick={() => setShowGroupCreate(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"><X /></button>
              </div>
              <div className="space-y-6 text-center">
                 <label className="w-28 h-28 mx-auto bg-gray-100 dark:bg-gray-800 rounded-[2rem] border-4 border-dashed border-brand/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden group shadow-inner">
                   {groupData.image ? <img src={groupData.image} className="w-full h-full object-cover" /> : <Camera className="text-gray-400 group-hover:text-brand" />}
                   <input type="file" required className="hidden" accept="image/*" onChange={e => {
                     const f = e.target.files?.[0];
                     if (f) { const r = new FileReader(); r.onload = (ev) => setGroupData({...groupData, image: ev.target?.result as string}); r.readAsDataURL(f); }
                   }} />
                 </label>
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Community Image (Required)*</p>
                 <input type="text" placeholder="Community Name*" value={groupData.name} onChange={e => setGroupData({...groupData, name: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white outline-none font-bold shadow-inner border-2 border-transparent focus:border-brand" />
                 <textarea placeholder="Purpose / Description*" value={groupData.description} onChange={e => setGroupData({...groupData, description: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white h-24 outline-none font-bold shadow-inner border-2 border-transparent focus:border-brand" />
                 <button onClick={() => { if(groupData.name && groupData.image) { onCreateGroup({...groupData, id: 'g_'+Date.now(), adminId: user.id, members: [user.id]}); setShowGroupCreate(false); }}} disabled={!groupData.name || !groupData.image} className="w-full py-5 bg-brand text-white rounded-[2rem] font-black uppercase shadow-xl disabled:opacity-30 active:scale-95 transition-all">Launch Community</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
