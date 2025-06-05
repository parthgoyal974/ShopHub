"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Logo from '../assets/logo.jpg';

const PRODUCTS_PER_PAGE = 4;
const CATEGORIES_PER_PAGE = 6;

const categories = [
  { name: "Electronics", icon: "📱", count: "2,500+ items" },
  { name: "Fashion", icon: "👕", count: "1,800+ items" },
  { name: "Home & Garden", icon: "🏠", count: "3,200+ items" },
  { name: "Sports", icon: "⚽", count: "1,200+ items" },
  { name: "Books", icon: "📚", count: "5,000+ items" },
  { name: "Beauty", icon: "💄", count: "900+ items" },
  { name: "Furniture", icon: "🛋️", count: "1,100+ items" }
];

const Home = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [products, setProducts] = useState([])

  // Best Products Pagination State
  const [bestProducts, setBestProducts] = useState([]);
  const [bestProductsPage, setBestProductsPage] = useState(1);
  const [bestProductsTotalPages, setBestProductsTotalPages] = useState(1);
  const [loadingBest, setLoadingBest] = useState(false);

  // Categories Pagination State
  const [catPage, setCatPage] = useState(1);
  const totalCatPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
  const paginatedCategories = categories.slice(
    (catPage - 1) * CATEGORIES_PER_PAGE,
    catPage * CATEGORIES_PER_PAGE
  );

  // Fetch user info
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:3000/auth/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status === 200) {
        setUsername(response.data.user.username)
      } else {
        setUsername('')
      }
    } catch (err) {
      setUsername('')
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token")
    setUsername('')
    navigate("/")
  }

  // Fetch all products for "Products by Category" (not paginated)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products")
        setProducts(response.data)
      } catch (err) {
        console.error("Failed to fetch products:", err)
      }
    }
    fetchProducts()
  }, [])

  // Fetch best products for current page (server-side pagination)
  const fetchBestProducts = async (page = 1) => {
    setLoadingBest(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products/best?page=${page}&limit=${PRODUCTS_PER_PAGE}`
      );
      setBestProducts(response.data.products);
      setBestProductsTotalPages(response.data.totalPages);
      setBestProductsPage(response.data.currentPage);
    } catch (err) {
      setBestProducts([]);
      setBestProductsTotalPages(1);
    }
    setLoadingBest(false);
  };

  useEffect(() => {
    fetchBestProducts(bestProductsPage);
    // eslint-disable-next-line
  }, [bestProductsPage]);

  const handleBestPrevPage = () => {
    if (bestProductsPage > 1) setBestProductsPage(bestProductsPage - 1);
  };

  const handleBestNextPage = () => {
    if (bestProductsPage < bestProductsTotalPages) setBestProductsPage(bestProductsPage + 1);
  };

  // Group products by category for Products by Category section
  const productsByCategory = products.reduce((groups, product) => {
    if (!groups[product.category]) groups[product.category] = []
    groups[product.category].push(product)
    return groups
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">ShopHub</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Products</a>
              <Link to="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">Categories</Link>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              {username ? (
                <>
                  <span className="text-gray-700">Welcome, {username}</span>
                  <Link to="/cart" className="p-2 text-gray-700 hover:text-blue-600 transition-colors">🛒</Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/cart" className="p-2 text-gray-700 hover:text-blue-600 transition-colors">🛒</Link>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6">Discover Amazing Products at Unbeatable Prices</h2>
              <p className="text-xl mb-8 text-blue-100">
                Shop from thousands of products across multiple categories. Fast shipping, great prices, and excellent customer service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                  Shop Now
                </button>
                {!username && (
                  <button
                    onClick={() => navigate("/register")}
                    className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    Create Account
                  </button>
                )}
                {username && (
                  <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                    Learn More
                  </button>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img src={Logo} alt="Shopping" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section (paginated) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {paginatedCategories.map((category, index) => (
              <Link
                to={`/categories?category=${encodeURIComponent(category.name)}`}
                key={index}
                className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer block"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                <p className="text-sm text-gray-600">{category.count}</p>
              </Link>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCatPage((p) => Math.max(1, p - 1))}
              disabled={catPage === 1}
              className={`px-4 py-2 rounded-lg border ${
                catPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {catPage} of {totalCatPages}
            </span>
            <button
              onClick={() => setCatPage((p) => Math.min(totalCatPages, p + 1))}
              disabled={catPage === totalCatPages}
              className={`px-4 py-2 rounded-lg border ${
                catPage === totalCatPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Best Products Section with Server-Side Pagination */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Best Rated Products</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Top rated products in our store</p>
          </div>
          {loadingBest ? (
            <div className="text-center text-gray-500 py-12 text-xl">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                >
                  <div className="relative w-full aspect-w-4 aspect-h-3 bg-gray-100">
                    <img
                      src={`http://localhost:3000/uploads/${product.image}`}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                      style={{ aspectRatio: '4/3', backgroundColor: '#f3f4f6' }}
                    />
                    <div className="absolute top-2 right-2 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-yellow-600 flex items-center shadow">
                      <span className="mr-1">★</span>{product.rating}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col p-5">
                    <h4 className="font-semibold text-lg text-gray-900 mb-1 truncate">{product.name}</h4>
                    <p className="text-sm text-gray-500 mb-4 truncate">{product.category}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">
                        ${product.price}
                      </span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={handleBestPrevPage}
              disabled={bestProductsPage === 1}
              className={`px-4 py-2 rounded-lg border ${bestProductsPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-blue-50"}`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {bestProductsPage} of {bestProductsTotalPages}
            </span>
            <button
              onClick={handleBestNextPage}
              disabled={bestProductsPage === bestProductsTotalPages}
              className={`px-4 py-2 rounded-lg border ${bestProductsPage === bestProductsTotalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-blue-50"}`}
            >
              Next
            </button>
          </div>
        </div>
      </section>


      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Free Shipping</h4>
              <p className="text-gray-600">Free shipping on orders over $50. Fast and reliable delivery.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Secure Payment</h4>
              <p className="text-gray-600">Your payment information is safe and secure with us.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">↩️</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Easy Returns</h4>
              <p className="text-gray-600">30-day return policy. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Stay Updated</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest deals and updates delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">ShopHub</h4>
              <p className="text-gray-400">
                Your one-stop destination for all your shopping needs. Quality products at affordable prices.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Electronics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fashion</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Home & Garden</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sports</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
