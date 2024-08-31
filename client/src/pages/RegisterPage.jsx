import { useState } from "react";
import vid from "../assets/purp.mp4"

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      alert('Registration successful');
    } else {
      alert('Registration failed');
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
        <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={vid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-dark max-w-sm w-full">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Register</h1>
        <form onSubmit={register} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={ev => setUsername(ev.target.value)}
            className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
            className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <button
            type="submit"
            className="w-full bg-gray-700 text-gray-100 py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
