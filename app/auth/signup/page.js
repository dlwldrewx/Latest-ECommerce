import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post("/api/auth/signup", form);
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full"
        />
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
        <button className="bg-black text-white px-4 py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}
