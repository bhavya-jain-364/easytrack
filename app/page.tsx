'use client'

import { useEffect, useState } from "react";
import { Navb } from "@/components/Nav";
import ExpandableChartCard from "@/components/ExpandableChartCard";
import AnimatedGridPattern from "@/components/ui/AnimatedGridPattern";

interface User {
  name: string;
  email: string;
  userId: string;
}

// Top 10 companies by market cap (as of 2024)
const TOP_COMPANIES = [
  'AAPL',  // Apple
  'MSFT',  // Microsoft
  'GOOGL', // Alphabet (Google)
  'AMZN',  // Amazon
  'NVDA',  // NVIDIA
  'META',  // Meta (Facebook)
  'BRK-B', // Berkshire Hathaway
  'LLY',   // Eli Lilly
  'TSM',   // Taiwan Semiconductor
  'V'      // Visa
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users/auth/protected-data");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <>
        <Navb />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navb />
      <div className="relative min-h-screen">
        {/* Animated Grid Background */}
        <div className="fixed inset-0 z-0">
          <AnimatedGridPattern
            width={32}
            height={32}
            className="opacity-25 dark:opacity-40"
            strokeDasharray="4 2"
          />
        </div>
        
        {/* Main Content */}
        <main className="container mx-auto px-4 pt-24 relative z-10">
          {!user ? (
            // Not logged in - show top 10 companies
            <div className="space-y-6">
              <h1 className="text-3xl font-bold mb-8">Top 10 Companies by Market Cap</h1>
              <div className="grid gap-6">
                {TOP_COMPANIES.map((symbol) => (
                  <ExpandableChartCard
                    key={symbol}
                    title={`${symbol} Stock Overview`}
                    symbol={symbol}
                    // defaultPeriod="6M"
                  />
                ))}
              </div>
            </div>
          ) : (
            // Logged in - placeholder for now
            <div>
              <h1 className="text-3xl font-bold mb-8">Welcome back, {user.name}!</h1>
              {/* Add personalized content here later */}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
