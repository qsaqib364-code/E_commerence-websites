"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
  category: string;
  image_url?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchProducts = () => {
    fetch("https://e-commerce-websites.onrender.com/api/v1/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUploading(true);
    
    const token = localStorage.getItem("admin_token");
    let uploadedImageUrl = null;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("https://e-commerce-websites.onrender.com/api/v1/upload/", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Image upload fail ho gayi.");
        const uploadData = await uploadRes.json();
        uploadedImageUrl = uploadData.image_url;
      }

      const res = await fetch("https://e-commerce-websites.onrender.com/api/v1/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          category,
          stock_quantity: parseInt(stock),
          image_url: uploadedImageUrl, 
        }),
      });

      if (!res.ok) throw new Error("Product add nahi ho saka.");

      setIsFormOpen(false);
      setName(""); setPrice(""); setCategory(""); setStock(""); setImageFile(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Kya aap waqai yeh product delete karna chahte hain?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`https://e-commerce-websites.onrender.com/api/v1/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete nahi ho saka");
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert("Product delete nahi ho saka!");
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {isFormOpen ? "Close Form" : "+ Add New Product"}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-t-4 border-blue-500">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Product</h2>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Product Name" required value={name} onChange={(e) => setName(e.target.value)} className="border p-3 rounded text-black" />
            <input type="text" placeholder="Category (e.g. Waistcoat)" required value={category} onChange={(e) => setCategory(e.target.value)} className="border p-3 rounded text-black" />
            <input type="number" placeholder="Price (Rs)" required value={price} onChange={(e) => setPrice(e.target.value)} className="border p-3 rounded text-black" />
            <input type="number" placeholder="Stock Quantity" required value={stock} onChange={(e) => setStock(e.target.value)} className="border p-3 rounded text-black" />
            
            <div className="md:col-span-2 border-2 border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
              <label className="block text-gray-700 font-semibold mb-2">Product Image (Select from device)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} 
                className="w-full text-gray-700" 
              />
            </div>
            
            <button type="submit" disabled={uploading} className="bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 md:col-span-2 mt-2">
              {uploading ? "Uploading..." : "Save Product"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Image</th>
              <th className="p-4 font-semibold text-gray-600">Product Name</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Stock</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">
                   {product.image_url ? (
                     <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                   ) : (
                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                   )}
                </td>
                <td className="p-4 font-bold text-gray-800">{product.name}</td>
                <td className="p-4 font-bold text-green-600">Rs. {product.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock_quantity}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800 font-bold bg-red-50 px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}