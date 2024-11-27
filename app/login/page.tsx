"use client";

import { LoginForm } from "@/components/LoginForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await fetch('/api/users/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('User logged in:', result);
        router.push('/'); 
      } else {
        const result = await response.json();
        setError(result.error || 'Invalid login credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return ( 
      <div className="flex items-center justify-center min-h-screen">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex items-center gap-2"
        onClick={() => router.push("/")}
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>
      <LoginForm onSubmit={handleLogin} error={error} isLoading={isLoading} />
    </div>
  );
}
