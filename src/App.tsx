import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { type User, AvatarType, type Chat, View, type Connection, type Memory, type Message } from './types';
import AvatarCreator from './components/AvatarCreate'; 
import Dashboard from './components/GalaxyLobby';
import ChatView from './components/ChatView';
import ConstellationMap from './components/Constellation';
import MemoryCapsules from './components/MemoryCard';
import Profile from './components/Profile';
import MessagesView from './components/MessagesView';
import StarfieldBackground from './components/StarfieldBackground';
import { BackArrowIcon, BackIcon } from './components/icons/Navigation';
import { motion } from 'framer-motion';
import CreateCircleModal from './components/CreateCircle';
import CreateMemoryModal from './components/CreateMemory';
import AvatarChangeModal from './components/AvatarChange';
import { PlusIcon } from './components/icons/Dashboard';
import * as api from './server/api';

const heartPoints = [
    { x: 50, y: 95 }, { x: 20, y: 80 }, { x: 5, y: 55 }, { x: 10, y: 40 }, { x: 25, y: 25 }, 
    { x: 50, y: 35 }, { x: 75, y: 25 }, { x: 90, y: 40 }, { x: 95, y: 55 }, { x: 80, y: 80 }, 
    { x: 30, y: 65 }, { x: 45, y: 75 }, { x: 50, y: 50 }, { x: 35, y: 45 }, { x: 65, y: 45 }, 
    { x: 70, y: 65 }, { x: 55, y: 75 }
];

const heartLines = [
    [0, 9], [9, 8], [8, 7], [7, 6], [6, 5], [5, 4], [4, 3], [3, 2], [2, 1], [1, 0], 
    [1, 10], [2, 10], [3, 13], [4, 13], [5, 13], [5, 14], [6, 14], [7, 14], [8, 15], [9, 15], 
    [0, 11], [0, 16], [11, 10], [16, 15], [10, 13], [13, 12], [12, 14], [14, 15], [15, 12], [12, 10], 
    [11, 12], [16, 12], [13, 14]
];

const HeartConstellationSVG: React.FC = () => (
    <svg viewBox="0 0 100 100" className="w-full h-auto" style={{filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'}}>
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g>
            {heartLines.map(([p1, p2], i) => (
                <motion.line key={i} x1={heartPoints[p1].x} y1={heartPoints[p1].y} x2={heartPoints[p2].x} y2={heartPoints[p2].y} stroke="white" strokeWidth="0.5" strokeOpacity="0.7" 
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1 + i * 0.05, ease: 'easeInOut' }} />
            ))}
            {heartPoints.map((p, i) => (
                <motion.circle key={i} cx={p.x} cy={p.y} r={i === 12 ? 2 : 1.2} fill="white" filter="url(#glow)"
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: 'backOut' }} />
            ))}
        </g>
    </svg>
);


const HeaderLogo: React.FC = () => {
    const outlinePoints = [heartPoints[0], heartPoints[1], heartPoints[2], heartPoints[3], heartPoints[4], heartPoints[5], heartPoints[6], heartPoints[7], heartPoints[8], heartPoints[9]];
    const outlineLines = [[0, 9], [9, 8], [8, 7], [7, 6], [6, 5], [5, 4], [4, 3], [3, 2], [2, 1], [1, 0]];
    return (
        <div className="w-8 h-8">
            <svg viewBox="0 0 100 100" className="w-full h-auto" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 3px rgba(251, 191, 36, 0.7))' }}>
                <g stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.8" fill="#fbbf24">
                    {outlineLines.map(([p1, p2], i) => (
                        <line key={`line-${i}`} x1={outlinePoints[p1].x} y1={outlinePoints[p1].y} x2={outlinePoints[p2].x} y2={outlinePoints[p2].y} />
                    ))}
                    {outlinePoints.map((p, i) => (
                        <circle key={`point-${i}`} cx={p.x} cy={p.y} r={3} />
                    ))}
                </g>
            </svg>
        </div>
    );
};

const HeartIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

const LandingPage: React.FC<{ onBegin: () => void }> = ({ onBegin }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
        <main className="flex flex-col items-center">
            <motion.div className="w-64 h-64 sm:w-80 sm:h-80" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
                <HeartConstellationSVG />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 2.5 }}
                className="font-cinzel text-5xl sm:text-6xl text-white tracking-[0.3em] mt-8" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.5)' }}>
                CONSTELLA
            </motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 3 }} className="mt-12">
                <button onClick={onBegin} className="flex items-center gap-3 bg-transparent text-purple-200 border border-purple-400/50 rounded-full px-8 py-3 backdrop-blur-sm hover:bg-purple-600/30 hover:text-white transition-all duration-300 shadow-lg hover:shadow-purple-900/50 transform hover:scale-105">
                    <HeartIcon />
                    <span>Begin Your Journey</span>
                </button>
            </motion.div>
        </main>
    </div>
);

const navItems = [
    { view: View.LOBBY, label: "Galaxy Circles" },
    { view: View.MAP, label: "Constellation Map" },
    { view: View.MEMORIES, label: "Memory Capsules" },
    { view: View.PROFILE, label: "Profile" }
];

const NavigationLinks: React.FC<{ currentView: View, onNavigate: (view: View) => void }> = ({ currentView, onNavigate }) => (
    <nav className="flex items-center gap-10">
        {navItems.map(item => (
            <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`text-base font-medium transition-all hover:text-white ${currentView === item.view ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-400'}`}
            >
                {item.label}
            </button>
        ))}
    </nav>
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  
  const [isCreateCircleModalOpen, setIsCreateCircleModalOpen] = useState<boolean>(false);
  const [isCreateMemoryModalOpen, setIsCreateMemoryModalOpen] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  
  // Effect to check for an existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      const sessionData = await api.getSession();
      if (sessionData) {
        setCurrentUser(sessionData.currentUser);
        setUsers(sessionData.users);
        setChats(sessionData.chats);
        setConnections(sessionData.connections);
        setMemories(sessionData.memories);
        setCurrentView(View.LOBBY);
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);


  const handleLogin = async (name: string, bio: string, avatar: AvatarType, avatarForm: string) => {
    const data = await api.login(name, bio, avatar, avatarForm);
    if (data) {
        setCurrentUser(data.currentUser);
        setUsers(data.users);
        setChats(data.chats);
        setConnections(data.connections);
        setMemories(data.memories);
        setCurrentView(View.LOBBY);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setUsers([]);
    setChats([]);
    setConnections([]);
    setMemories([]);
    setActiveChatId(null);
    setCurrentView(View.LANDING);
  };

  const handleJoinChat = (chatId: string) => {
    setActiveChatId(chatId);
    setCurrentView(View.CHAT);
  };

  const handleSendMessage = useCallback(async (chatId: string, message: Message) => {
    // Optimistic UI update for responsiveness
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, message] } : c));
    if(currentUser) {
       setUsers(prev => prev.map(u => u.id === currentUser.id ? {...u, lastMessageSentiment: message.sentiment} : u));
    }
    await api.sendMessage(chatId, message);
  }, [currentUser]);

  const handleCreateNebulaLink = useCallback(async (user1: User, user2: User) => {
    const { chat, connection, isNew } = await api.createNebulaLink(user1, user2);
    if (isNew && connection) {
        setChats(prev => [...prev, chat]);
        setConnections(prev => [...prev, connection]);
    }
    setActiveChatId(chat.id);
    setCurrentView(View.CHAT);
  }, []);
  
  const handleCreateCircle = async (name: string, description: string) => {
    if (!currentUser) return;
    const newCircle = await api.createCircle(name, description, currentUser);
    setChats(prev => [newCircle, ...prev]);
    setIsCreateCircleModalOpen(false);
  };

  const handleCreateMemory = async (memoryData: Omit<Memory, 'id'>) => {
    const newMemory = await api.createMemory(memoryData);
    setMemories(prev => [newMemory, ...prev]);
    setIsCreateMemoryModalOpen(false);
  };
  
  const handleUpdateUser = async (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = await api.updateUser(currentUser.id, updates);
    setCurrentUser(updatedUser);
    setUsers(prev =>
      prev.map(u => (u.id === updatedUser.id ? ({ ...u, ...updatedUser } as User) : u))
    );
  };

  const handleUpdateProfile = (name: string, bio: string) => {
    handleUpdateUser({ name, bio });
  };

  const handleUpdateAvatar = (avatarType: AvatarType, avatarForm: string) => {
    const color = avatarType === AvatarType.STAR ? '#fde047' : '#a78bfa';
    handleUpdateUser({ avatar: avatarType, avatarForm, color });
  };

  const handleUpdateProfilePicture = (imageUrl: string) => {
    handleUpdateUser({ profilePictureUrl: imageUrl });
  };


  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId), [chats, activeChatId]);

  const renderView = () => {
    if (!currentUser) {
      switch (currentView) {
        case View.AVATAR_CREATOR:
          return <AvatarCreator onLogin={handleLogin} onBack={() => setCurrentView(View.LANDING)} />;
        default:
          return <LandingPage onBegin={() => setCurrentView(View.AVATAR_CREATOR)} />;
      }
    }
    
    switch (currentView) {
      case View.LOBBY:
        return <Dashboard 
                 chats={chats.filter(c => c.type === 'GALAXY_CIRCLE')} 
                 onJoinChat={handleJoinChat} 
                 onOpenCreateCircleModal={() => setIsCreateCircleModalOpen(true)}
                 onNavigate={setCurrentView}
               />;
      case View.MESSAGES:
          return <MessagesView 
                    allChats={chats}
                    currentUser={currentUser}
                    allUsers={users}
                    connections={connections}
                    onJoinChat={handleJoinChat}
                    onCreateNebulaLink={handleCreateNebulaLink}
                 />;
      case View.CHAT:
        if (activeChat) {
          return <ChatView chat={activeChat} currentUser={currentUser} allUsers={users} onSendMessage={handleSendMessage} onCreateNebulaLink={handleCreateNebulaLink} />;
        }
        return null;
      case View.MAP:
        return <ConstellationMap currentUser={currentUser} users={users} connections={connections} />;
      case View.MEMORIES:
        return <MemoryCapsules memories={memories} allUsers={users} />;
      case View.PROFILE:
        return <Profile
                currentUser={currentUser}
                chats={chats}
                connections={connections}
                memories={memories}
                onUpdateProfile={handleUpdateProfile}
                onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
                onUpdateProfilePicture={handleUpdateProfilePicture}
                onLogout={handleLogout}
            />;
      default:
        return <Dashboard 
                 chats={chats.filter(c => c.type === 'GALAXY_CIRCLE')} 
                 onJoinChat={handleJoinChat} 
                 onOpenCreateCircleModal={() => setIsCreateCircleModalOpen(true)}
                 onNavigate={setCurrentView}
               />;
    }
  };
  
  const defaultHeaderViews: string[] = [View.LOBBY, View.MAP, View.PROFILE];
  const isDefaultHeaderView = defaultHeaderViews.includes(currentView);
  const isHeaderVisible = !([View.LANDING, View.AVATAR_CREATOR] as string[]).includes(currentView);

  if (isLoading) {
      return (
          <div className="w-full h-screen bg-[#0c0a1a] flex flex-col items-center justify-center">
              <StarfieldBackground />
              <div className="flex items-center gap-4 z-10">
                <HeaderLogo />
                <h1 className="font-cinzel font-bold text-2xl text-white tracking-widest animate-pulse">CONSTELLA</h1>
              </div>
              <p className="text-slate-400 mt-4 z-10">Awakening the cosmos...</p>
          </div>
      );
  }

  return (
    <div className="w-full h-screen bg-[#0c0a1a] text-white overflow-hidden flex flex-col">
      <StarfieldBackground />
      {isHeaderVisible && (
          <header className="w-full p-4 flex justify-between items-center bg-black/20 backdrop-blur-sm z-20 border-b border-purple-500/20 shrink-0">
            {/* Left Side */}
            <div>
                {currentView === View.CHAT && activeChat?.type === 'NEBULA_LINK' && (
                    <button onClick={() => setCurrentView(View.MESSAGES)} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
                        <BackIcon />
                        <span>Back to Messages</span>
                    </button>
                )}
                 {(currentView === View.MEMORIES || currentView === View.MESSAGES) && (
                    <button onClick={() => setCurrentView(View.LOBBY)} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
                        <BackArrowIcon className="w-5 h-5" />
                        <span>Back to Dashboard</span>
                    </button>
                )}
                {isDefaultHeaderView && (
                    <div className="flex items-center gap-3">
                        <HeaderLogo />
                        <h1 className="font-cinzel font-bold text-xl text-white tracking-widest">CONSTELLA</h1>
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-8">
                 <NavigationLinks currentView={currentView} onNavigate={setCurrentView} />
                 {currentView === View.MEMORIES && (
                     <button onClick={() => setIsCreateMemoryModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-br from-yellow-500/50 to-amber-600/50 text-amber-100 border border-amber-400/60 rounded-lg px-4 py-2 text-sm font-bold hover:from-yellow-500/70 hover:to-amber-600/70 transition-all shadow-lg hover:shadow-amber-900/50">
                        <PlusIcon className="w-4 h-4" />
                        <span>Create Memory</span>
                    </button>
                 )}
            </div>
          </header>
      )}

      <main className="flex-grow relative overflow-y-auto z-10 min-h-0">
        {renderView()}
      </main>
      
      {currentUser && (
        <>
            <CreateCircleModal 
              isOpen={isCreateCircleModalOpen}
              onClose={() => setIsCreateCircleModalOpen(false)}
              onCreate={handleCreateCircle}
            />
            <CreateMemoryModal
              isOpen={isCreateMemoryModalOpen}
              onClose={() => setIsCreateMemoryModalOpen(false)}
              onCreate={handleCreateMemory}
              allUsers={users.filter(u => u.id !== 'system' && u.id !== currentUser.id)}
              currentUser={currentUser}
            />
            <AvatarChangeModal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                onAvatarChange={handleUpdateAvatar}
                currentUser={currentUser}
            />
        </>
      )}
    </div>
  );
};

export default App;