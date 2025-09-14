import React, { useState, useMemo, useRef } from 'react';
import { User, Chat, Connection, Memory } from '../types';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { EditIcon, CameraIcon } from './icons/Dashboard';
import * as AvatarForms from './icons/AvatarFrame';

interface ProfileProps {
    currentUser: User;
    chats: Chat[];
    connections: Connection[];
    memories: Memory[];
    onUpdateProfile: (name: string, bio: string) => void;
    onOpenAvatarModal: () => void;
    onUpdateProfilePicture: (imageUrl: string) => void;
    onLogout: () => void;
}

const StatDisplay: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="text-4xl font-bold text-amber-300 font-orbitron">{value}</p>
        <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
);


const Profile: React.FC<ProfileProps> = ({ currentUser, chats, connections, memories, onUpdateProfile, onOpenAvatarModal, onUpdateProfilePicture, onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(currentUser.name);
    const [bio, setBio] = useState(currentUser.bio || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const AvatarComponent = useMemo(() => {
        const formName = currentUser.avatarForm.replace(/\s/g, '');
        return (AvatarForms as any)[formName] || AvatarForms.RadiantStar;
    }, [currentUser.avatarForm]);
    
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateProfilePicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onUpdateProfile(name, bio);
        setIsEditing(false);
    };

    const handleEditToggle = () => {
        if (isEditing) {
            handleSave();
        } else {
            setName(currentUser.name);
            setBio(currentUser.bio || '');
            setIsEditing(true);
        }
    };
    
    // Calculate stats
    const circlesJoined = useMemo(() => chats.filter(c => c.type === 'GALAXY_CIRCLE' && c.members.includes(currentUser.id)).length, [chats, currentUser.id]);
    const connectionsMade = useMemo(() => connections.filter(c => c.user1Id === currentUser.id || c.user2Id === currentUser.id).length, [connections, currentUser.id]);
    const memoriesCaptured = useMemo(() => memories.filter(m => m.participants.includes(currentUser.id)).length, [memories, currentUser.id]);

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col items-center justify-center text-white overflow-y-auto">
            <motion.div 
                className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-md rounded-2xl p-8 border border-purple-500/20 shadow-lg shadow-purple-900/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative group flex-shrink-0">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                         <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center border-2 border-purple-400/30 cursor-pointer overflow-hidden group"
                            aria-label="Upload profile picture"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                        >
                            {currentUser.profilePictureUrl ? (
                                <img src={currentUser.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <CameraIcon className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                                    <span className="text-xs text-slate-400">Upload Photo</span>
                                </div>
                            )}
                             <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <CameraIcon className="w-8 h-8 text-white mb-1" />
                                <span className="text-white text-xs font-bold">Change Photo</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow text-center sm:text-left w-full">
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                className="w-full bg-transparent border-b-2 border-amber-500/30 text-3xl font-bold text-amber-300 font-cinzel focus:outline-none focus:border-amber-500 mb-2 transition-colors" 
                            />
                        ) : (
                            <h2 className="text-3xl font-bold text-amber-300 font-cinzel mb-2">{currentUser.name}</h2>
                        )}
                        
                        {isEditing ? (
                            <textarea 
                                value={bio} 
                                onChange={e => setBio(e.target.value)} 
                                className="w-full bg-slate-800/70 border-2 border-amber-500/30 rounded-lg p-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all" 
                                placeholder="Add a cosmic bio..."
                                rows={2}
                            ></textarea>
                        ) : (
                            <p className="text-slate-300 min-h-[3.5rem]">{currentUser.bio || 'No bio yet. Click Edit Profile to add one.'}</p>
                        )}
                        
                         <div className="mt-4 pt-4 border-t border-purple-500/20">
                             <p className="text-sm text-slate-400 mb-2">Cosmic Form</p>
                             <div className="flex items-center justify-center sm:justify-start gap-3">
                                <AvatarComponent className="w-10 h-10 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                <span className="font-semibold text-purple-300">{currentUser.avatarForm}</span>
                                <button 
                                    onClick={onOpenAvatarModal} 
                                    aria-label="Change Avatar Form"
                                    title="Change Symbolic Form"
                                    className="ml-auto bg-slate-700/50 text-slate-300 p-2 rounded-full hover:bg-slate-600 hover:text-white transition-all"
                                >
                                    <EditIcon className="w-5 h-5" />
                                </button>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="my-8 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                <div className="flex justify-around">
                    <StatDisplay value={circlesJoined} label="Circles Joined" />
                    <StatDisplay value={connectionsMade} label="Connections" />
                    <StatDisplay value={memoriesCaptured} label="Memories" />
                </div>
                
                <div className="mt-8 space-y-4">
                    <Button onClick={handleEditToggle} className="w-full flex items-center justify-center gap-2">
                        <EditIcon className="w-5 h-5"/>
                        <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                    </Button>
                     <button 
                        onClick={onLogout}
                        className="w-full bg-red-900/40 border-2 border-red-500/60 text-red-300/90 font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:border-red-500 hover:text-red-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                    >
                        Logout
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;