'use client';

import { useState, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { Post } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { getAnonymousSession } from '@/lib/auth/anonymous';

interface CreatePostProps {
  userId: string;
  onPostCreated?: () => void;
}

export function CreatePost({ userId, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<Post['type']>('confession');
  const [loading, setLoading] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkIfUserHasPosted = async () => {
      const session = getAnonymousSession();
      const { data } = await supabase
        .from('posts')
        .select('id')
        .eq('author_id', session.id)
        .single();
      
      setHasPosted(!!data);
      setCheckingLimit(false);
    };

    checkIfUserHasPosted();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading || hasPosted) return;

    setLoading(true);

    try {
      const session = getAnonymousSession();
      
      const { error } = await supabase.from('posts').insert({
        content: content.trim(),
        author_id: session.id,
        author_name: session.anonymousName,
        type,
      });

      if (error) {
        if (error.code === '23505') {
          setHasPosted(true);
          alert('You can only create one post per session. Clear your session to post again.');
        } else {
          throw error;
        }
      } else {
        setContent('');
        setHasPosted(true);
        if (onPostCreated) onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingLimit) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="text-center py-4 text-gray-500">
          Checking post limit...
        </div>
      </div>
    );
  }

  if (hasPosted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Post Limit Reached</p>
            <p className="text-sm text-gray-600">You can only create one post per session</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            To post again, clear your session from the menu and start fresh with a new anonymous identity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
          ?
        </div>
        <div>
          <p className="font-semibold text-gray-900">Anonymous</p>
          <p className="text-xs text-gray-500">Post anonymously</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share anonymously..."
          disabled={loading}
          className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 disabled:opacity-50"
          rows={4}
          maxLength={500}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('confession')}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                type === 'confession'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Confession
            </button>
            <button
              type="button"
              onClick={() => setType('hot-take')}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                type === 'hot-take'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Hot Take
            </button>
            <button
              type="button"
              onClick={() => setType('question')}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                type === 'question'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Question
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
