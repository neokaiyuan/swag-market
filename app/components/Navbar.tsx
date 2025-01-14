import Link from "next/link";

const Navbar = () => (
  <nav className="flex justify-between items-center p-4 bg-gray-800">
    <Link href="/" className="text-xl font-bold">
      OpenAI Swag Market
    </Link>
    <div className="flex gap-4">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Sell
      </button>
      {/* TODO: Add profile indicator when user logged in */}
      {/* {isLoggedIn ? (
        <div className="bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
          {userInitials}
        </div>
      ) : ( */}
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Login
      </button>
      {/* )} */}
    </div>
  </nav>
);

export default Navbar;
