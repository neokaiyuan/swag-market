import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const Navbar = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="bg-gray-800">
      <div className="flex justify-between items-center p-4 max-w-lg mx-auto">
        <Link href="/" className="text-xl font-bold">
          OpenAI Swag Market
        </Link>
        <div className="flex gap-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sell
          </button>
          {user ? (
            <span
              className="bg-white text-gray-800 font-bold rounded-full flex items-center justify-center"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              {user.email ? user.email.charAt(0).toUpperCase() : ""}
            </span>
          ) : (
            <Link
              href="/login"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
