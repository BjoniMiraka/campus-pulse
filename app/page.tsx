'use client';

import { Header } from '@/components/Header';
import { DailyPoll } from '@/components/DailyPoll';
import { CreatePost } from '@/components/CreatePost';
import { PostCard } from '@/components/PostCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAnonymousSession } from '@/lib/auth/anonymous';
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [dailyPoll, setDailyPoll] = useState<any>(null);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalUsers: 0, postsToday: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const supabase = createClient();
    const anonSession = getAnonymousSession();
    setSession(anonSession);

    // Fetch posts
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    setPosts(postsData || []);

    // Fetch daily poll
    const { data: pollData } = await supabase
      .from('daily_polls')
      .select('*')
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    setDailyPoll(pollData);

    // Check if user has voted on the poll
    if (pollData) {
      const { data: voteData } = await supabase
        .from('poll_votes')
        .select('option')
        .eq('poll_id', pollData.id)
        .eq('user_id', anonSession.id)
        .single();
      
      setUserVote(voteData?.option || null);
    }

    // Fetch stats
    const { count: totalUsers } = await supabase
      .from('posts')
      .select('author_id', { count: 'exact', head: true });

    const { count: postsToday } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

    setStats({
      totalUsers: totalUsers || 0,
      postsToday: postsToday || 0,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Campus Pulse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        profile={{ anonymous_name: session?.anonymousName || 'Anonymous' }} 
        onNameChange={fetchData}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <CreatePost userId={session?.id} onPostCreated={fetchData} />
            
            <div className="space-y-4">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={{
                      ...post,
                      authorAnonymousName: post.author_name || 'Anonymous',
                      createdAt: new Date(post.created_at),
                    }} 
                    userId={session?.id}
                  />
                ))
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 mb-2">No posts yet</p>
                  <p className="text-sm text-gray-400">Be the first to share something!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {dailyPoll && (
              <DailyPoll 
                poll={{
                  ...dailyPoll,
                  createdAt: new Date(dailyPoll.created_at),
                  expiresAt: new Date(dailyPoll.expires_at),
                }}
                userVote={userVote}
                userId={session?.id}
              />
            )}
            
            {/* Stats Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Campus Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Students</span>
                  <span className="font-bold text-purple-600">{stats.totalUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posts Today</span>
                  <span className="font-bold text-purple-600">{stats.postsToday}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-bold text-purple-600">{posts?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-purple-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Stay Anonymous 🎭</h3>
              <p className="text-sm text-gray-600">
                Your identity is protected. Share freely, react honestly, and connect with your campus community.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
