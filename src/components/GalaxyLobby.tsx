
import React from 'react';
import { Chat, View } from '../types';
import { motion } from 'framer-motion';
import { GroupIcon, MessageIcon, PlusIcon } from './icons/Dashboard';
import { OutlineStarIcon } from './icons/Celestial';

interface DashboardProps {
  chats: Chat[];
  onJoinChat: (chatId: string) => void;
  onOpenCreateCircleModal: () => void;
  onNavigate: (view: View) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, color: string, onClick?: () => void }> = ({ icon, title, value, color, onClick }) => (
  <motion.button
    onClick={onClick}
    disabled={!onClick}
    className="bg-slate-900/50 rounded-xl p-6 flex-1 border border-purple-500/10 text-left disabled:cursor-default w-full"
    whileHover={onClick ? { scale: 1.03, borderColor: 'rgba(168, 85, 247, 0.5)' } : {}}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  >
    <div className={`flex items-center gap-4 ${color}`}>
      {icon}
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
    <p className="text-5xl font-bold mt-2 text-white">{value}</p>
  </motion.button>
);

const tagColorStyles = {
    blue: 'bg-blue-800/50 text-blue-300',
    purple: 'bg-purple-800/50 text-purple-300',
    green: 'bg-emerald-800/50 text-emerald-300',
}

const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

const CircleCard: React.FC<{ chat: Chat, onJoin: () => void, delay: number }> = ({ chat, onJoin, delay }) => {
    const lastMessageTime = chat.messages[chat.messages.length - 1]?.timestamp;
    const timeAgo = lastMessageTime ? formatTimeAgo(new Date(lastMessageTime)) : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            onClick={onJoin}
            className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer shadow-lg hover:shadow-purple-900/50 flex flex-col justify-between"
        >
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-white">{chat.name}</h3>
                    <span className={`text-xs font-bold py-1 px-3 rounded-full ${tagColorStyles[chat.tagColor]}`}>{chat.tag}</span>
                </div>
                <p className="text-slate-400 text-sm mb-4">{chat.description}</p>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-400">
                <span>👥 {chat.members.length} members</span>
                <span><span className="text-emerald-400">{chat.onlineCount} online</span></span>
                <span>{timeAgo}</span>
            </div>
        </motion.div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ chats, onJoinChat, onOpenCreateCircleModal, onNavigate }) => {
  // Mock data for stats
  const activeCircles = chats.length;
  const newMessages = 7;
  const constellationLinks = 3;

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col text-white overflow-y-auto">
      <style>{`
        @keyframes shimmer-text {
          0%, 100% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.3), 0 0 10px rgba(251, 191, 36, 0.2);
          }
          50% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(251, 191, 36, 0.4);
          }
        }
        
        @keyframes shimmer-button-anim {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }

        .shimmer-text {
          animation: shimmer-text 4s ease-in-out infinite;
        }
        
        .shimmer-button {
          background-image: linear-gradient(
            to right, 
            #f59e0b, 
            #facc15, 
            #fef08a, 
            #facc15, 
            #f59e0b
          );
          background-size: 200% auto;
          animation: shimmer-button-anim 3s linear infinite;
        }
      `}</style>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-center">Welcome to Your Galaxy Circles</h1>
          <p className="text-center text-slate-400 mt-2 mb-10">Connect with like-minded souls in intimate, constellation-themed group chats</p>
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row gap-6 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <StatCard icon={<GroupIcon className="w-8 h-8"/>} title="Active Circles" value={activeCircles} color="text-amber-400"/>
        <StatCard icon={<MessageIcon className="w-8 h-8"/>} title="New Messages" value={newMessages} color="text-pink-400" onClick={() => onNavigate(View.MESSAGES)}/>
        <StatCard icon={<OutlineStarIcon className="w-8 h-8"/>} title="Constellation Links" value={constellationLinks} color="text-emerald-400"/>
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold shimmer-text">Your Galaxy Circles</h2>
        <button 
            onClick={onOpenCreateCircleModal}
            className="flex items-center gap-2 text-slate-900 font-bold px-5 py-3 rounded-lg hover:opacity-90 transition-opacity shimmer-button"
        >
            <PlusIcon className="w-5 h-5"/>
            <span>Create New Circle</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {chats.map((chat, index) => (
          <CircleCard 
            key={chat.id} 
            chat={chat} 
            onJoin={() => onJoinChat(chat.id)}
            delay={0.5 + index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;