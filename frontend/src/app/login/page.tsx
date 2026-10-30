"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Login karke Token hasal karein
      const res = await fetch("https://e-commerce-websites.onrender.com/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Email ya password galat hai.");

      const data = await res.json();
      const token = data.access_token;

      // Step 2: Token ke zariye check karein ke user Admin hai ya nahi
      const userRes = await fetch("https://e-commerce-websites.onrender.com/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!userRes.ok) throw new Error("User verify nahi ho saka.");
      
      const userData = await userRes.json();

      // Step 3: Agar Admin nahi hai, toh andar na aane dein
      if (!userData.is_admin) {
        throw new Error("Aap Admin nahi hain! Aap yahan login nahi kar sakte.");
      }

      // Agar Admin hai, toh Token save karke Dashboard bhej dein
      localStorage.setItem("admin_token", token);
      router.push("/admin");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600">MyStore <span className="text-gray-800">Admin</span></h1>
          <p className="text-gray-500 mt-2">Sirf Admin yahan login kar sakte hain</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center font-semibold">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Admin Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-3 rounded focus:outline-blue-500 text-black" placeholder="saqib@gmail.com" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-3 rounded focus:outline-blue-500 text-black" placeholder="••••••••" />
          </div>
          
          <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mt-4">
            {loading ? "Verifying..." : "Secure Login"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-blue-600">← Back to Store</Link>
        </div>
      </div>
    </div>
  );
}