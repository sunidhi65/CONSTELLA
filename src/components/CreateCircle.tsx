import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { PlusIcon } from './icons/Dashboard';

interface CreateCircleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string) => void;
}

const CreateCircleModal: React.FC<CreateCircleModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || loading) return;
        setLoading(true);
        setErrMsg(null);
        try {
            // Support both sync and async onCreate
            await Promise.resolve(onCreate(name.trim(), description.trim()));
            setName('');
            setDescription('');
            onClose();
        } catch (err) {
            console.error('Create circle failed:', err);
            setErrMsg('Something went wrong creating the circle. Please try again.');
        } finally {
            setLoading(false);
        }
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
                        className="w-full max-w-md bg-slate-900 rounded-2xl p-8 shadow-2xl shadow-purple-900/60 border border-purple-500/30 text-center relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold text-amber-300 font-cinzel mb-4">Create a New Galaxy Circle</h2>
                        <p className="text-slate-400 mb-8">Forge a new space for souls to connect and share their light.</p>

                        {errMsg && (
                            <div className="mb-4 text-sm text-red-300 bg-red-900/20 border border-red-500/30 rounded-md px-3 py-2">
                                {errMsg}
                            </div>
                        )}

                        
                        <form onSubmit={handleSubmit} className="space-y-6 text-left">
                             <div>
                                <label htmlFor="circle-name" className="block text-sm font-medium text-amber-300 mb-2">Circle Name</label>
                                <input id="circle-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-800/70 border-2 border-amber-500/30 rounded-lg px-4 py-3 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    placeholder="e.g., Starship Philosophers"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="circle-description" className="block text-sm font-medium text-amber-300 mb-2">Circle Description</label>
                                <textarea id="circle-description" value={description} onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-800/70 border-2 border-amber-500/30 rounded-lg px-4 py-3 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    placeholder="What is this circle about?"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                               <button type="button" onClick={() => { if (!loading) onClose(); }} className="w-full bg-transparent border border-slate-600 hover:bg-slate-800 text-slate-300 rounded-lg py-3 px-4 transition-all">
                                    Cancel
                                </button>
                                <Button type="submit" disabled={!name.trim() || loading}>
                                    <div className="flex items-center justify-center gap-2">
                                        <PlusIcon className={`w-5 h-5 ${loading ? 'opacity-60' : ''}`} />
                                        <span>{loading ? 'Creating…' : 'Create Circle'}</span>
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

export default CreateCircleModal;
