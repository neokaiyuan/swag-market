"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const SellPage = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");

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

    // Upload image to Supabase and retrieve image URL
    let imageUrl = null;
    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload image
      const { error } = await supabase.storage
        .from("swag-market")
        .upload(filePath, image);

      if (error) {
        console.error("Error uploading file:", error.message);
        return;
      } else {
        console.log("File uploaded successfully:", filePath);

        // Retrieve image URL
        const { data } = supabase.storage
          .from("swag-market")
          .getPublicUrl(filePath);
        console.log("Public URL:", data.publicUrl);
        imageUrl = data.publicUrl;
      }
    }

    // Save listing
    const { data, error } = await supabase
      .from("listings")
      .insert({
        title,
        price,
        description,
        image_url: imageUrl,
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
        <label className="block text-lg font-medium text-white">
          Product Image
        </label>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImage(e.target.files[0]);
              setImageName(e.target.files[0].name);
            }
          }}
          className="w-full p-2 border border-gray-300 rounded text-black"
        />
        {imageName && <p className="text-white">Selected file: {imageName}</p>}
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
