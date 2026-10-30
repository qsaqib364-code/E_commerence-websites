"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: number; total_amount: number; order_status: string; created_at: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (!token) return router.push("/account/login");

    fetch("http://127.0.0.1:8000/api/v1/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="text-center mt-20 font-bold">Loading Orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <Link href="/products" className="text-blue-600 font-semibold hover:underline">← Continue Shopping</Link>
        </div>
        
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <p className="text-gray-500 text-lg">Aapne abhi tak koi order nahi kiya.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Order #{order.id}</h3>
                  <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-green-600 text-xl">Rs. {order.total_amount}</p>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}