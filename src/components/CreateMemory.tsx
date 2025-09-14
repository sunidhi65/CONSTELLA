import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { PlusIcon } from './icons/Dashboard';
import { MemoryType, User, Memory } from '../types';

interface CreateMemoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (memoryData: Omit<Memory, 'id'>) => void;
    allUsers: User[];
    currentUser: User;
}

const memoryTypes: MemoryType[] = ['milestone', 'moment', 'message'];

const CreateMemoryModal: React.FC<CreateMemoryModalProps> = ({ isOpen, onClose, onCreate, allUsers, currentUser }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<MemoryType>('moment');
    const [participants, setParticipants] = useState<string[]>([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || loading) return;
        setLoading(true);
        setErrMsg(null);
        try {
            await Promise.resolve(onCreate({
                title: title.trim(),
                description: description.trim(),
                type,
                date: new Date().toISOString(),
                context: "Personal Entry",
                participants: [currentUser.id, ...participants],
                isPrivate,
            }));
            // Reset form
            setTitle('');
            setDescription('');
            setType('moment');
            setParticipants([]);
            setIsPrivate(false);
            onClose();
        } catch (err) {
            console.error('Create memory failed:', err);
            setErrMsg('Something went wrong creating the memory. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleParticipantToggle = (userId: string) => {
        setParticipants(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => { if (!loading) onClose(); }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-full max-w-lg bg-slate-900 rounded-2xl p-8 shadow-2xl shadow-amber-900/50 border border-amber-500/20 text-center relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold text-amber-300 font-cinzel mb-2">Create a Memory Capsule</h2>
                        <p className="text-slate-400 mb-6">Preserve a moment in time.</p>

                        {errMsg && (
                            <div className="mb-4 text-sm text-red-300 bg-red-900/20 border border-red-500/30 rounded-md px-3 py-2">
                                {errMsg}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <div>
                                <label htmlFor="mem-title" className="block text-sm font-medium text-amber-300 mb-2">Title</label>
                                <input id="mem-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-800/70 border-2 border-amber-500/30 rounded-lg px-4 py-2 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                            </div>
                            <div>
                                <label htmlFor="mem-desc" className="block text-sm font-medium text-amber-300 mb-2">Description</label>
                                <textarea id="mem-desc" value={description} onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-800/70 border-2 border-amber-500/30 rounded-lg px-4 py-2 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500" rows={3} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-amber-300 mb-2">Type</label>
                                <div className="flex gap-2">
                                    {memoryTypes.map(memType => (
                                        <button type="button" key={memType} onClick={() => setType(memType)}
                                            className={`capitalize flex-1 py-2 text-sm rounded-lg transition-colors ${type === memType ? 'bg-amber-600/80 text-white font-bold' : 'bg-slate-800/70 hover:bg-slate-700 text-amber-200'}`}>
                                            {memType}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-amber-300 mb-2">Participants</label>
                                <div className="max-h-24 overflow-y-auto bg-slate-800/70 p-2 rounded-lg border-2 border-amber-500/30 flex flex-wrap gap-2">
                                    {allUsers.length > 0 ? allUsers.map(user => (
                                        <button type="button" key={user.id} onClick={() => handleParticipantToggle(user.id)}
                                            className={`text-xs py-1 px-3 rounded-full transition-all ${participants.includes(user.id) ? 'font-bold text-slate-900' : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300'}`}
                                            style={{backgroundColor: participants.includes(user.id) ? user.color : undefined}}>
                                            {user.name}
                                        </button>
                                    )) : <p className="text-slate-500 text-xs p-2">No other users to add.</p>}
                                </div>
                            </div>
                             <div className="flex items-center justify-between">
                                <label htmlFor="is-private" className="text-sm font-medium text-amber-300">Private Memory</label>
                                <button type="button" onClick={() => setIsPrivate(!isPrivate)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isPrivate ? 'bg-amber-500' : 'bg-slate-700'}`}>
                                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                             </div>

                            <div className="flex gap-4 pt-4">
                               <button type="button" onClick={() => { if (!loading) onClose(); }} className="w-full bg-transparent border border-slate-600 hover:bg-slate-800 text-slate-300 rounded-lg py-3 px-4 transition-all">Cancel</button>
                               <Button type="submit" disabled={!title.trim() || loading}>
                                    <div className="flex items-center justify-center gap-2">
                                        <PlusIcon className={`w-5 h-5 ${loading ? 'opacity-60' : ''}`} />
                                        <span>{loading ? 'Creating…' : 'Create Capsule'}</span>
                                    </div>
                               </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreateMemoryModal;