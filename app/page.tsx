"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [isLoggedIn] = useState(false);
  const userInitials = "JD"; // Example initials, replace with actual user data

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="flex justify-between items-center p-4 bg-gray-800">
        <Link href="/" className="text-xl font-bold">
          OpenAI Swag Market
        </Link>
        <div className="flex gap-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sell
          </button>
          {isLoggedIn ? (
            <div className="bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
              {userInitials}
            </div>
          ) : (
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          )}
        </div>
      </nav>
      <main className="p-8">{/* List of items will be displayed here */}</main>
    </div>
  );
}
