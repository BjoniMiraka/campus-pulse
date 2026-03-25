'use client';

import { Zap, User, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { clearAnonymousSession, updateAnonymousName } from '@/lib/auth/anonymous';
import { generateAnonymousName } from '@/lib/api/auth';

interface HeaderProps {
  profile: {
    anonymous_name: string;
  } | null;
  onNameChange?: () => void;
}

export function Header({ profile, onNameChange }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleChangeName = () => {
    const newName = generateAnonymousName();
    updateAnonymousName(newName);
    setShowMenu(false);
    if (onNameChange) onNameChange();
    window.location.reload();
  };

  const handleClearSession = () => {
    if (confirm('This will clear your session and you\'ll lose access to your posts. Continue?')) {
      clearAnonymousSession();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Campus Pulse
              </h1>
              <p className="text-xs text-gray-500">Anonymous & Fun</p>
            </div>
          </div>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{profile?.anonymous_name}</p>
                <p className="text-xs text-gray-500">Anonymous User</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                    <p className="text-sm font-medium text-gray-900">{profile?.anonymous_name}</p>
                    <p className="text-xs text-gray-500">Anonymous User</p>
                  </div>
                  <button
                    onClick={handleChangeName}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Change Anonymous Name
                  </button>
                  <button
                    onClick={handleClearSession}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Clear Session
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
