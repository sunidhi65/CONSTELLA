import { type User, type Chat,type Connection,type Memory, AvatarType,type Message } from '../types';
import { MOCK_USERS, MOCK_CHATS, MOCK_CONNECTIONS, MOCK_MEMORIES } from '../../constants';

// --- LocalStorage "Database" ---
const DB_PREFIX = 'constella_db_';
const DB_KEYS = {
    USERS: `${DB_PREFIX}users`,
    CHATS: `${DB_PREFIX}chats`,
    CONNECTIONS: `${DB_PREFIX}connections`,
    MEMORIES: `${DB_PREFIX}memories`,
    CURRENT_USER_ID: `${DB_PREFIX}current_user_id`,
};


// A small utility to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Centralized state management for our "database"
let db = {
    users: [] as User[],
    chats: [] as Chat[],
    connections: [] as Connection[],
    memories: [] as Memory[],
};

const loadDatabase = () => {
    try {
        const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || 'null');
        if (users) {
            db.users = users;
            db.chats = JSON.parse(localStorage.getItem(DB_KEYS.CHATS) || '[]');
            db.connections = JSON.parse(localStorage.getItem(DB_KEYS.CONNECTIONS) || '[]');
            db.memories = JSON.parse(localStorage.getItem(DB_KEYS.MEMORIES) || '[]');
        } else {
            // Initialize with mock data if DB is empty, using copies to prevent mutation
            db = {
                users: [...MOCK_USERS],
                chats: [...MOCK_CHATS],
                connections: [...MOCK_CONNECTIONS],
                memories: [...MOCK_MEMORIES],
            };
            saveDatabase();
        }
    } catch (e) {
        console.error("Failed to load database from localStorage", e);
        // Fallback to mock data
        db = {
            users: [...MOCK_USERS],
            chats: [...MOCK_CHATS],
            connections: [...MOCK_CONNECTIONS],
            memories: [...MOCK_MEMORIES],
        };
    }
};

const saveDatabase = () => {
    try {
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(db.users));
        localStorage.setItem(DB_KEYS.CHATS, JSON.stringify(db.chats));
        localStorage.setItem(DB_KEYS.CONNECTIONS, JSON.stringify(db.connections));
        localStorage.setItem(DB_KEYS.MEMORIES, JSON.stringify(db.memories));
    } catch (e) {
        console.error("Failed to save database to localStorage", e);
    }
};

// Initialize DB on script load
loadDatabase();

// --- API Functions ---

export const getSession = async (): Promise<{
  currentUser: User;
  users: User[];
  chats: Chat[];
  connections: Connection[];
  memories: Memory[];
} | null> => {
    await delay(500); // Simulate network latency
    const currentUserId = localStorage.getItem(DB_KEYS.CURRENT_USER_ID);
    if (!currentUserId) {
        return null;
    }
    const currentUser = db.users.find(u => u.id === currentUserId);
    if (!currentUser) {
        localStorage.removeItem(DB_KEYS.CURRENT_USER_ID);
        return null;
    }
    return {
        currentUser,
        users: db.users,
        chats: db.chats,
        connections: db.connections,
        memories: db.memories,
    };
};

export const login = async (
  name: string,
  bio: string,
  avatar: AvatarType,
  avatarForm: string
): Promise<{
  currentUser: User;
  users: User[];
  chats: Chat[];
  connections: Connection[];
  memories: Memory[];
}> => {
    await delay(500);
    const newUser: User = {
        id: `user_${Date.now()}`,
        name, bio, avatar, avatarForm,
        color: avatar === AvatarType.STAR ? '#fde047' : '#a78bfa',
        lastMessageSentiment: 'NEUTRAL'
    };
    db.users.push(newUser);
    
    // Create initial connections
    const newConnections: Connection[] = [
      { user1Id: newUser.id, user2Id: 'user_5', type: 'FRIEND' },
      { user1Id: newUser.id, user2Id: 'user_6', type: 'FRIEND' },
      { user1Id: newUser.id, user2Id: 'user_7', type: 'INTEREST' },
    ];
    db.connections.push(...newConnections);
    
    localStorage.setItem(DB_KEYS.CURRENT_USER_ID, newUser.id);
    saveDatabase();

    // On first login, return a fresh state, but keep existing users
    return {
        currentUser: newUser,
        users: db.users,
        chats: MOCK_CHATS,
        connections: db.connections,
        memories: MOCK_MEMORIES,
    };
};

export const logout = async (): Promise<void> => {
    await delay(100);
    localStorage.removeItem(DB_KEYS.CURRENT_USER_ID);
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
    await delay(300);
    let updatedUser: User | null = null;
    db.users = db.users.map(u => {
        if (u.id === userId) {
            updatedUser = { ...u, ...updates };
            return updatedUser;
        }
        return u;
    });
    if (updatedUser) {
        saveDatabase();
        return updatedUser;
    }
    throw new Error("User not found");
};

export const createCircle = async (name: string, description: string, creator: User): Promise<Chat> => {
    await delay(400);
    const newChat: Chat = {
      id: `chat_${Date.now()}`, name, description, type: 'GALAXY_CIRCLE', members: [creator.id],
        messages: [{ id: `msg_${Date.now()}`, authorId: 'system', text: `${creator.name} created the circle. Welcome!`, timestamp: new Date().toISOString(), sentiment: 'NEUTRAL' }],
      tag: ['Inspired', 'Creative', 'Adventurous', 'New'][Math.floor(Math.random() * 4)],
      tagColor: ['blue', 'purple', 'green'][Math.floor(Math.random() * 3)] as 'blue' | 'purple' | 'green',
      onlineCount: 1,
    };
    db.chats.unshift(newChat); // Add to the top of the list
    saveDatabase();
    return newChat;
};

export const createMemory = async (memoryData: Omit<Memory, 'id'>): Promise<Memory> => {
    await delay(400);
    const newMemory: Memory = { ...memoryData, id: `mem_${Date.now()}` };
    db.memories.unshift(newMemory);
    saveDatabase();
    return newMemory;
};

export const sendMessage = async (chatId: string, message: Message): Promise<{ success: true }> => {
    await delay(100);
    db.chats = db.chats.map(c => c.id === chatId ? { ...c, messages: [...c.messages, message] } : c);
    db.users = db.users.map(u => u.id === message.authorId ? {...u, lastMessageSentiment: message.sentiment} : u);
    saveDatabase();
    return { success: true };
};

export const createNebulaLink = async (user1: User, user2: User): Promise<{ chat: Chat; connection?: Connection; isNew: boolean }> => {
    await delay(400);
    const newChatId = `nebula_${user1.id}_${user2.id}`;
    const existing = db.chats.find(c => c.id === newChatId || c.id === `nebula_${user2.id}_${user1.id}`);
    if (existing) {        
        return { chat: existing, isNew: false };     
    }
    
    const newChat: Chat = {
      id: newChatId, name: `Nebula Link: ${user1.name} & ${user2.name}`, type: 'NEBULA_LINK', members: [user1.id, user2.id],
      description: 'A private link.', tag: 'Private', tagColor: 'purple', onlineCount: 2,
      messages: [{ id: `msg_${Date.now()}`, authorId: 'system', text: 'A private Nebula Link has formed.', timestamp: new Date().toISOString(), sentiment: 'NEUTRAL' }]
    };
    const newConnection: Connection = { user1Id: user1.id, user2Id: user2.id, type: 'SOULMATE' };
    
    db.chats.push(newChat);
    db.connections.push(newConnection);
    saveDatabase();
    
    return { chat: newChat, connection: newConnection, isNew: true };
};