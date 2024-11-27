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
import {
  validateName,
  validateEmail,
  validatePassword,
} from "@/lib/validation";
import Link from 'next/link';
interface SignupFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

export function SignupForm({ onSubmit, error, isLoading }: SignupFormProps) {
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function handleValidation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Clear previous errors
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate the inputs
    const nameValidationError = validateName(name);
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    // Prioritize errors: name -> email -> password -> backend error
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

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
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
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
              name="name"
              placeholder="Full name"
              className={cn(
                "text-foreground bg-primary-foreground border border-border",
                nameError ? "border-destructive border-2" : ""
              )}
            />
            {nameError && (
              <p className="mt-1 text-destructive font-medium text-sm">
                {nameError}
              </p>
            )}
          </div>
          <div>
            <Input
              name="email"
              placeholder="Email"
              type="email"
              className={cn(
                "text-foreground bg-primary-foreground border border-border",
                emailError || (!nameError && error) ? "border-destructive border-2" : ""
              )}
            />
            {!nameError && emailError && (
              <p className="mt-1 text-destructive font-medium text-sm">
                {emailError}
              </p>
            )}
            {!nameError && !emailError && error && (
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
            {!nameError && !emailError && !error && passwordError && (
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
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </form>
      <p className="text-sm mt-4 text-center pb-2">
        Already have an account? &nbsp;
        <Link href="/login" passHref className="text-blue-500">
          Log in here!
        </Link>
      </p>
    </Card>
  );
}
