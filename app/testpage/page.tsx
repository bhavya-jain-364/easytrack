"use client";

import { useRouter } from "next/router";

export default function TestPage() {
  const router = useRouter();

  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={() => router.push("/login")}>Go to Login</button>
    </div>
  );
}