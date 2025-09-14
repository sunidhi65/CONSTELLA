import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AvatarType } from '../types';
import Button from './ui/Button';
import { RadiantStar, CosmicStar, ShimmerStar, NovaStar, AncientStar, DreamStar, MysticOrb, CoreWorld, LunaSphere, ShadowPlanet, RingWorld, DualSphere } from './icons/AvatarFrame';

const stellarForms = [
    { name: 'Radiant Star', Icon: RadiantStar }, { name: 'Cosmic Star', Icon: CosmicStar },
    { name: 'Shimmer Star', Icon: ShimmerStar }, { name: 'Nova Star', Icon: NovaStar },
    { name: 'Ancient Star', Icon: AncientStar }, { name: 'Dream Star', Icon: DreamStar },
];
const planetaryForms = [
    { name: 'Mystic Orb', Icon: MysticOrb }, { name: 'Core World', Icon: CoreWorld },
    { name: 'Luna Sphere', Icon: LunaSphere }, { name: 'Shadow Planet', Icon: ShadowPlanet },
    { name: 'Ring World', Icon: RingWorld }, { name: 'Dual Sphere', Icon: DualSphere },
];

interface AvatarChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAvatarChange: (avatarType: AvatarType, avatarForm: string) => void;
    currentUser: User;
}

const FormCard: React.FC<{name: string, Icon: React.FC<{className: string}>, isSelected: boolean, onSelect: () => void}> = ({ name, Icon, isSelected, onSelect }) => {
    return (
        <motion.div
            onClick={onSelect}
            animate={{ scale: isSelected ? 1.1 : 1, y: isSelected ? -5 : 0 }}
            className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all duration-300 aspect-square justify-center gap-2 relative ${
                isSelected 
                    ? 'border-amber-400 bg-amber-900/20 shadow-[0_0_25px_rgba(251,191,36,0.5)]' 
                    : 'border-amber-400/30 bg-black/30 hover:border-amber-400/70'
            }`}
        >
            <Icon className="w-12 h-12 text-amber-300"/>
            <p className="text-xs text-amber-200/90 font-medium">{name}</p>
        </motion.div>
    );
};

const AvatarChangeModal: React.FC<AvatarChangeModalProps> = ({ isOpen, onClose, onAvatarChange, currentUser }) => {
    const [selectedType, setSelectedType] = useState<AvatarType>(currentUser.avatar);
    const [selectedForm, setSelectedForm] = useState<string>(currentUser.avatarForm);

    const formsToShow = selectedType === AvatarType.STAR ? stellarForms : planetaryForms;

    const handleSave = () => {
        onAvatarChange(selectedType, selectedForm);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-full max-w-2xl bg-slate-900 rounded-2xl p-8 shadow-2xl shadow-purple-900/60 border border-purple-500/30 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl text-center font-bold text-amber-300 font-cinzel mb-4">Change Your Cosmic Form</h2>
                        
                        <div className="flex bg-slate-800/50 p-1 rounded-lg mb-6 max-w-sm mx-auto">
                            <button onClick={() => setSelectedType(AvatarType.STAR)} className={`flex-1 py-2 rounded-md transition-colors text-sm font-bold ${selectedType === AvatarType.STAR ? 'bg-amber-600/80 text-white' : 'text-amber-300/70 hover:bg-slate-700/50'}`}>Stellar</button>
                            <button onClick={() => setSelectedType(AvatarType.PLANET)} className={`flex-1 py-2 rounded-md transition-colors text-sm font-bold ${selectedType === AvatarType.PLANET ? 'bg-amber-600/80 text-white' : 'text-amber-300/70 hover:bg-slate-700/50'}`}>Planetary</button>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8">
                            {formsToShow.map(({ name, Icon }) => (
                                <FormCard 
                                    key={name} 
                                    name={name} 
                                    Icon={Icon} 
                                    isSelected={selectedForm === name}
                                    onSelect={() => setSelectedForm(name)} 
                                />
                            ))}
                        </div>

                        <div className="flex gap-4">
                           <button type="button" onClick={onClose} className="w-full bg-transparent border border-slate-600 hover:bg-slate-800 text-slate-300 rounded-lg py-3 px-4 transition-all">
                                Cancel
                            </button>
                            <Button onClick={handleSave}>Save Form</Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AvatarChangeModal;
