"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { cart } = useCart();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    // Check karein ke customer login hai ya nahi
    const token = localStorage.getItem("customer_token");
    if (token) setIsLoggedIn(true);
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    setIsLoggedIn(false);
    router.push("/");
  };

  if (!mounted) return null; // Hydration error se bachne ke liye

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold text-blue-600 tracking-tight">
          MyStore.
        </Link>

        {/* Center Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 font-semibold hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/products" className="text-gray-700 font-semibold hover:text-blue-600 transition">
            Shop
          </Link>
          <Link href="/#contact" className="text-gray-700 font-semibold hover:text-blue-600 transition">
            Contact Us
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-6">
          
          {/* Admin Button */}
          <Link href="/admin" className="hidden md:block text-sm font-bold text-gray-500 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition">
            Admin Panel
          </Link>

          {/* Customer Account Links */}
          <div className="hidden md:flex items-center space-x-4 border-r border-gray-300 pr-4">
            {isLoggedIn ? (
              <>
                <Link href="/account/orders" className="text-gray-700 font-semibold hover:text-blue-600 text-sm">
                  My Orders
                </Link>
                <button onClick={handleLogout} className="text-red-500 font-semibold hover:text-red-700 text-sm">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/account/login" className="text-gray-700 font-semibold hover:text-blue-600 text-sm">
                Login
              </Link>
            )}
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative text-gray-700 font-semibold hover:text-blue-600 transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="hidden sm:block">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
        
      </div>
    </nav>
  );
}