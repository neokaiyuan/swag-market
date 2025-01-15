"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const SellButton = () => {
  const router = useRouter();

  const handleClick = async () => {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      alert("Please log in first to sell an item.");
    } else {
      router.push("/listing/create");
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
