import { User, Chat, Connection, AvatarType, Memory } from './src/types';

export const MOCK_USERS: User[] = [
  { id: 'user_1', name: 'Orion', avatar: AvatarType.STAR, color: '#fde047', avatarForm: 'Radiant Star', lastMessageSentiment: 'NEUTRAL', bio: 'A traveler of the star-strewn paths.' },
  { id: 'user_2', name: 'Luna', avatar: AvatarType.PLANET, color: '#a78bfa', avatarForm: 'Mystic Orb', lastMessageSentiment: 'NEUTRAL', bio: 'Reflecting the cosmos in quiet solitude.' },
  { id: 'user_3', name: 'Nova', avatar: AvatarType.STAR, color: '#f472b6', avatarForm: 'Nova Star', lastMessageSentiment: 'NEUTRAL', bio: 'Bursting with creative energy.' },
  { id: 'user_4', name: 'Caelus', avatar: AvatarType.PLANET, color: '#60a5fa', avatarForm: 'Ring World', lastMessageSentiment: 'NEUTRAL', bio: 'Guardian of celestial balance.' },
  { id: 'user_5', name: 'Maya', avatar: AvatarType.STAR, color: '#34d399', avatarForm: 'Cosmic Star', lastMessageSentiment: 'POSITIVE', bio: 'Weaver of stellar dreams.' },
  { id: 'user_6', name: 'Jordan', avatar: AvatarType.PLANET, color: '#f97316', avatarForm: 'Core World', lastMessageSentiment: 'NEUTRAL', bio: 'Exploring the core of existence.' },
  { id: 'user_7', name: 'Alex', avatar: AvatarType.STAR, color: '#fde047', avatarForm: 'Ancient Star', lastMessageSentiment: 'NEUTRAL', bio: 'An old soul with new stories.' },
  { id: 'user_8', name: 'Sam', avatar: AvatarType.PLANET, color: '#60a5fa', avatarForm: 'Dual Sphere', lastMessageSentiment: 'NEGATIVE', bio: 'Finding harmony in duality.' },
  { id: 'system', name: 'System', avatar: AvatarType.STAR, color: '#9ca3af', avatarForm: 'System', lastMessageSentiment: 'NEUTRAL' },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat_1',
    name: 'Cosmic Dreamers',
    description: 'Exploring the mysteries of space and time',
    tag: 'Inspired',
    tagColor: 'blue',
    onlineCount: 3,
    type: 'GALAXY_CIRCLE',
    members: ['user_1', 'user_2', 'user_3', 'user_4', 'user_5', 'user_6', 'user_7', 'user_8'],
    messages: [
      {
        id: 'msg_1',
        authorId: 'user_1',
        text: 'Just saw a documentary about black holes. Mind-blowing stuff.',
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        sentiment: 'NEUTRAL'
      },
      {
        id: 'msg_2',
        authorId: 'user_2',
        text: 'Right? The scale of the universe is just incredible.',
        timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        sentiment: 'POSITIVE'
      },
    ],
  },
  {
    id: 'chat_2',
    name: 'Starlight Poets',
    description: 'Sharing verses under digital constellations',
    tag: 'Creative',
    tagColor: 'purple',
    onlineCount: 5,
    type: 'GALAXY_CIRCLE',
    members: Array.from({ length: 12 }, (_, i) => `user_${i + 1}`),
    messages: [
      {
        id: 'msg_3',
        authorId: 'user_3',
        text: 'A haiku for Saturn:\nRings of ancient dust,\nA silent dance in the void,\nBeauty in the cold.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        sentiment: 'POSITIVE'
      },
    ],
  },
  {
    id: 'chat_3',
    name: 'Nebula Wanderers',
    description: 'Adventures through the unknown',
    tag: 'Adventurous',
    tagColor: 'green',
    onlineCount: 2,
    type: 'GALAXY_CIRCLE',
    members: Array.from({ length: 6 }, (_, i) => `user_${i + 1}`),
    messages: [
      {
        id: 'msg_4',
        authorId: 'user_4',
        text: 'If you could visit any planet, real or fictional, where would you go?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        sentiment: 'NEUTRAL'
      },
    ],
  },
  {
    id: 'nebula_1',
    name: 'Nebula Link: Alex & Orion',
    type: 'NEBULA_LINK',
    members: ['user_7', 'user_1'],
    messages: [
      {
        id: 'msg_5',
        authorId: 'user_7',
        text: 'Your stories of traveling the star-strewn paths are always so captivating, Orion.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        sentiment: 'POSITIVE'
      },
      {
        id: 'msg_6',
        authorId: 'user_1',
        text: "And your ancient wisdom brings a unique perspective to them, Alex. It's a pleasure sharing them with you.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
        sentiment: 'POSITIVE'
      },
    ],
    description: 'A private link.',
    tag: 'Private',
    tagColor: 'purple',
    onlineCount: 2,
  },
];

export const MOCK_CONNECTIONS: Connection[] = [
  { user1Id: 'user_5', user2Id: 'user_6', type: 'SOULMATE' },   // Maya -> Jordan
  { user1Id: 'user_7', user2Id: 'user_1', type: 'FRIEND' },     // Alex -> Orion
  { user1Id: 'user_6', user2Id: 'user_1', type: 'INTEREST' },   // Jordan -> Orion
  { user1Id: 'user_7', user2Id: 'system', type: 'FRIEND' },     // Alex -> System
  { user1Id: 'system', user2Id: 'user_3', type: 'FRIEND' },     // System -> Nova
  { user1Id: 'user_1', user2Id: 'user_8', type: 'INTEREST' },   // Orion -> Sam
  { user1Id: 'user_3', user2Id: 'user_2', type: 'FRIEND' },     // Nova -> Luna
];

export const MOCK_MEMORIES: Memory[] = [
  {
    id: 'mem_1',
    type: 'milestone',
    title: 'First Nebula Link with Luna',
    description:
      'The moment when Luna and I discovered our cosmic connection through synchronized star-gazing in the Dreamers Circle. The constellati...',
    date: new Date('2024-12-15').toISOString(),
    context: 'Andromeda',
    participants: ['user_2', 'user_1'],
    isPrivate: true,
  },
  {
    id: 'mem_2',
    type: 'moment',
    title: 'Cosmic Poetry Night',
    description:
      "An incredible evening in the Starlight Poets circle where everyone shared verses about their favorite constellations. Nova's poem abo...",
    date: new Date('2024-12-10').toISOString(),
    context: 'Lyra',
    participants: ['user_3', 'user_8', 'user_4', 'user_5'],
    isPrivate: false,
  },
  {
    id: 'mem_3',
    type: 'message',
    title: 'The Great Galaxy Alignment',
    description:
      'A beautiful moment when all five of us in the Nebula Wanderers felt the same pull toward exploration at exactly the same time. The...',
    date: new Date('2024-12-08').toISOString(),
    context: 'Sagittarius',
    participants: ['user_4', 'user_8', 'user_3', 'user_1', 'user_2'],
    isPrivate: true,
  },
  {
    id: 'mem_4',
    type: 'milestone',
    title: "Stella's Breakthrough",
    description:
      'The day Stella opened up about her fears and dreams in our private Nebula Link. It marked the beginning of our deeper connection and...',
    date: new Date('2024-12-05').toISOString(),
    context: 'Virgo',
    participants: ['user_5', 'user_6'],
    isPrivate: true,
  },
];

export const AVATAR_COLORS = [
  '#fde047', // Star Yellow
  '#f472b6', // Nova Pink
  '#a78bfa', // Cosmic Purple
  '#60a5fa', // Caelus Blue
  '#34d399', // Nebula Green
  '#f97316', // Solar Orange
];
