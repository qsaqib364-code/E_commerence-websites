"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  customer_name: string;
  phone: string;
  total_amount: number;
  order_status: string;
  payment_method: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    const token = localStorage.getItem("admin_token");
    fetch("http://127.0.0.1:8000/api/v1/orders/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Status update nahi ho saka");
      
      // Local state update karein taake page refresh na karna pade
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
    } catch (err) {
      alert("Error: Status update nahi hua.");
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Live Orders...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Live Orders</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Order ID</th>
              <th className="p-4 font-semibold text-gray-600">Customer</th>
              <th className="p-4 font-semibold text-gray-600">Amount</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
               <tr><td colSpan={4} className="p-8 text-center text-gray-500">Koi order nahi mila.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-blue-600 font-bold">#{order.id}</td>
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{order.customer_name}</p>
                    <p className="text-xs text-gray-500">{order.phone}</p>
                  </td>
                  <td className="p-4 font-bold text-green-600">Rs. {order.total_amount}</td>
                  <td className="p-4">
                    <select 
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold border-2 outline-none ${
                        order.order_status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-200' : 
                        order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}