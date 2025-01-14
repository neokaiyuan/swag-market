import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: listings } = await supabase.from("listings").select();

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
          {/* TODO: Add profile indicator when user logged in */}
          {/* {isLoggedIn ? (
            <div className="bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
              {userInitials}
            </div>
          ) : ( */}
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
          {/* )} */}
        </div>
      </nav>
      <main className="p-8">
        {listings &&
          listings.map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.id}`}>
              <div>{listing.title}</div>
            </Link>
          ))}
      </main>
    </div>
  );
}
