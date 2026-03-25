'use client';

import { Post, ReactionType } from '@/types';
import { formatTimeAgo, formatNumber } from '@/utils';
import { Flame, Skull, Laugh, Eye, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
  userId: string;
}

const reactionIcons: Record<ReactionType, React.ReactNode> = {
  fire: <Flame className="w-5 h-5" />,
  skull: <Skull className="w-5 h-5" />,
  laugh: <Laugh className="w-5 h-5" />,
  eyes: <Eye className="w-5 h-5" />,
};

const reactionColors: Record<ReactionType, string> = {
  fire: 'hover:bg-orange-100 hover:text-orange-600',
  skull: 'hover:bg-gray-100 hover:text-gray-600',
  laugh: 'hover:bg-yellow-100 hover:text-yellow-600',
  eyes: 'hover:bg-blue-100 hover:text-blue-600',
};

export function PostCard({ post, userId }: PostCardProps) {
  const supabase = createClient();
  const router = useRouter();
  const [reacting, setReacting] = useState(false);

  const handleReaction = async (reaction: ReactionType) => {
    if (reacting) return;
    setReacting(true);

    try {
      // Try to add reaction (will fail if already exists due to unique constraint)
      const { error } = await supabase.from('user_reactions').insert({
        post_id: post.id,
        user_id: userId,
        reaction_type: reaction,
      });

      if (!error) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    } finally {
      setReacting(false);
    }
  };

  const getTypeColor = () => {
    switch (post.type) {
      case 'confession':
        return 'bg-purple-100 text-purple-700';
      case 'hot-take':
        return 'bg-red-100 text-red-700';
      case 'question':
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getTypeLabel = () => {
    switch (post.type) {
      case 'confession':
        return 'Confession';
      case 'hot-take':
        return 'Hot Take';
      case 'question':
        return 'Question';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
            {post.authorAnonymousName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{post.authorAnonymousName}</p>
            <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
          {getTypeLabel()}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-800 text-lg mb-4 leading-relaxed">{post.content}</p>

      {/* Reactions & Comments */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        {(Object.keys(post.reactions) as ReactionType[]).map((reaction) => (
          <button
            key={reaction}
            onClick={() => handleReaction(reaction)}
            disabled={reacting}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-600 transition-all disabled:opacity-50 ${reactionColors[reaction]}`}
          >
            {reactionIcons[reaction]}
            <span className="text-sm font-medium">
              {formatNumber(post.reactions[reaction])}
            </span>
          </button>
        ))}
        
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all ml-auto">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.commentCount}</span>
        </button>
      </div>
    </div>
  );
}
