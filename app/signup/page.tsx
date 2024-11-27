"use client"

import { SignupForm } from "@/components/SignupForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await fetch('/api/users/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('User created:', result);
        router.push('/login'); // Redirect to login or another page
      } else {
        const result = await response.json();
        setError(result.error || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false); // Set loading to false
    }
  }

  return (
    <div className="min-h-screen relative">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex items-center gap-2"
        onClick={() => router.push("/")}
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>
      <div className="flex items-center justify-center min-h-screen">
        <SignupForm onSubmit={handleSignup} error={error} isLoading={isLoading} />
      </div>
    </div>
  );
}
