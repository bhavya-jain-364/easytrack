"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BorderBeam } from "@/components/ui/border-beam";

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
      className={`fixed top-0 z-50 w-full transition-all duration-150 ${
        isScrolled
          ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="flex h-16 w-full items-center justify-between bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 transition-colors duration-150" prefetch={false}>
          <StockIcon className="h-8 w-8 mb-1" />
          <span className="text-lg font-semibold mr-4">EasyTrack</span>
        </Link>
        <nav className="hidden items-center gap-0 md:flex">
          <Link
            href="/"
            className="text-md font-light transition-colors duration-150 hover:text-primary px-4 py-2 rounded-md"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="/stockcardtest"
            className="text-md font-light transition-colors duration-150 hover:text-primary px-4 py-2 rounded-md"
            prefetch={false}
          >
            News
          </Link>
        </nav>
        <div className="flex items-center gap-3 ml-auto">
          <Toggle
            variant="default"
            aria-label="Toggle dark mode"
            className="md:flex transition-colors duration-150"
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
              <span>Welcome, {user.name}</span>
              <Button
                className="text-base font-medium transition-colors duration-150"
                onClick={handleSignOut}
                variant="expandIcon"
                Icon={LogOutIcon}
                iconPlacement="right"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                prefetch={true}
                className="text-base transition-colors duration-150 hover:text-primary"
              >
                <Button variant="expandIcon" Icon={LogInIcon} iconPlacement="right"
                className="text-md font-light">
                  Sign In
                </Button>
              </Link>
              <Link
                href="/signup"
                prefetch={true}
              >
                <Button
                  className="relative text-md font-medium bg-accent-foreground hover:bg-accent-foreground/80 transition-all duration-150"
                >
                  <BorderBeam 
                    duration={5}
                    size={70}
                    borderWidth={3}
                    delay={5}
                  />
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden transition-all duration-150">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex h-16 items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2 transition-colors duration-150" prefetch={false}>
                <MountainIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">EasyTrack</span>
              </Link>
              <Toggle
                variant="outline"
                aria-label="Toggle dark mode"
                className="md:hidden transition-colors duration-150"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "dark" ? (
                  <MoonIcon className="h-4 w-4" />
                ) : (
                  <SunIcon className="h-4 w-4" />
                )}
              </Toggle>
            </div>
            <div className="grid gap-2 py-6 px-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-md font-light transition-colors duration-150 hover:text-primary px-4 py-2 rounded-md"
                prefetch={false}
              >
                <HomeIcon className="h-5 w-5" />
                Home
              </Link>
              <Link
                href="/news"
                className="flex items-center gap-2 text-md font-light transition-colors duration-150 hover:text-primary px-4 py-2 rounded-md"
                prefetch={false}
              >
                <NewspaperIcon className="h-5 w-5" />
                News
              </Link>
              <div className="flex flex-col gap-2">
                {user ? (
                  <Button
                    className="text-sm font-medium transition-colors duration-150 hover:text-primary cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 text-sm font-medium transition-colors duration-150 hover:text-primary"
                      prefetch={false}
                    >
                      <LogInIcon className="h-5 w-5" />
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      prefetch={false}
                    >
                      <Button
                        className="relative text-sm font-medium w-full transition-all duration-150"
                        variant="default"
                      >
                        <BorderBeam 
                          duration={20}
                          size={250}
                          borderWidth={4}
                        />
                        Register
                      </Button>
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

function LogOutIcon(props: any) {
  return(
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transform rotate-0"
  >
    <g stroke="currentColor" strokeWidth="1.56" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12H13" />
      <path d="M18 15L20.913 12.087C20.961 12.039 20.961 11.961 20.913 11.913L18 9" />
      <path d="M16 5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19" />
    </g>
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
      width="30"
      height="30"
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

function StockIcon(props: any) {
  return (
    <svg
      fill="#16d07f"
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 101.968 101.968"
      stroke="#16d07f"
    >
      <g>
        <path d="M24.715,47.432L7.968,64.86v29.406c0,0.828,0.671,1.5,1.5,1.5h20.334c0.828,0,1.5-0.672,1.5-1.5V49.158l-4.69-1.726H24.715z" />
        <path d="M66.135,61.1H45.801c-0.828,0-1.5,0.672-1.5,1.5v31.666c0,0.828,0.672,1.5,1.5,1.5h20.334c0.829,0,1.5-0.672,1.5-1.5V62.6C67.635,61.772,66.964,61.1,66.135,61.1z" />
        <path d="M101.724,29.49c-0.777,0.406-1.652,0.621-2.53,0.621c-1.276,0-2.521-0.45-3.5-1.27l-3.694-3.088l-13.365,14.58v53.934c0,0.828,0.672,1.5,1.5,1.5h20.334c0.829,0,1.5-0.672,1.5-1.5v-64.93C101.885,29.387,101.81,29.445,101.724,29.49z" />
        <path d="M57.797,54.094c1.144,0.419,2.424,0.108,3.248-0.788l30.839-33.643l7.217,6.032c0.353,0.294,0.847,0.349,1.254,0.136c0.407-0.214,0.646-0.648,0.605-1.107L99.396,7.235c-0.055-0.625-0.606-1.086-1.231-1.029l-17.49,1.563c-0.458,0.041-0.846,0.354-0.982,0.791C79.646,8.706,79.631,8.854,79.644,9c0.026,0.294,0.167,0.572,0.403,0.769l7.229,6.043L57.98,47.769L24.535,35.463c-1.118-0.41-2.373-0.121-3.198,0.735l-20.5,21.333c-1.148,1.195-1.11,3.095,0.084,4.242c0.583,0.561,1.332,0.837,2.079,0.837c0.788,0,1.574-0.309,2.164-0.921l19.141-19.92L57.797,54.094z" />
      </g>
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