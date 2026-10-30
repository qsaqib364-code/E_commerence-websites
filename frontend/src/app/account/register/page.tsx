"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerRegister() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Registration fail ho gayi. Email pehle se ho sakta hai.");
      router.push("/account/login"); // Register hone ke baad login par bhej dein
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Full Name" required onChange={(e) => setForm({...form, full_name: e.target.value})} className="w-full border p-3 rounded text-black" />
          <input type="email" placeholder="Email" required onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border p-3 rounded text-black" />
          <input type="text" placeholder="Phone (e.g. 03001234567)" onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full border p-3 rounded text-black" />
          <input type="password" placeholder="Password" required onChange={(e) => setForm({...form, password: e.target.value})} className="w-full border p-3 rounded text-black" />
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700">Register</button>
        </form>
        <p className="text-center mt-4 text-gray-600">Pehle se account hai? <Link href="/account/login" className="text-blue-600 font-bold">Login</Link></p>
      </div>
    </div>
  );
}