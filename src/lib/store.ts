import { create } from 'zustand';
import { Post, DailyPoll, Comment, ReactionType } from '@/types';

interface AppState {
  // User
  currentUser: { id: string; email: string; anonymousName: string } | null;
  
  // Posts
  posts: Post[];
  
  // Daily Poll
  dailyPoll: DailyPoll | null;
  userVote: 'A' | 'B' | null;
  
  // Comments
  comments: Record<string, Comment[]>;
  
  // Actions
  addPost: (content: string, type: Post['type']) => void;
  addReaction: (postId: string, reaction: ReactionType) => void;
  votePoll: (option: 'A' | 'B') => void;
  addComment: (postId: string, content: string) => void;
  setUser: (user: { id: string; email: string; anonymousName: string }) => void;
}

// Mock data
const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Why does the library coffee taste like regret and broken dreams?',
    authorId: 'user1',
    authorAnonymousName: 'Sleepy Owl',
    reactions: { fire: 42, skull: 8, laugh: 156, eyes: 23 },
    commentCount: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'question',
  },
  {
    id: '2',
    content: 'Confession: I\'ve been using ChatGPT for all my essays and my GPA has never been better 💀',
    authorId: 'user2',
    authorAnonymousName: 'Honest Raccoon',
    reactions: { fire: 234, skull: 89, laugh: 445, eyes: 167 },
    commentCount: 89,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    type: 'confession',
  },
  {
    id: '3',
    content: 'Hot take: 8am classes should be illegal',
    authorId: 'user3',
    authorAnonymousName: 'Tired Fox',
    reactions: { fire: 567, skull: 12, laugh: 89, eyes: 34 },
    commentCount: 45,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    type: 'hot-take',
  },
  {
    id: '4',
    content: 'Someone just microwaved fish in the dorm kitchen at 2am. We need to talk.',
    authorId: 'user4',
    authorAnonymousName: 'Angry Badger',
    reactions: { fire: 123, skull: 456, laugh: 234, eyes: 78 },
    commentCount: 67,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    type: 'confession',
  },
  {
    id: '5',
    content: 'Is it just me or does everyone suddenly become a philosopher at 3am in the dorm?',
    authorId: 'user5',
    authorAnonymousName: 'Wise Penguin',
    reactions: { fire: 89, skull: 12, laugh: 234, eyes: 45 },
    commentCount: 23,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    type: 'question',
  },
];

const mockDailyPoll: DailyPoll = {
  id: 'poll-1',
  question: 'What\'s worse?',
  optionA: 'Group projects',
  optionB: 'Finals week',
  votesA: 1247,
  votesB: 2156,
  createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
};

export const useStore = create<AppState>((set) => ({
  currentUser: {
    id: 'current-user',
    email: 'student@university.edu',
    anonymousName: 'Curious Cat',
  },
  
  posts: mockPosts,
  dailyPoll: mockDailyPoll,
  userVote: null,
  comments: {},
  
  addPost: (content, type) => set((state) => ({
    posts: [
      {
        id: `post-${Date.now()}`,
        content,
        authorId: state.currentUser!.id,
        authorAnonymousName: state.currentUser!.anonymousName,
        reactions: { fire: 0, skull: 0, laugh: 0, eyes: 0 },
        commentCount: 0,
        createdAt: new Date(),
        type,
      },
      ...state.posts,
    ],
  })),
  
  addReaction: (postId, reaction) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            reactions: {
              ...post.reactions,
              [reaction]: post.reactions[reaction] + 1,
            },
          }
        : post
    ),
  })),
  
  votePoll: (option) => set((state) => ({
    userVote: option,
    dailyPoll: state.dailyPoll
      ? {
          ...state.dailyPoll,
          votesA: state.dailyPoll.votesA + (option === 'A' ? 1 : 0),
          votesB: state.dailyPoll.votesB + (option === 'B' ? 1 : 0),
        }
      : null,
  })),
  
  addComment: (postId, content) => set((state) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      content,
      authorId: state.currentUser!.id,
      authorAnonymousName: state.currentUser!.anonymousName,
      createdAt: new Date(),
    };
    
    return {
      comments: {
        ...state.comments,
        [postId]: [...(state.comments[postId] || []), newComment],
      },
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, commentCount: post.commentCount + 1 }
          : post
      ),
    };
  }),
  
  setUser: (user) => set({ currentUser: user }),
}));
