import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

// Define page props interface
interface ListingPageProps {
  params: {
    id: string;
  };
}

// Create async page component
async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  // Fetch listing details using the ID
  const { data: listing } = await supabase
    .from("listings")
    .select("id, title, description, price, image_url")
    .eq("id", id)
    .single();

  // Handle case where listing is not found
  if (!listing) {
    return (
      <div className="flex-center wrapper min-h-screen w-full flex-col gap-4">
        <h1 className="h1-bold">Listing Not Found</h1>
        <p className="p-regular-20">
          The listing you&apos;re looking for doesn&apos;t exist
        </p>
      </div>
    );
  }

  return (
    <section className="flex-center wrapper min-h-screen w-full flex-col gap-8 pb-8 pt-24">
      <div className="flex w-full flex-col gap-8">
        <h1 className="h1-bold">{listing.title}</h1>

        <Image
          src={listing.image_url}
          alt={listing.title}
          width={800}
          height={600}
          className="w-full h-auto object-cover"
        />

        {/* Listing details */}
        <div className="flex flex-col gap-5">
          <p className="p-regular-20">{listing.description}</p>
          <div className="flex gap-4">
            <p className="p-medium-16">Price: ${listing.price}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ListingPage;
