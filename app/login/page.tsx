import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex justify-center">
      <form className="flex flex-col gap-2 w-72 p-5 border border-gray-300 rounded-lg shadow-md mt-24">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="p-2 rounded border border-gray-300 text-gray-800 text-lg"
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="p-2 rounded border border-gray-300 text-gray-800 text-lg"
        />
        <button
          formAction={login}
          className="p-2 rounded bg-blue-600 text-white border-none cursor-pointer"
        >
          Log in
        </button>
        <button
          formAction={signup}
          className="p-2 rounded bg-blue-600 text-white border-none cursor-pointer"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
