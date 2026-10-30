"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    const fetchStats = async () => {
      try {
        const ordersRes = await fetch("https://e-commerce-websites.onrender.com/api/v1/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orders = await ordersRes.json();

        const productsRes = await fetch("https://e-commerce-websites.onrender.com/api/v1/products/");
        const products = await productsRes.json();

        const totalSales = orders.reduce((sum: number, order: any) => sum + Number(order.total_amount), 0);
        
        setStats({
          totalSales: totalSales,
          totalOrders: orders.length,
          totalProducts: products.length,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Dashboard...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-semibold mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-gray-800">Rs. {stats.totalSales.toLocaleString()}</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-semibold mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalOrders}</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm font-semibold mb-1">Products in Store</p>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalProducts}</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">System Status</h3>
        <p className="text-gray-500 text-sm">Aapka system perfectly chal raha hai. Naye orders lene ke liye tayyar hain!</p>
      </div>
    </div>
  );
}