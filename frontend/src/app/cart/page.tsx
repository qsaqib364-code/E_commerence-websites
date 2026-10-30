"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const orderData = {
      customer_name: customerName,
      phone: phone,
      city: city,
      address: address,
      payment_method: "COD",
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      // Token hasil karein (Agar customer login hai)
      const token = localStorage.getItem("customer_token");
      const headers: any = { "Content-Type": "application/json" };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`; // Token header mein bhejein
      }

      const res = await fetch("http://127.0.0.1:8000/api/v1/orders/", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Order place nahi ho saka.");
      }

      // Order successful!
      clearCart();
      alert("Mubarak ho! Aapka order successfully place ho gaya hai.");
      router.push("/"); // Homepage par wapas bhej dein

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Aapka Cart Khali Hai!</h2>
        <button onClick={() => router.push("/products")} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
          Shopping Start Karein
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Cart Items */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Shopping Cart</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                     {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-gray-500 text-sm">Rs. {item.price}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border rounded">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">-</button>
                    <span className="px-3 font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center text-xl font-extrabold text-gray-800">
            <span>Total:</span>
            <span className="text-green-600">Rs. {cartTotal}</span>
          </div>
        </div>

        {/* Right Side: Checkout Form */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Checkout Details</h2>
          
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border p-3 rounded focus:outline-blue-500 text-black" placeholder="Ali Khan" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
              <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-3 rounded focus:outline-blue-500 text-black" placeholder="03001234567" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">City</label>
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full border p-3 rounded focus:outline-blue-500 text-black" placeholder="Rawalpindi" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Full Address</label>
              <textarea required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border p-3 rounded focus:outline-blue-500 text-black" placeholder="House 123, Street 4, Saddar..." rows={3}></textarea>
            </div>
            
            <button disabled={loading} type="submit" className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition shadow-lg mt-4">
              {loading ? "Processing..." : `Place Order (Rs. ${cartTotal})`}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}