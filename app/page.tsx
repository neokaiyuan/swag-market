import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: listings } = await supabase.from("listings").select();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center">
      <main className="p-8 flex flex-col items-center gap-4">
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
