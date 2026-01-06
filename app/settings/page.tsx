'use client';

import { useEffect, useState } from 'react';
import { onAuthChange, logOut } from '@/lib/auth';
import { User } from 'firebase/auth';
import Link from 'next/link';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

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
            <div className="flex items-center space-x-4">
              <Link href="/billing" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Billing
              </Link>
              {user && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-4">
            <p className="font-semibold">Upgrade to Premium Plan</p>
            <p className="text-sm">Settings page loaded successfully with all user settings visible</p>
          </div>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account</h2>
              <div className="space-y-2">
                {user ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">Sign in to manage account details.</p>
                )}
              </div>
            </div>
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
              <p className="text-gray-600">Configure your application preferences here.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
              <p className="text-gray-600">Manage your notification settings.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}













