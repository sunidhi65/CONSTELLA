
import React from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import Button from './ui/Button';

interface ConnectionModalProps {
    user: User;
    onAccept: () => void;
    onDecline: () => void;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({ user, onAccept, onDecline }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.8, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full max-w-sm bg-slate-900 rounded-2xl p-8 shadow-2xl shadow-purple-900/80 border border-purple-500/50 text-center"
            >
                <h3 className="font-orbitron text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                    Orbit Alignment Detected
                </h3>
                <p className="text-slate-300 my-4">
                    The cosmos suggests a strong vibe between you and <span className="font-bold" style={{color: user.color}}>{user.name}</span>.
                </p>
                <p className="text-slate-400 text-sm mb-6">
                    Would you like to open a private Nebula Link to chat directly?
                </p>
                <div className="flex gap-4">
                    <Button onClick={onAccept} className="w-full">Open Nebula Link</Button>
                    <button onClick={onDecline} className="w-full bg-transparent border border-slate-600 hover:bg-slate-800 text-slate-300 rounded-lg py-2 px-4 transition-all">
                        Maybe Later
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ConnectionModal;
