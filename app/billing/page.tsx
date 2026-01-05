'use client';

import { useEffect, useState } from 'react';
import { onAuthChange } from '@/lib/auth';
import { User } from 'firebase/auth';
import { getUserSubscription } from '@/lib/firestore';
import Link from 'next/link';

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const subscription = await getUserSubscription(authUser.uid);
        setIsPro(subscription?.isPro || false);
      } else {
        setIsPro(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please sign in to upgrade.');
      return;
    }
    
    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout session. Please try again.');
        setCheckoutLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating checkout session. Please try again.');
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold">Dashboard</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/settings" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Billing & Subscription</h1>
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {isPro ? 'Pro Plan' : 'Free Plan'}
                  </p>
                  {isPro && (
                    <p className="text-sm text-gray-600 mt-1">Full access to all Pro lessons</p>
                  )}
                  {!isPro && (
                    <p className="text-sm text-gray-600 mt-1">Access to free lessons only</p>
                  )}
                </div>
                {isPro && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>
            </div>

            {!isPro && (
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upgrade to Pro</h2>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro Features</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Access to all Pro lessons
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Advanced content and features
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Priority support
                    </li>
                  </ul>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? 'Processing...' : 'Upgrade to Pro - $9.99/month'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Secure payment powered by Stripe
                </p>
              </div>
            )}

            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Method</h2>
              {isPro ? (
                <p className="text-gray-600">Payment method managed through Stripe</p>
              ) : (
                <p className="text-gray-600">No payment method on file.</p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Billing History</h2>
              {isPro ? (
                <p className="text-gray-600">View your billing history in your Stripe customer portal</p>
              ) : (
                <p className="text-gray-600">No billing history available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}





