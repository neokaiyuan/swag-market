"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const SellPage = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      alert("You must be logged in to create a listing.");
      return;
    }

    const { data, error } = await supabase
      .from("listings")
      .insert({
        title,
        price,
        description,
        // image,
        seller_id: authUser.id,
      })
      .select("id");

    if (error) {
      console.error("Error creating listing:", error);
    } else {
      alert("Listing created successfully!");
      router.push(`/listing/${data[0].id}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create a New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-lg font-medium text-white">Image</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded text-black"
        />
        <label className="block text-lg font-medium text-white">Title</label>
        <input
          type="text"
          placeholder="Limited-Edition Dark-Theme OpenAI Logo Plushie"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black"
          required
        />
        <label className="block text-lg font-medium text-white">Price</label>
        <input
          type="number"
          placeholder="100"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black"
          required
        />
        <label className="block text-lg font-medium text-white">
          Description
        </label>
        <textarea
          placeholder="The iconic and soft OpenAI logo plushie, now in a limited-edition dark theme!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default SellPage;
