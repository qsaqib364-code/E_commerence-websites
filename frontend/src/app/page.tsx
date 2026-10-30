import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-br from-blue-50 via-white to-gray-100">
        <span className="bg-blue-100 text-blue-700 font-bold px-4 py-1.5 rounded-full text-sm mb-6 border border-blue-200">
          New Winter Collection 2026
        </span>
        <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight max-w-4xl mx-auto">
          Premium Men's <span className="text-blue-600">Waistcoats</span> & <span className="text-blue-600">Coats</span>
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover our exclusive collection of high-quality, custom-tailored formal wear. Perfect for weddings, events, and corporate wear.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/products" 
            className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Shop Now
          </Link>
          <Link 
            href="#contact" 
            className="bg-white text-gray-800 border-2 border-gray-200 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition"
          >
            Contact Us
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl mb-4">✂️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Custom Tailoring</h3>
            <p className="text-gray-500">Perfect fit guaranteed for every body type.</p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
            <p className="text-gray-500">Delivery all across Pakistan within 3-5 days.</p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Fabric</h3>
            <p className="text-gray-500">Sourced from the best mills in Faisalabad.</p>
          </div>
        </div>
      </section>

      {/* Contact & Footer Section */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div>
            <h2 className="text-2xl font-extrabold text-blue-400 mb-4">MyStore.</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premium destination for formal menswear in Pakistan. We manufacture high-quality waistcoats, coats, and sherwanis.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link href="/products" className="hover:text-blue-400">Shop Products</Link></li>
              <li><Link href="/admin" className="hover:text-blue-400">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 Rawalpindi Saddar, Pakistan</li>
              <li>📞 +92 300 1234567</li>
              <li>✉️ support@mystore.com</li>
            </ul>
          </div>

        </div>
        <div className="text-center text-gray-500 text-sm mt-12 border-t border-gray-800 pt-6">
          © 2026 MyStore. All rights reserved.
        </div>
      </footer>

    </div>
  );
}