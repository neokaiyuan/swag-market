import Link from "next/link";

const Navbar = () => (
  <nav className="bg-gray-800">
    <div className="flex justify-between items-center p-4 max-w-lg mx-auto">
      <Link href="/" className="text-xl font-bold">
        OpenAI Swag Market
      </Link>
      <div className="flex gap-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sell
        </button>
        <Link
          href="/login"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
