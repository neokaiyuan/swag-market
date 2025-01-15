import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, buyer_id, image_url");

  const sortedListings = listings?.sort((a) => (a.buyer_id ? 1 : -1));

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-start">
      <main className="p-8 grid grid-cols-2 gap-2">
        {sortedListings &&
          sortedListings.map((listing) => {
            const isSold = !!listing.buyer_id;
            const listingTitle = isSold ? (
              <span style={{ textDecoration: "line-through", color: "gray" }}>
                [SOLD] {listing.title}
              </span>
            ) : (
              <span>{listing.title}</span>
            );
            return (
              <Link href={`/listing/${listing.id}`} key={listing.id}>
                <div
                  className={`p-4 bg-gray-800 text-white rounded shadow-md ${
                    isSold ? "opacity-50" : ""
                  }`}
                >
                  <Image
                    src={listing.image_url}
                    alt={listing.title}
                    width={500}
                    height={200}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                  {listingTitle}
                </div>
              </Link>
            );
          })}
      </main>
    </div>
  );
}
