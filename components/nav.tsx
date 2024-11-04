"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface User {
  name:string;
  email: string;
  userId: string;
}

export function Navb() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Define user with type User or null
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Fetch the current user from the protected-data API
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users/auth/protected-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Set the user if authenticated
        } else {
          setUser(null); // If not authenticated, set user to null
        }
      } catch (error) {
        setUser(null); // In case of an error, assume not authenticated
      }
    };

    fetchUser(); // Call the API to fetch user data
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/users/auth/signout', {
        method: 'GET',
      });
  
      if (response.ok) {
        // Redirect to login page after successful logout
        router.push('/login');
      } else {
        console.error('Error signing out');
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (!mounted) return null;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="flex h-16 w-full items-center justify-between bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="text-lg font-semibold mr-4">EasyTrack</span>
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="/stockcardtest"
            className="text-sm font-medium transition-colors hover:text-primary"
            prefetch={false}
          >
            News
          </Link>
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          <Toggle
            variant="outline"
            aria-label="Toggle dark mode"
            className="hidden md:flex"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </Toggle>
          {user ? (
            <>
              <span>Welcome, {user.name}</span> {/* Access user.email */}
              <Button
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                prefetch={false}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {/* <Button variant="gooeyLeft"> */}
                  Sign In
                {/* </Button> */}
              </Link>
              <Link
                href="/signup"
                prefetch={false}
              >
                <Button variant="shine" className="text-sm font-medium ml-2">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex h-16 items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2" prefetch={false}>
                <MountainIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">EasyTrack</span>
              </Link>
              <Toggle
                variant="outline"
                aria-label="Toggle dark mode"
                className="md:hidden"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "dark" ? (
                  <MoonIcon className="h-4 w-4" />
                ) : (
                  <SunIcon className="h-4 w-4" />
                )}
              </Toggle>
            </div>
            <div className="grid gap-4 py-6 px-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                prefetch={false}
              >
                <HomeIcon className="h-5 w-5" />
                Home
              </Link>
              <Link
                href="/news"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                prefetch={false}
              >
                <NewspaperIcon className="h-5 w-5" />
                News
              </Link>
              <div className="flex flex-col gap-2">
                {user ? (
                  <Button
                    className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                      prefetch={false}
                    >
                      <LogInIcon className="h-5 w-5" />
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                      prefetch={false}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <hr className="border-t border-gray-300 w-full" />
    </header>
  );
}



function HomeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LogInIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MoonIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function NewspaperIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}

function SunIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}