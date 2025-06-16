"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Logo from '../assets/logo.jpg';

const PRODUCTS_PER_PAGE = 4;
const CATEGORIES_PER_PAGE = 6;

const Home = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

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
  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.post(
        "http://localhost:3000/api/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Added to cart!");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to add to cart.");
      }
    }
  };
  // Fetch user info
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:3000/api/auth/home", {
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

  // Fetch all categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/categories")
        setCategories(response.data)
      } catch (err) {
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  // Fetch all products for "Products by Category" (not paginated)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products")
        setProducts(response.data)
      } catch (err) {
        setProducts([])
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

  // Group products by categoryId for Products by Category section
  const productsByCategory = products.reduce((groups, product) => {
    const catId = product.category ? product.category.id : null;
    if (!catId) return groups;
    if (!groups[catId]) groups[catId] = [];
    groups[catId].push(product);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopHub
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
              <Link to="/Products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Products</Link>
              <Link to="/categories" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Categories</Link>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              {username ? (
                <>
                  <span className="text-gray-700 font-medium">Welcome, <span className="text-blue-600 font-semibold">{username}</span></span>
                  <Link to="/cart" className="p-2 text-gray-700 hover:text-blue-600 transition-colors text-xl">🛒</Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/cart" className="p-2 text-gray-700 hover:text-blue-600 transition-colors text-xl">🛒</Link>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
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
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-6xl font-bold mb-6 leading-tight">
                Discover Amazing Products at 
                <span className="block text-yellow-300">Unbeatable Prices</span>
              </h2>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Shop from thousands of products across multiple categories. Fast shipping, great prices, and excellent customer service guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate("/products")}
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Shop Now
                </button>
                {!username && (
                  <button
                    onClick={() => navigate("/register")}
                    className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
                  >
                    Create Account
                  </button>
                )}
                {username && (
                  <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
                    Learn More
                  </button>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img src={Logo || "/placeholder.svg"} alt="Shopping" className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {paginatedCategories.map((category, index) => (
              <Link
                to={`/categories?category=${encodeURIComponent(category.name)}`}
                key={category.id}
                className="group text-center p-8 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer block transform hover:scale-105 border border-gray-100"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">{
                  category.icon || "🗂️"
                }</div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">{category.name}</h4>
                <p className="text-sm text-gray-500 font-medium">
                  {
                    products.filter(p => p.category && p.category.id === category.id).length
                  } items
                </p>
              </Link>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-12 space-x-3">
            <button
              onClick={() => setCatPage((p) => Math.max(1, p - 1))}
              disabled={catPage === 1}
              className={`px-6 py-3 rounded-xl border font-medium transition-all duration-200 ${
                catPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg"
              }`}
            >
              Previous
            </button>
            <span className="px-6 py-3 text-gray-700 font-medium">
              Page {catPage} of {totalCatPages}
            </span>
            <button
              onClick={() => setCatPage((p) => Math.min(totalCatPages, p + 1))}
              disabled={catPage === totalCatPages}
              className={`px-6 py-3 rounded-xl border font-medium transition-all duration-200 ${
                catPage === totalCatPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Best Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Best Rated Products</h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Top rated products loved by our customers</p>
          </div>
          {loadingBest ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading amazing products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestProducts.map((product) => (
                <Link to={`/products/${product.id}`} key={product.id} className="group block">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col border border-gray-100">
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <img
                        src={`http://localhost:3000/uploads/${product.image}`}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-amber-600 flex items-center shadow-lg">
                        <span className="mr-1">⭐</span>{product.rating}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                    <div className="flex-1 flex flex-col p-6">
                      <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-4 flex-1">
                        {product.category ? product.category.name : ""}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          ${product.price}
                        </span>
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md" onClick={() => handleAddToCart(product.id)}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {/* Pagination Controls */}
          <div className="flex justify-center mt-12 space-x-3">
            <button
              onClick={handleBestPrevPage}
              disabled={bestProductsPage === 1}
              className={`px-6 py-3 rounded-xl border font-medium transition-all duration-200 ${bestProductsPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg"}`}
            >
              Previous
            </button>
            <span className="px-6 py-3 text-gray-700 font-medium">
              Page {bestProductsPage} of {bestProductsTotalPages}
            </span>
            <button
              onClick={handleBestNextPage}
              disabled={bestProductsPage === bestProductsTotalPages}
              className={`px-6 py-3 rounded-xl border font-medium transition-all duration-200 ${bestProductsPage === bestProductsTotalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg"}`}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl">🚚</span>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">Free Shipping</h4>
              <p className="text-gray-600 text-lg">Free shipping on orders over $50. Fast and reliable delivery to your doorstep.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl">🔒</span>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">Secure Payment</h4>
              <p className="text-gray-600 text-lg">Your payment information is safe and secure with our advanced encryption.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl">↩️</span>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">Easy Returns</h4>
              <p className="text-gray-600 text-lg">30-day return policy. No questions asked, hassle-free returns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h3 className="text-4xl font-bold text-white mb-4">Stay Updated</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Subscribe to our newsletter and get the latest deals and updates delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-2 focus:ring-blue-300 outline-none text-lg"
            />
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ShopHub</h4>
              <p className="text-gray-400 text-lg leading-relaxed">
                Your one-stop destination for all your shopping needs. Quality products at affordable prices with exceptional service.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-lg">Quick Links</h5>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors text-lg">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Shipping Info</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-lg">Categories</h5>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors text-lg">Electronics</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Fashion</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Home & Garden</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Sports</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-lg">Follow Us</h5>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p className="text-lg">&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
