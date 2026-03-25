"use client";

import { useEffect } from "react";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAnonymousSession } from "@/lib/auth/anonymous";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Create anonymous session and redirect to home
    getAnonymousSession();
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Campus Pulse
            </h1>
            <p className="text-xs text-gray-500">Anonymous & Fun</p>
          </div>
        </div>

        {/* Loading state */}
        <div className="py-12">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Creating your anonymous session...</p>
        </div>
      </div>
    </div>
  );
}
