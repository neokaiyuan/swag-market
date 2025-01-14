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
    <section className="flex-center wrapper min-h-screen w-full flex-col gap-8 pb-8 pt-24 max-w-lg mx-auto">
      <div className="flex w-full flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <Image
            src={listing.image_url}
            alt={listing.title}
            width={800}
            height={600}
            className="w-full h-auto object-cover max-w-full max-h-[500px]"
          />
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Buy
          </button>
        </div>
        <div className="flex flex-col gap-5 md:w-1/2">
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <div className="flex gap-4">
            <p className="p-medium-16">Price: ${listing.price}</p>
          </div>
          <p className="p-regular-20">{listing.description}</p>
        </div>
      </div>
    </section>
  );
}

export default ListingPage;
