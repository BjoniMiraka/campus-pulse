export interface User {
  id: string;
  email: string;
  anonymousName: string; // e.g., "Anonymous Owl", "Mystery Student"
  createdAt: Date;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorAnonymousName: string;
  reactions: Reactions;
  commentCount: number;
  createdAt: Date;
  type: 'confession' | 'question' | 'hot-take';
}

export interface Reactions {
  fire: number;
  skull: number;
  laugh: number;
  eyes: number;
}

export type ReactionType = keyof Reactions;

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorAnonymousName: string;
  createdAt: Date;
}

export interface DailyPoll {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  votesA: number;
  votesB: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface PollVote {
  pollId: string;
  userId: string;
  option: 'A' | 'B';
}
