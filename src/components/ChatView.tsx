import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message, User, Sentiment } from '../types';
import { analyzeSentiment, analyzeConnectionVibe } from '../services/geminiService';
import { StarIcon, PlanetIcon } from './icons/Celestial';
import { SendIcon } from './icons/Navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ConnectionModal from './Connection';

interface ChatViewProps {
  chat: Chat;
  currentUser: User;
  allUsers: User[];
  onSendMessage: (chatId: string, message: Message) => void;
  onCreateNebulaLink: (user1: User, user2: User) => void;
}

const MoodLantern: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
  const colorMap: Record<Sentiment, string> = {
    POSITIVE: 'shadow-[0_0_8px_2px_#34d399]',
    NEUTRAL: 'shadow-[0_0_8px_2px_#60a5fa]',
    NEGATIVE: 'shadow-[0_0_8px_2px_#f472b6]',
  };
  const bgColorMap: Record<Sentiment, string> = {
    POSITIVE: 'bg-emerald-400',
    NEUTRAL: 'bg-blue-400',
    NEGATIVE: 'bg-pink-500',
  }

  return (
    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${bgColorMap[sentiment]} ${colorMap[sentiment]} transition-all duration-500`}/>
  );
};


const ChatView: React.FC<ChatViewProps> = ({ chat, currentUser, allUsers, onSendMessage, onCreateNebulaLink }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [vibeCheck, setVibeCheck] = useState<{ user: User; open: boolean } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const usersById = Object.fromEntries(allUsers.map(user => [user.id, user]));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  useEffect(() => {
    const checkVibe = async () => {
        if (chat.type === 'NEBULA_LINK' || chat.messages.length < 4) return;

        const otherMembers = chat.members.filter(id => id !== currentUser.id && id !== 'system');

        for(const memberId of otherMembers) {
            const userMessages = chat.messages.filter(m => m.authorId === currentUser.id);
            const otherUserMessages = chat.messages.filter(m => m.authorId === memberId);

            if (userMessages.length > 2 && otherUserMessages.length > 2) {
                 const recentMessages = chat.messages.slice(-6)
                    .filter(m => m.authorId === currentUser.id || m.authorId === memberId)
                    .map(m => `${usersById[m.authorId]?.name || 'User'}: ${m.text}`)
                    .join('\n');
                
                const hasGoodVibe = await analyzeConnectionVibe(recentMessages);
                
                if (hasGoodVibe) {
                    const otherUser = usersById[memberId];
                    if(otherUser) {
                        setVibeCheck({ user: otherUser, open: true });
                    }
                    break; 
                }
            }
        }
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const timeoutId = setTimeout(checkVibe, 2000);
    return () => clearTimeout(timeoutId);
  }, [chat.messages, chat.type, currentUser.id, chat.members, usersById]);

  const handleSend = async () => {
    if (newMessage.trim() === '' || isSending) return;
    setIsSending(true);
    const sentiment = await analyzeSentiment(newMessage);
    const message: Message = {
      id: `msg_${Date.now()}`,
      authorId: currentUser.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
      sentiment,
    };
    onSendMessage(chat.id, message);
    setNewMessage('');
    setIsSending(false);
  };
  
  const isNebulaLink = chat.type === 'NEBULA_LINK';

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className={`font-orbitron text-xl text-center mb-4 ${isNebulaLink ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300 animate-pulse' : 'text-purple-300'}`}>
        {chat.name}
      </h2>
      <div className="flex-grow overflow-y-auto space-y-4 pr-2">
        {chat.messages.map(msg => {
          const author = usersById[msg.authorId];
          const isCurrentUser = msg.authorId === currentUser.id;
          if (!author) return null;

          if (author.id === 'system') {
            return (
              <div key={msg.id} className="text-center text-xs text-purple-400/80 italic my-4">
                {msg.text}
              </div>
            );
          }

          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="relative flex-shrink-0">
                {author.avatar === 'STAR' ? 
                  <StarIcon color={author.color} className="w-10 h-10 drop-shadow-[0_0_8px_var(--glow-color)]" style={{'--glow-color': author.color} as React.CSSProperties}/> :
                  <PlanetIcon color={author.color} className="w-10 h-10" />
                }
                <MoodLantern sentiment={author.id === currentUser.id ? msg.sentiment : author.lastMessageSentiment} />
              </div>
              <div className={`w-full max-w-[70%] flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2 rounded-2xl ${isCurrentUser ? 'bg-purple-600/50 rounded-br-none' : 'bg-slate-800/70 rounded-bl-none'}`}>
                  <span className="text-xs font-bold" style={{color: author.color}}>{author.name}</span>
                  <p className="text-sm text-slate-200">{msg.text}</p>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder={isNebulaLink ? "Whisper into the cosmos..." : "Type your message..."}
          className="w-full bg-slate-800/70 border border-slate-700 rounded-full px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          disabled={isSending}
        />
        <button onClick={handleSend} disabled={isSending} className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full transition-all disabled:bg-slate-600">
          <SendIcon />
        </button>
      </div>
       <AnimatePresence>
       {vibeCheck?.open && (
           <ConnectionModal 
                user={vibeCheck.user} 
                onAccept={() => {
                    onCreateNebulaLink(currentUser, vibeCheck.user);
                    setVibeCheck(null);
                }} 
                onDecline={() => setVibeCheck(null)}
            />
       )}
       </AnimatePresence>
    </div>
  );
};

export default ChatView;