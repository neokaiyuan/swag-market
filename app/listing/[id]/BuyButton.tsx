"use client";

import { createClient } from "@/utils/supabase/client";

interface BuyButtonProps {
  listingId: string;
}

const BuyButton = ({ listingId }: BuyButtonProps) => {
  async function handleBuy(listingId: string) {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      alert("Please login first to buy an item");
      return;
    }

    const { error } = await supabase
      .from("listings")
      .update({ buyer_id: authUser.id })
      .eq("id", listingId);

    if (error) {
      console.error("Error updating listing:", error);
    } else {
      alert("Purchase successful!");
    }
  }

  return (
    <button
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={() => handleBuy(listingId)}
    >
      Buy
    </button>
  );
};

export default BuyButton;
