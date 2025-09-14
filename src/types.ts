// FIX: Replaced the incorrect content of this file with the correct type definitions.
// The previous content was an erroneous copy of App.tsx, causing widespread import errors.
export type Sentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export const AvatarType = {
  STAR: 'STAR',
  PLANET: 'PLANET',
} as const;
export type AvatarType = typeof AvatarType[keyof typeof AvatarType];

export const View = {
  LANDING: 'LANDING',
  AVATAR_CREATOR: 'AVATAR_CREATOR',
  LOBBY: 'LOBBY',
  CHAT: 'CHAT',
  MAP: 'MAP',
  MEMORIES: 'MEMORIES',
  PROFILE: 'PROFILE',
  MESSAGES: 'MESSAGES',
} as const;
export type View = typeof View[keyof typeof View];

export interface User {
  id: string;
  name: string;
  avatar: AvatarType;
  avatarForm: string;
  color: string;
  lastMessageSentiment: Sentiment;
  bio?: string;
  profilePictureUrl?: string;
}

export interface Message {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
  sentiment: Sentiment;
}

export interface Chat {
  id: string;
  name: string;
  type: 'GALAXY_CIRCLE' | 'NEBULA_LINK';
  members: string[];
  messages: Message[];
  description: string;
  tag: string;
  tagColor: 'blue' | 'purple' | 'green';
  onlineCount: number;
}

export interface Connection {
  user1Id: string;
  user2Id: string;
  type: 'SOULMATE' | 'FRIEND' | 'INTEREST';
}

export type MemoryType = 'milestone' | 'moment' | 'message';

export interface Memory {
  id:string;
  type: MemoryType;
  title: string;
  description: string;
  date: string;
  context: string;
  participants: string[];
  isPrivate: boolean;
}