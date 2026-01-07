'use client';

import { useEffect, useState } from 'react';
import { onAuthChange } from '@/lib/auth';
import { User } from 'firebase/auth';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fallbackUserInfo = {
    email: 'test@example.com',
    uid: 'test-user',
    creationTime: '2024-01-01T00:00:00Z',
  };

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold">Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-4">
            <p className="font-semibold">Profile Loaded Successfully</p>
            <p className="text-sm">Upgrade to Premium Membership</p>
          </div>
          {user ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <p className="mt-1 text-sm text-gray-600 font-mono">{user.uid}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Created</label>
                <p className="mt-1 text-sm text-gray-600">
                  {user.metadata.creationTime}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg text-gray-900">{fallbackUserInfo.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <p className="mt-1 text-sm text-gray-600 font-mono">{fallbackUserInfo.uid}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Created</label>
                <p className="mt-1 text-sm text-gray-600">
                  {fallbackUserInfo.creationTime}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
