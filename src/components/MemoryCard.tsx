// FIX: Imported `useMemo` from React to resolve reference error.
import React, { useMemo } from 'react';
import { Memory, User, MemoryType } from '../types';
import { motion } from 'framer-motion';
import { OutlineStarIcon, OutlineHeartIcon } from './icons/Celestial';
// FIX: Imported `MemoryCapsulesIcon` to resolve reference error.
import { MessageIcon, LockIcon, CalendarIcon, MemoryCapsulesIcon } from './icons/Dashboard';
import { FourPointStarIcon } from './icons/Celestial';

interface MemoryCapsulesProps {
  memories: Memory[];
  allUsers: User[];
}

const memoryTypeDetails: Record<MemoryType, { icon: React.FC<{className?: string}>, tag: string, color: string, tagBg: string, borderColor: string }> = {
    milestone: { icon: OutlineStarIcon, tag: 'milestone', color: 'text-pink-300', tagBg: 'bg-pink-900/50', borderColor: 'border-pink-500/20' },
    moment: { icon: OutlineHeartIcon, tag: 'moment', color: 'text-emerald-300', tagBg: 'bg-emerald-900/50', borderColor: 'border-emerald-500/20' },
    message: { icon: MessageIcon, tag: 'message', color: 'text-sky-300', tagBg: 'bg-sky-900/50', borderColor: 'border-sky-500/20' },
};

const ParticipantAvatars: React.FC<{ participantIds: string[], usersById: Map<string, User> }> = ({ participantIds, usersById }) => {
    const participants = participantIds.map(id => usersById.get(id)).filter(Boolean) as User[];
    const displayedParticipants = participants.slice(0, 3);
    const remainingCount = participants.length - displayedParticipants.length;

    return (
        <div className="flex items-center">
            {displayedParticipants.map((user, index) => (
                <div key={user.id} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center font-bold text-sm" style={{ backgroundColor: user.color, marginLeft: index > 0 ? '-10px' : 0, zIndex: 3 - index, color: '#0c0a1a' }} title={user.name}>
                    {user.avatar === 'STAR' ? '✦' : user.name.charAt(0).toUpperCase()}
                </div>
            ))}
            {remainingCount > 0 && (
                 <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-900 flex items-center justify-center font-bold text-xs text-slate-200" style={{ marginLeft: '-10px', zIndex: 0 }}>
                    +{remainingCount}
                </div>
            )}
        </div>
    );
};

const MemoryCard: React.FC<{ memory: Memory, usersById: Map<string, User>, delay: number }> = ({ memory, usersById, delay }) => {
    const details = memoryTypeDetails[memory.type];

    const formattedDate = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(memory.date));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border ${details.borderColor} hover:border-slate-500/40 transition-all shadow-lg hover:shadow-purple-900/30 flex flex-col`}
        >
            <div className="flex justify-between items-start mb-3">
                <div className={`flex items-center gap-3 ${details.color}`}>
                    <details.icon className="w-6 h-6"/>
                    <span className={`text-xs font-bold py-1 px-3 rounded-full ${details.tagBg}`}>{details.tag}</span>
                </div>
                {memory.isPrivate && <LockIcon className="w-5 h-5 text-slate-500"/>}
            </div>
            
            <h3 className="font-bold text-xl text-amber-100 font-cinzel mb-2">{memory.title}</h3>
            <p className="text-slate-400 text-sm mb-6 flex-grow">{memory.description}</p>
            
            <div className="border-t border-slate-700/50 pt-4 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <CalendarIcon className="w-4 h-4"/>
                        <span>{formattedDate}</span>
                    </div>
                     <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FourPointStarIcon className="w-4 h-4"/>
                        <span>{memory.context}</span>
                    </div>
                </div>
                <ParticipantAvatars participantIds={memory.participants} usersById={usersById} />
            </div>
        </motion.div>
    );
};

const MemoryCapsules: React.FC<MemoryCapsulesProps> = ({ memories, allUsers }) => {
    const usersById = useMemo(() => new Map(allUsers.map(user => [user.id, user])), [allUsers]);

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col text-white">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
                <h2 className="font-cinzel text-center text-4xl font-bold text-amber-200" style={{textShadow: '0 0 10px rgba(251, 191, 36, 0.4)'}}>
                    Your Cosmic Memory Capsules
                </h2>
                <p className="text-center text-slate-400 mt-2 mb-10 max-w-2xl mx-auto">Preserved moments, milestones, and connections from your constellation journey</p>
            </motion.div>
            
            {memories.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500">
                    <MemoryCapsulesIcon className="w-16 h-16 opacity-30 mb-4"/>
                    <p className="text-lg">No memories saved yet.</p>
                    <p>Click "Create Memory" to preserve a special moment.</p>
                </div>
            ) : (
                 <div className="flex-grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {memories.map((memory, index) => (
                           <MemoryCard 
                                key={memory.id} 
                                memory={memory}
                                usersById={usersById}
                                delay={0.2 + index * 0.1}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoryCapsules;