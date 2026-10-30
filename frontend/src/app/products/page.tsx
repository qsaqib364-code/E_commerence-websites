"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext"; 

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  category: string;
  image_url: string | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); 

  useEffect(() => {
    fetch("https://e-commerce-websites.onrender.com/api/v1/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-20 text-2xl font-bold">Loading Products...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Our Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-56 bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">No Image</span>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{product.category}</span>
              </div>
              <p className="text-gray-500 mb-4 line-clamp-2">{product.description || "No description."}</p>
              <p className="text-2xl font-extrabold text-green-600 mb-4">Rs. {product.price}</p>
              <button 
                onClick={() => addToCart(product)}
                className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                  product.stock_quantity > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity > 0 ? `Add to Cart (${product.stock_quantity} left)` : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}