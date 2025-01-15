"use client";

import { createClient } from "@/utils/supabase/client";

const SellButton = () => {
  const handleClick = async () => {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      alert("Please log in first to sell an item.");
    } else {
      window.location.href = "/listing/create";
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sell
    </button>
  );
};

export default SellButton;
