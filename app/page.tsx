'use client'

import { useEffect, useState } from "react";
import { Navb } from "@/components/Nav";
import ExpandableChartCard from "@/components/ExpandableChartCard";
import AnimatedGridPattern from "@/components/ui/AnimatedGridPattern";
import { SearchBar } from "@/components/SearchBar";

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
  const [userStocks, setUserStocks] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchUserStocks = async () => {
      try {
        const response = await fetch('/api/users/fetchstocklist');
        if (response.ok) {
          const data = await response.json();
          setUserStocks(data.stocks);
        } else {
          console.error('Failed to fetch user stocks');
        }
      } catch (error) {
        console.error('Error fetching user stocks:', error);
      }
    };

    if (user) {
      fetchUserStocks();
    } else {
      setUserStocks(TOP_COMPANIES);
    }
  }, [user]);

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
        <div className="fixed inset-0 z-0">
          <AnimatedGridPattern
            width={32}
            height={32}
            className="opacity-40 dark:opacity-40"
            strokeDasharray="4 2"
          />
        </div>
        
        <main className="container mx-auto px-4 pt-24 relative z-10">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-8">
              {user ? `Welcome back, ${user.name}!` : 'Log In to Track Your Favorite Stocks!'}
            </h1>
            {user && (
              <div className="mb-8 flex justify-start w-full max-w-md">
                <SearchBar />
              </div>
            )}
            <div className="grid justify-self-stretch">
              {userStocks.map((symbol) => (
                <ExpandableChartCard
                  key={symbol}
                  symbol={symbol}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
