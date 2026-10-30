"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/login"); 
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Orders", path: "/admin/orders", icon: "📦" },
    { name: "Products", path: "/admin/products", icon: "👔" },
  ];

  if (loading || !isAuthenticated) {
    return <div className="h-screen flex items-center justify-center font-bold text-xl">Checking Authentication...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-widest">MyStore <span className="text-blue-500">Admin</span></h1>
        </div>
        <nav className="flex-1 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} className={`flex items-center gap-4 px-6 py-3 transition-colors ${pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <span>{item.icon}</span>
              <span className="font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">⬅️ Back to Store</Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold">🚪 Logout</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800">{menuItems.find(m => m.path === pathname)?.name || "Admin Panel"}</h2>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-600">Admin</span>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}