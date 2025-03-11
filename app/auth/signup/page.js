"use client"; // Add this at the top

import { useState } from "react";
import { useRouter } from "next/navigation"; // Change this import
import axios from "axios";

export default function Signup() {
  const router = useRouter(); // Use the new router
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/signup", form);
      router.push("/auth/signin"); // Redirect to login page after signup
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border p-2 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Sign Up
      </button>
    </form>
  );
}
