
import React, { useMemo, useState } from 'react';
import { User, Connection } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FourPointStarIcon, OutlineHeartIcon } from './icons/Celestial';
import { ZoomInIcon, ZoomOutIcon } from './icons/Navigation';

interface ConstellationMapProps {
  currentUser: User;
  users: User[];
  connections: Connection[];
}

interface Node extends User {
  x: number;
  y: number;
}

const connectionTypeDetails = {
    SOULMATE: { label: 'Soulmate Connection', color: '#f472b6', gradient: 'url(#soulmate-gradient)', className: 'pulsing-line-soulmate' },
    FRIEND: { label: 'Friend Connection', color: '#60a5fa', gradient: 'url(#friend-gradient)', className: 'pulsing-line-friend' },
    INTEREST: { label: 'Interest Connection', color: '#34d399', gradient: 'url(#interest-gradient)', className: 'pulsing-line-interest' },
};

const ConnectionNode: React.FC<{ node: Node, isCurrentUser: boolean }> = ({ node, isCurrentUser }) => (
    <motion.div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
        style={{ left: `${node.x}%`, top: `${node.y}%` }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, zIndex: 10 }}
    >
        <div className="relative w-4 h-4 rounded-full bg-amber-300 shadow-[0_0_10px_2px_rgba(251,191,36,0.7)] group-hover:shadow-[0_0_15px_4px_rgba(251,191,36,0.9)] transition-all" />
        <div className={`mt-2 py-1 px-3 bg-slate-800/80 rounded-full text-sm font-bold transition-all ${isCurrentUser ? 'text-purple-300' : 'text-slate-300'}`}>
           <div className="flex items-center gap-1.5">
              {isCurrentUser && <OutlineHeartIcon className="w-3 h-3" />}
              <span>{isCurrentUser ? 'You' : node.name}</span>
           </div>
        </div>
    </motion.div>
);

const ConstellationMap: React.FC<ConstellationMapProps> = ({ currentUser, users, connections }) => {
    const [scale, setScale] = useState(1);
    const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

    const nodes = useMemo<Node[]>(() => {
        const nodePositions: { [key: string]: { x: number, y: number } } = {
            [currentUser.id]: { x: 45, y: 65 }, 'user_5': { x: 20, y: 50 }, 'user_6': { x: 40, y: 85 },
            'user_2': { x: 50, y: 40 }, 'user_7': { x: 68, y: 55 }, 'user_3': { x: 70, y: 35 },
            'system': { x: 78, y: 48 }, 'user_1': { x: 80, y: 75 }, 'user_8': { x: 82, y: 90 },
            'user_4': { x: 10, y: 15 },
        };
        return users.filter(user => nodePositions[user.id]).map(user => ({ ...user, ...nodePositions[user.id]! }));
    }, [currentUser.id, users]);

    const userNodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);
    
    const selectedConnectionDetails = useMemo(() => {
        if (!selectedConnection) return null;
        const user1 = userNodeMap.get(selectedConnection.user1Id);
        const user2 = userNodeMap.get(selectedConnection.user2Id);
        if (!user1 || !user2) return null;
        return { user1, user2, typeInfo: connectionTypeDetails[selectedConnection.type] };
    }, [selectedConnection, userNodeMap]);

    return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 overflow-hidden">
            <style>{`
              @keyframes pulse-glow-soulmate { 0%, 100% { stroke-opacity: 0.4; filter: drop-shadow(0 0 2px rgba(244, 114, 182, 0.5)); } 50% { stroke-opacity: 0.9; filter: drop-shadow(0 0 5px rgba(244, 114, 182, 0.9)); } }
              @keyframes pulse-glow-friend { 0%, 100% { stroke-opacity: 0.4; filter: drop-shadow(0 0 2px rgba(96, 165, 250, 0.5)); } 50% { stroke-opacity: 0.9; filter: drop-shadow(0 0 5px rgba(96, 165, 250, 0.9)); } }
              @keyframes pulse-glow-interest { 0%, 100% { stroke-opacity: 0.4; filter: drop-shadow(0 0 2px rgba(52, 211, 153, 0.5)); } 50% { stroke-opacity: 0.9; filter: drop-shadow(0 0 5px rgba(52, 211, 153, 0.9)); } }
              .pulsing-line-soulmate { animation: pulse-glow-soulmate 4s ease-in-out infinite; animation-delay: calc(var(--i) * 150ms); }
              .pulsing-line-friend { animation: pulse-glow-friend 4s ease-in-out infinite; animation-delay: calc(var(--i) * 150ms); }
              .pulsing-line-interest { animation: pulse-glow-interest 4s ease-in-out infinite; animation-delay: calc(var(--i) * 150ms); }
            `}</style>
            
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full flex flex-col items-center text-center flex-shrink-0">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-cinzel tracking-wider">Your Connection Universe</h1>
                <p className="text-slate-400 max-w-2xl">Watch your relationships bloom into a beautiful constellation of meaningful connections.</p>
            </motion.div>

            <div className="w-full flex-grow flex gap-6 mt-6 min-h-0">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.3 }} className="w-full flex-grow max-w-6xl mx-auto bg-slate-900/40 rounded-3xl border border-purple-500/20 p-2 relative overflow-hidden">
                    <div className="w-full h-full relative transition-transform duration-300 ease-in-out" style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
                        <svg className="absolute top-0 left-0 w-full h-full" style={{ overflow: 'visible' }}>
                            <defs>
                                <linearGradient id="soulmate-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f9a8d4" /><stop offset="100%" stopColor="#f472b6" /></linearGradient>
                                <linearGradient id="friend-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#93c5fd" /><stop offset="100%" stopColor="#60a5fa" /></linearGradient>
                                <linearGradient id="interest-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6ee7b7" /><stop offset="100%" stopColor="#34d399" /></linearGradient>
                            </defs>
                            {connections.map((conn, i) => {
                                const user1 = userNodeMap.get(conn.user1Id);
                                const user2 = userNodeMap.get(conn.user2Id);
                                if (!user1 || !user2) return null;
                                const typeInfo = connectionTypeDetails[conn.type];
                                return (
                                    <motion.line key={`conn-${i}`} x1={`${user1.x}%`} y1={`${user1.y}%`} x2={`${user2.x}%`} y2={`${user2.y}%`}
                                        stroke={typeInfo.gradient} strokeWidth="2.5" className={typeInfo.className}
                                        style={{'--i': i, cursor: 'pointer'} as React.CSSProperties}
                                        onClick={() => setSelectedConnection(conn)}
                                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: 'easeInOut' }}
                                    />
                                );
                            })}
                        </svg>

                        {nodes.map(node => (
                            <ConnectionNode key={node.id} node={node} isCurrentUser={node.id === currentUser.id} />
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="w-[350px] flex-shrink-0 bg-slate-900/40 rounded-2xl border border-purple-500/20 p-4 flex flex-col">
                    <div className="flex justify-end gap-2 mb-4">
                        <button onClick={() => setScale(s => Math.max(0.5, s / 1.2))} className="p-2 rounded-full bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"><ZoomOutIcon className="w-5 h-5"/></button>
                        <button onClick={() => setScale(s => Math.min(2, s * 1.2))} className="p-2 rounded-full bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"><ZoomInIcon className="w-5 h-5"/></button>
                    </div>
                    
                    <h2 className="text-xl font-bold text-amber-200 font-cinzel">Connection Details</h2>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent my-3"/>

                    <div className="flex-grow flex items-center justify-center">
                        <AnimatePresence mode="wait">
                        {selectedConnectionDetails ? (
                            <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center space-y-4 w-full">
                                <div className="flex items-center justify-center gap-2 text-lg">
                                    <span className="font-bold" style={{color: selectedConnectionDetails.user1.color}}>{selectedConnectionDetails.user1.id === currentUser.id ? 'You' : selectedConnectionDetails.user1.name}</span>
                                    <span className="text-slate-400">&</span>
                                    <span className="font-bold" style={{color: selectedConnectionDetails.user2.color}}>{selectedConnectionDetails.user2.id === currentUser.id ? 'You' : selectedConnectionDetails.user2.name}</span>
                                </div>
                                <div>
                                    <p className="text-lg font-bold" style={{color: selectedConnectionDetails.typeInfo.color}}>{selectedConnectionDetails.typeInfo.label}</p>
                                    <p className="text-sm text-slate-400 mt-1">A bond has been formed in the cosmos.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center text-slate-400 p-8">
                                <FourPointStarIcon className="w-12 h-12 text-slate-600 mb-4 opacity-50" />
                                <p>Click on a connection line to view its details.</p>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-auto">
                        <h3 className="text-xl font-bold text-amber-200 font-cinzel">Connection Types</h3>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent my-3"/>
                        <ul className="space-y-3">
                            {Object.values(connectionTypeDetails).map(type => (
                                <li key={type.label} className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: type.color, boxShadow: `0 0 8px ${type.color}` }}></span>
                                    <span className="text-slate-300 text-sm">{type.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ConstellationMap;
