'use client';

import { formatNumber } from '@/utils';
import { TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DailyPoll as DailyPollType } from '@/types';

interface DailyPollProps {
  poll: DailyPollType;
  userVote: 'A' | 'B' | null;
  userId: string;
}

export function DailyPoll({ poll: dailyPoll, userVote: initialUserVote, userId }: DailyPollProps) {
  const supabase = createClient();
  const router = useRouter();
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState(initialUserVote);

  const handleVote = async (option: 'A' | 'B') => {
    if (userVote || voting) return;
    setVoting(true);

    try {
      const { error } = await supabase.from('poll_votes').insert({
        poll_id: dailyPoll.id,
        user_id: userId,
        option,
      });

      if (!error) {
        setUserVote(option);
        router.refresh();
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  const totalVotes = dailyPoll.votesA + dailyPoll.votesB;
  const percentA = totalVotes > 0 ? (dailyPoll.votesA / totalVotes) * 100 : 50;
  const percentB = totalVotes > 0 ? (dailyPoll.votesB / totalVotes) * 100 : 50;

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6" />
        <h2 className="text-xl font-bold">Today's Poll</h2>
      </div>

      <p className="text-lg font-semibold mb-6">{dailyPoll.question}</p>

      <div className="space-y-3">
        {/* Option A */}
        <button
          onClick={() => handleVote('A')}
          disabled={!!userVote || voting}
          className={`w-full text-left p-4 rounded-lg transition-all disabled:cursor-not-allowed ${
            userVote === 'A'
              ? 'bg-white text-purple-600 ring-4 ring-white/50'
              : userVote
              ? 'bg-white/20'
              : 'bg-white/30 hover:bg-white/40 cursor-pointer'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">{dailyPoll.optionA}</span>
            <span className="text-sm font-bold">{Math.round(percentA)}%</span>
          </div>
          {userVote && (
            <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{ width: `${percentA}%` }}
              />
            </div>
          )}
        </button>

        {/* Option B */}
        <button
          onClick={() => handleVote('B')}
          disabled={!!userVote || voting}
          className={`w-full text-left p-4 rounded-lg transition-all disabled:cursor-not-allowed ${
            userVote === 'B'
              ? 'bg-white text-purple-600 ring-4 ring-white/50'
              : userVote
              ? 'bg-white/20'
              : 'bg-white/30 hover:bg-white/40 cursor-pointer'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">{dailyPoll.optionB}</span>
            <span className="text-sm font-bold">{Math.round(percentB)}%</span>
          </div>
          {userVote && (
            <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{ width: `${percentB}%` }}
              />
            </div>
          )}
        </button>
      </div>

      {userVote && (
        <p className="text-center text-sm mt-4 text-white/80">
          {formatNumber(totalVotes)} students voted
        </p>
      )}
    </div>
  );
}
