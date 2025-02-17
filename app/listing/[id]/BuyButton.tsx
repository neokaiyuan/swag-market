"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface BuyButtonProps {
  listingId: string;
  isSoldInDb: boolean;
}

const BuyButton = ({ listingId, isSoldInDb }: BuyButtonProps) => {
  const [isSold, setIsSold] = useState(isSoldInDb);

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
      alert("Successful purchase!");
      setIsSold(true);
    }
  }

  return (
    <button
      className={`mt-4 px-4 py-2 rounded text-white ${
        isSold
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
      onClick={() => handleBuy(listingId)}
      disabled={isSold}
    >
      {isSold ? "Sold" : "Buy"}
    </button>
  );
};

export default BuyButton;
