import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, buyer_id");

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center">
      <main className="p-8 flex flex-col items-center gap-4">
        {listings &&
          listings.map((listing) => {
            const listingTitle = listing.buyer_id ? (
              <span style={{ textDecoration: "line-through" }}>
                [SOLD] {listing.title}
              </span>
            ) : (
              <span>{listing.title}</span>
            );
            return (
              <div key={listing.id}>
                <Link href={`/listing/${listing.id}`}>{listingTitle}</Link>
              </div>
            );
          })}
      </main>
    </div>
  );
}
