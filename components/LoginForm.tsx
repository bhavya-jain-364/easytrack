"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { LoadingSpinner } from "./ui/loader";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { validateEmail, validatePassword } from "@/lib/validation";
import Link from 'next/link';

interface LoginFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function handleValidation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Clear previous errors
    setEmailError(null);
    setPasswordError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate the inputs
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    // Prioritize errors: email -> password -> backend error
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    // If no frontend validation errors, proceed with form submission
    onSubmit(event);
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-background text-foreground">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email and password to log in
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleValidation}>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            <FcGoogle className="mr-2 h-5 w-5" />
            Google
          </Button>
          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-muted-foreground">OR CONTINUE WITH</span>
            <Separator className="flex-1" />
          </div>
          <div>
            <Input
              name="email"
              placeholder="Email"
              type="email"
              className={cn(
                "text-foreground bg-primary-foreground border border-border",
                emailError || (!passwordError && error) ? "border-destructive border-2" : ""
              )}
            />
            {emailError && (
              <p className="mt-1 text-destructive font-medium text-sm">
                {emailError}
              </p>
            )}
            {!emailError && error && (
              <p className="mt-1 text-destructive font-medium text-sm">
                {error}
              </p>
            )}
          </div>
          <div>
            <Input
              name="password"
              placeholder="Password"
              type="password"
              className={cn(
                "text-foreground bg-primary-foreground border border-border",
                passwordError ? "border-destructive border-2" : ""
              )}
            />
            {passwordError && (
              <p className="mt-1 text-destructive font-medium text-sm">
                {passwordError}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="pb-4">
          <Button
            className="w-full flex items-center justify-center"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="w-5 h-5 mr-2" />
                Logging In...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </CardFooter>
      </form>
      <p className="text-sm mt-4 text-center pb-2">
        Don't have an account? &nbsp;
        <Link href="/signup" passHref className="text-blue-500">
          Sign up here!
        </Link>
      </p>
    </Card>
  );
}
