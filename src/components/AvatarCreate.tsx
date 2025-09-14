import React, { useState, useRef, useMemo } from 'react';
import { AvatarType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { OutlineStarIcon, WorldIcon, OutlineHeartIcon, CreatorHeaderLogo } from './icons/Celestial';
import { BackArrowIcon, SparkleIcon } from './icons/Navigation';
import { RadiantStar, CosmicStar, ShimmerStar, NovaStar, AncientStar, DreamStar, MysticOrb, CoreWorld, LunaSphere, ShadowPlanet, RingWorld, DualSphere } from './icons/AvatarFrame';
import Button from './ui/Button';

interface AvatarCreatorProps {
  onLogin: (name: string, bio: string, avatar: AvatarType, avatarForm: string) => void;
  onBack: () => void;
}

const stellarForms = [
    { name: 'Radiant Star', Icon: RadiantStar },
    { name: 'Cosmic Star', Icon: CosmicStar },
    { name: 'Shimmer Star', Icon: ShimmerStar },
    { name: 'Nova Star', Icon: NovaStar },
    { name: 'Ancient Star', Icon: AncientStar },
    { name: 'Dream Star', Icon: DreamStar },
];

const planetaryForms = [
    { name: 'Mystic Orb', Icon: MysticOrb },
    { name: 'Core World', Icon: CoreWorld },
    { name: 'Luna Sphere', Icon: LunaSphere },
    { name: 'Shadow Planet', Icon: ShadowPlanet },
    { name: 'Ring World', Icon: RingWorld },
    { name: 'Dual Sphere', Icon: DualSphere },
];

const allForms = [...stellarForms, ...planetaryForms];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ onLogin, onBack }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarType, setAvatarType] = useState<AvatarType | null>(null);
  const [avatarForm, setAvatarForm] = useState<string | null>(null);

  const handleSelectNature = (type: AvatarType) => {
    setAvatarType(type);
    setAvatarForm(null); // Reset form choice if nature is changed
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && avatarType && avatarForm) {
      onLogin(name, bio, avatarType, avatarForm);
    }
  };
  
  const formsToShow = avatarType === AvatarType.STAR ? stellarForms : planetaryForms;
  const isFormComplete = name.trim() !== '' && avatarType !== null && avatarForm !== null;
  
  const selectedForm = useMemo(() => allForms.find(f => f.name === avatarForm), [avatarForm]);
  const sectionTitleStyle = {textShadow: '0 0 8px rgba(255, 255, 255, 0.5)'};

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-br from-[#0c0a1a] via-[#110e2e] to-[#1a1642] overflow-y-auto">
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3 text-white" style={{filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))'}}>
          <CreatorHeaderLogo />
          <span className="text-lg font-bold">Avatar Creation</span>
        </div>
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 transition-all group hover:text-white"
          style={{textShadow: '0 0 8px rgba(255, 255, 255, 0.5)'}}
        >
          <BackArrowIcon className="transition-colors" />
          <SparkleIcon className="transition-colors" />
          <span className="text-sm font-bold">Back to Galaxy</span>
        </button>
      </header>
      
      <main className="w-full max-w-5xl mx-auto flex flex-col items-center">
         <motion.div variants={itemVariants} className="flex items-center gap-3 mb-2 text-white" style={{filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))'}}>
          <OutlineStarIcon className="w-8 h-8"/>
          <h1 className="text-3xl md:text-4xl font-bold">Create Your Cosmic Avatar</h1>
        </motion.div>
        <motion.p variants={itemVariants} className="text-slate-300/90 mb-10">Choose your celestial form and become part of the Constella universe</motion.p>

        <motion.form 
            onSubmit={handleSubmit} 
            className="w-full flex flex-col items-center gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          {/* Step 1: Cosmic Nature */}
          <motion.section variants={itemVariants} className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-white mb-6" style={sectionTitleStyle}>Choose Your Cosmic Nature</h2>
            <div className="flex flex-col md:flex-row gap-6 w-full justify-center max-w-4xl">
              <NatureCard type={AvatarType.STAR} title="Stellar Being" description="Radiate energy and warmth, connecting through light and inspiration" tags={['Inspiring', 'Energetic', 'Bright', 'Guiding']} isSelected={avatarType === AvatarType.STAR} onSelect={() => handleSelectNature(AvatarType.STAR)} />
              <NatureCard type={AvatarType.PLANET} title="Cosmic World" description="Grounded yet mysterious, offering depth and discovery" tags={['Wise', 'Stable', 'Deep', 'Mysterious']} isSelected={avatarType === AvatarType.PLANET} onSelect={() => handleSelectNature(AvatarType.PLANET)} />
            </div>
          </motion.section>

          {/* Step 2: Form Selection */}
          <AnimatePresence>
            {avatarType && (
              <motion.section 
                key="form-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                <h2 className="text-2xl font-semibold text-white mb-6" style={sectionTitleStyle}>{`Select Your ${avatarType === AvatarType.STAR ? 'Stellar' : 'Planetary'} Form`}</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 w-full max-w-4xl">
                    {formsToShow.map(({ name, Icon }) => (
                        <FormCard 
                            key={name} 
                            name={name} 
                            Icon={Icon} 
                            isSelected={avatarForm === name}
                            isAnySelected={avatarForm !== null}
                            onSelect={() => setAvatarForm(name)} 
                        />
                    ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Step 3: Cosmic Identity */}
          <AnimatePresence>
             {avatarForm && avatarType && selectedForm && (
                <motion.section 
                    key="identity-input"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-2xl flex flex-col items-center gap-6"
                >
                    <h2 className="text-2xl font-semibold text-white mb-2" style={sectionTitleStyle}>Cosmic Identity</h2>
                    <div className="w-full bg-slate-900/40 border-2 border-slate-500/20 rounded-2xl p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 flex-shrink-0">
                                <selectedForm.Icon className="w-full h-full text-white" style={{filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))'}} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Your Avatar Preview</h3>
                                <p className="text-slate-300/80">{avatarType === AvatarType.STAR ? 'Stellar Being' : 'Cosmic World'}</p>
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">Cosmic Name</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-800/70 border-2 border-slate-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-white/80 transition-all"
                                placeholder="Enter your cosmic name..."
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-white mb-2">Cosmic Bio (Optional)</label>
                            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)}
                                className="w-full bg-slate-800/70 border-2 border-slate-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-white/80 transition-all"
                                placeholder="Share your cosmic essence..."
                                rows={3}
                            />
                        </div>
                    </div>
                </motion.section>
             )}
          </AnimatePresence>

          <motion.footer variants={itemVariants} className="mt-4 flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300/80">
              <OutlineHeartIcon/>
              <span>Complete all steps to begin your cosmic journey</span>
            </div>
            <AnimatePresence>
                {isFormComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="w-full max-w-xs"
                    >
                         <Button 
                           type="submit"
                           className="!border-slate-400/60 !text-slate-300/90 hover:!border-white hover:!text-white hover:!shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                         >
                           Become Part of the Universe
                         </Button>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.footer>
        </motion.form>
      </main>
    </div>
  );
};


const NatureCard: React.FC<{type: AvatarType, title: string, description: string, tags: string[], isSelected: boolean, onSelect: () => void}> = ({ type, title, description, tags, isSelected, onSelect }) => {
  const Icon = type === AvatarType.STAR ? OutlineStarIcon : WorldIcon;
  return (
    <motion.div
      onClick={onSelect}
      className={`cursor-pointer p-6 rounded-2xl border-2 flex-1 w-full md:max-w-sm flex flex-col items-center text-center transition-all duration-300 ${isSelected ? 'border-white bg-slate-800/20 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'border-slate-400/30 bg-black/30 hover:border-white/70 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}
      whileHover={{ scale: 1.03 }}
      animate={{ scale: isSelected ? 1.03 : 1 }}
    >
      <Icon className="w-16 h-16 text-white mb-4" style={{filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))'}} />
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300/80 text-sm mb-4 flex-grow">{description}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {tags.map(tag => (
          <span key={tag} className="text-xs bg-slate-800/50 text-slate-200/90 px-3 py-1 rounded-full">{tag}</span>
        ))}
      </div>
    </motion.div>
  );
};

// FIX: Update the type definition for the 'Icon' prop to include 'style', resolving a type error when applying dynamic styles.
const FormCard: React.FC<{name: string, Icon: React.FC<{className?: string; style?: React.CSSProperties;}>, isSelected: boolean, onSelect: () => void, isAnySelected: boolean}> = ({ name, Icon, isSelected, onSelect, isAnySelected }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;
        const rotateX = (y / height - 0.5) * -25; // Invert for natural feel
        const rotateY = (x / width - 0.5) * 25;
        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    const isDeselected = isAnySelected && !isSelected;
    
    return (
        <div style={{ perspective: '800px' }}>
            <motion.div
                ref={ref}
                onClick={onSelect}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transformStyle: 'preserve-3d',
                    rotateX: rotate.x,
                    rotateY: rotate.y,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                animate={{ 
                    scale: isSelected ? 1.1 : (isDeselected ? 0.9 : 1),
                    filter: isDeselected ? 'saturate(0.5) opacity(0.7)' : 'saturate(1) opacity(1)',
                }}
                className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all duration-300 aspect-square justify-center gap-2 relative ${
                    isSelected 
                        ? 'border-white bg-slate-800/20 shadow-[0_0_25px_rgba(255,255,255,0.5)]' 
                        : isDeselected
                        ? 'border-slate-400/20 bg-black/20'
                        : 'border-slate-400/30 bg-black/30 hover:border-white/70 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                }`}
            >
                <motion.div style={{ transform: 'translateZ(30px)' }}>
                    <Icon className="w-12 h-12 text-white" style={{filter: isSelected ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))' : 'none', transition: 'filter 0.3s'}}/>
                </motion.div>
                <motion.p style={{ transform: 'translateZ(15px)' }} className="text-sm text-slate-200/90 font-medium">
                    {name}
                </motion.p>
            </motion.div>
        </div>
    )
}

export default AvatarCreator;