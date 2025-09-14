import React, { useMemo } from 'react';
import { Chat, User, Connection, AvatarType } from '../types';
import { motion } from 'framer-motion';
import { MessageIcon, StartChatIcon } from './icons/Dashboard';
import * as AvatarForms from './icons/AvatarFrame';

interface MessagesViewProps {
    allChats: Chat[];
    currentUser: User;
    allUsers: User[];
    connections: Connection[];
    onJoinChat: (chatId: string) => void;
    onCreateNebulaLink: (user1: User, user2: User) => void;
}

const tagColorStyles = {
    blue: 'bg-blue-800/50 text-blue-300',
    purple: 'bg-purple-800/50 text-purple-300',
    green: 'bg-emerald-800/50 text-emerald-300',
};

const CircleCard: React.FC<{ chat: Chat, onJoin: () => void }> = ({ chat, onJoin }) => (
    <div onClick={onJoin} className="bg-slate-900/50 backdrop-blur-md rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer shadow-lg hover:shadow-purple-900/50 flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">{chat.name}</h3>
                <span className={`text-xs font-bold py-1 px-2 rounded-full ${tagColorStyles[chat.tagColor]}`}>{chat.tag}</span>
            </div>
            <p className="text-slate-400 text-sm">{chat.description}</p>
        </div>
    </div>
);

const NebulaLinkCard: React.FC<{ chat: Chat, otherUser: User | undefined, onJoin: () => void }> = ({ chat, otherUser, onJoin }) => {
    if (!otherUser) return null;
    const lastMessage = chat.messages[chat.messages.length - 1];
    
    return (
        <div onClick={onJoin} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
            <div className="relative flex-shrink-0">
                {otherUser.profilePictureUrl ? (
                     <img src={otherUser.profilePictureUrl} alt={otherUser.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: otherUser.color}}>
                        <p className="font-bold text-slate-900 text-xl">{otherUser.name.charAt(0)}</p>
                    </div>
                )}
            </div>
            <div className="flex-grow overflow-hidden">
                <h4 className="font-bold text-white truncate" style={{color: otherUser.color}}>{otherUser.name}</h4>
                <p className="text-sm text-slate-400 truncate">{lastMessage?.text || 'No messages yet.'}</p>
            </div>
        </div>
    );
};

const SuggestedConnectionCard: React.FC<{ user: User, onCreate: () => void }> = ({ user, onCreate }) => (
     <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 border border-dashed border-purple-500/30">
        <div className="relative flex-shrink-0">
             {user.profilePictureUrl ? (
                 <img src={user.profilePictureUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: user.color}}>
                    <p className="font-bold text-slate-900 text-lg">{user.name.charAt(0)}</p>
                </div>
            )}
        </div>
        <div className="flex-grow overflow-hidden">
             <h4 className="font-bold text-white truncate" style={{color: user.color}}>{user.name}</h4>
             <p className="text-sm text-slate-400 truncate">You have a cosmic link.</p>
        </div>
        <button onClick={onCreate} className="p-2 rounded-full bg-purple-600/50 hover:bg-purple-600 text-white transition-colors" title={`Start a chat with ${user.name}`}>
            <StartChatIcon className="w-5 h-5"/>
        </button>
    </div>
)


const MessagesView: React.FC<MessagesViewProps> = ({ allChats, currentUser, allUsers, connections, onJoinChat, onCreateNebulaLink }) => {
    const usersById = useMemo(() => new Map(allUsers.map(user => [user.id, user])), [allUsers]);

    const { nebulaLinks, galaxyCircles } = useMemo(() => {
        const links: Chat[] = [];
        const circles: Chat[] = [];
        allChats.forEach(chat => {
            if(chat.members.includes(currentUser.id)) {
                 if (chat.type === 'NEBULA_LINK') {
                    links.push(chat);
                } else {
                    circles.push(chat);
                }
            }
        });
        return { nebulaLinks: links, galaxyCircles: circles };
    }, [allChats, currentUser.id]);
    
    const existingChatPartners = useMemo(() => {
        const partners = new Set<string>();
        nebulaLinks.forEach(chat => {
            chat.members.forEach(memberId => {
                if (memberId !== currentUser.id) partners.add(memberId);
            });
        });
        return partners;
    }, [nebulaLinks, currentUser.id]);

    const suggestedConnections = useMemo(() => {
        const suggestions = new Map<string, User>();
        connections.forEach(conn => {
            let partnerId: string | null = null;
            if (conn.user1Id === currentUser.id) partnerId = conn.user2Id;
            if (conn.user2Id === currentUser.id) partnerId = conn.user1Id;

            if (partnerId && !existingChatPartners.has(partnerId)) {
                const user = usersById.get(partnerId);
                if (user && user.id !== 'system') {
                    suggestions.set(user.id, user);
                }
            }
        });
        return Array.from(suggestions.values());
    }, [connections, currentUser.id, usersById, existingChatPartners]);

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col text-white overflow-hidden">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl font-bold text-center">Your Messages</h1>
                <p className="text-center text-slate-400 mt-2 mb-10">All your private Nebula Links and group Galaxy Circles in one place.</p>
            </motion.div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0">
                {/* Nebula Links Column */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col bg-slate-900/40 rounded-2xl border border-purple-500/20 p-4">
                    <h2 className="text-2xl font-bold text-pink-300 font-cinzel text-center mb-4">Nebula Links</h2>
                    <div className="flex-grow space-y-2 overflow-y-auto pr-2">
                       {nebulaLinks.map(chat => {
                           const otherUser = usersById.get(chat.members.find(id => id !== currentUser.id) || '');
                           return <NebulaLinkCard key={chat.id} chat={chat} otherUser={otherUser} onJoin={() => onJoinChat(chat.id)} />
                       })}

                        {suggestedConnections.length > 0 && (
                            <div className="pt-4">
                                <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-2 text-center">Suggested Connections</h3>
                                <div className="space-y-2">
                                    {suggestedConnections.map(user => (
                                        <SuggestedConnectionCard key={user.id} user={user} onCreate={() => onCreateNebulaLink(currentUser, user)} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {nebulaLinks.length === 0 && suggestedConnections.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
                                <MessageIcon className="w-12 h-12 opacity-30 mb-4"/>
                                <p>No private messages yet.</p>
                                <p className="text-sm">Start a chat from a Galaxy Circle or a suggestion.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Galaxy Circles Column */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col bg-slate-900/40 rounded-2xl border border-purple-500/20 p-4">
                    <h2 className="text-2xl font-bold text-amber-300 font-cinzel text-center mb-4">Galaxy Circles</h2>
                     <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                        {galaxyCircles.map(chat => (
                            <CircleCard key={chat.id} chat={chat} onJoin={() => onJoinChat(chat.id)} />
                        ))}
                         {galaxyCircles.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
                                <MessageIcon className="w-12 h-12 opacity-30 mb-4"/>
                                <p>You haven't joined any circles.</p>
                                <p className="text-sm">Go to the dashboard to find one!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MessagesView;
