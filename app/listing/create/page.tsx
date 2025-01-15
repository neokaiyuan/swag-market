"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const SellPage = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const router = useRouter();

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.scrollTop = descriptionRef.current.scrollHeight;
    }
  }, [description]);

  // Fetch description of current image from OpenAI
  const generateDescription = async () => {
    setIsGeneratingDescription(true);
    try {
      if (!image) {
        throw new Error("No image selected");
      }

      // Convert image to Base64 using a Promise
      const base64Image = await new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(image as Blob);
        fileReader.onload = () => {
          if (fileReader.result && typeof fileReader.result === "string") {
            resolve(fileReader.result.split(",")[1]);
          } else {
            reject("Failed to convert image to Base64");
          }
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });

      // Send the image to the API to get a description
      const response = await fetch("/api/image-to-description", {
        method: "POST",
        body: JSON.stringify({
          base64Image,
        }),
      });

      if (!response.body) {
        throw new Error("Did not receive ReadableStream from API");
      }

      const streamReader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let description = "";

      // Decode the response stream and save it in local state
      while (true) {
        const { done, value } = await streamReader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Extract the relevant text content from the chunk
        const textContent = chunk
          .split("\n") // Each chunk can have multiple lines
          .filter((line) => line.startsWith("0")) // 0 means model response text
          // Remove leading 0:" and trailing " characters, and replace \n with actual newline character
          .map((line) => line.slice(3, -1).replaceAll("\\n", "\n"))
          .join("");

        description += textContent;

        // Update the history with the new description chunk
        setDescription(description);
      }
    } catch (error) {
      console.error("Failed to fetch description:", error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

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
        // Retrieve image URL
        const { data } = supabase.storage
          .from("swag-market")
          .getPublicUrl(filePath);
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
        {imageName && (
          <div className="flex items-center justify-between">
            <p className="text-white mr-2">Selected file: {imageName}</p>
            <button
              type="button"
              onClick={generateDescription}
              className={`bg-green-500 text-white font-bold py-1 px-2 rounded ${
                isGeneratingDescription
                  ? "bg-gray-400 cursor-not-allowed"
                  : "hover:bg-green-700"
              }`}
              disabled={isGeneratingDescription}
            >
              {isGeneratingDescription
                ? "Generating..."
                : "Generate Description"}
            </button>
          </div>
        )}
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
          ref={descriptionRef}
          placeholder="The iconic and soft OpenAI logo plushie, now in a limited-edition dark theme!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black overflow-auto"
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
