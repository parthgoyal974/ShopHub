"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

const CATEGORIES_PER_PAGE = 6

// Helper to read query string
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const CategoriesPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const query = useQuery()
  const initialCategory = query.get("category")

  // State
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState(null)

  const [username, setUsername] = useState("")
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
        setUsername("")
      }
    } catch (err) {
      setUsername("")
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token")
    setUsername("")
    navigate("/")
  }

  // Subcategory-related state
  const [subcategories, setSubcategories] = useState([])
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("all")

  // Pagination state for categories
  const [catPage, setCatPage] = useState(1)
  const totalCatPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE)
  const paginatedCategories = categories.slice((catPage - 1) * CATEGORIES_PER_PAGE, catPage * CATEGORIES_PER_PAGE)

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:3000/api/categories")
        setCategories(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch categories.")
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Fetch subcategories for selected category
  useEffect(() => {
    if (selectedCategoryId) {
      axios
        .get(`http://localhost:3000/api/subcategories/by-category/${selectedCategoryId}`)
        .then((res) => setSubcategories(res.data))
        .catch(() => setSubcategories([]))
      setSelectedSubcategoryId("all")
    } else {
      setSubcategories([])
      setSelectedSubcategoryId("all")
    }
  }, [selectedCategoryId])

  // Fetch products for selected category and subcategory
  useEffect(() => {
    if (selectedCategoryId) {
      setLoading(true)
      let url = `http://localhost:3000/api/products/category/${selectedCategoryId}`
      if (selectedSubcategoryId && selectedSubcategoryId !== "all") {
        url += `?subcategoryId=${selectedSubcategoryId}`
      }
      axios
        .get(url)
        .then((res) => {
          setProducts(res.data)
          setLoading(false)
        })
        .catch(() => {
          setProducts([])
          setLoading(false)
        })
    } else {
      setProducts([])
    }
  }, [selectedCategoryId, selectedSubcategoryId])

  // Sync selectedCategoryId with URL changes (for deep-linking)
  useEffect(() => {
    if (initialCategory && categories.length > 0) {
      // Find category by name, case-insensitive
      const match = categories.find((cat) => cat.name.toLowerCase() === initialCategory.toLowerCase())
      if (match) {
        setSelectedCategoryId(match.id)
        setSelectedCategoryName(match.name)
        // Jump to the page containing this category
        const idx = categories.findIndex((cat) => cat.id === match.id)
        setCatPage(Math.floor(idx / CATEGORIES_PER_PAGE) + 1)
      }
    }
    // eslint-disable-next-line
  }, [initialCategory, categories])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
                onClick={() => navigate("/")}
              >
                ShopHub
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Products
              </Link>
              <span className="text-blue-600 font-bold">Categories</span>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contact
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              {username ? (
                <>
                  <span className="text-gray-700 font-medium">
                    Welcome, <span className="text-blue-600 font-semibold">{username}</span>
                  </span>
                  <Link to="/cart" className="p-2 text-gray-700 hover:text-blue-600 transition-colors text-xl">
                    🛒
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/cart" className="p-2 text-gray-700 hover:text-blue-600 transition-colors text-xl">
                    🛒
                  </Link>
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

      {/* Page Title */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-5xl font-bold mb-4">Browse by Category</h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            Explore all our products, neatly organized by category for your convenience.
          </p>
        </div>
      </section>

      {/* Shop by Category with Pagination */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Click a category to see its products and start shopping
            </p>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading categories...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-red-600 text-xl font-semibold">{error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📂</span>
              </div>
              <p className="text-gray-600 text-xl">No categories found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {paginatedCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`group text-center p-8 rounded-2xl transition-all duration-300 cursor-pointer border-2 w-full h-full transform hover:scale-105 ${
                      selectedCategoryId === category.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-xl"
                        : "bg-white text-gray-900 border-gray-200 hover:shadow-xl hover:border-blue-300"
                    }`}
                    onClick={() => {
                      setSelectedCategoryId(category.id)
                      setSelectedCategoryName(category.name)
                    }}
                  >
                    <div
                      className={`text-5xl mb-4 transition-transform duration-200 group-hover:scale-110 ${
                        selectedCategoryId === category.id ? "filter brightness-0 invert" : ""
                      }`}
                    >
                      {category.icon || "🗂️"}
                    </div>
                    <h4 className="font-bold mb-2 text-lg">{category.name}</h4>
                  </button>
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center mt-12 space-x-3">
                <button
                  onClick={() => setCatPage((p) => Math.max(1, p - 1))}
                  disabled={catPage === 1}
                  className={`px-6 py-3 rounded-xl border font-medium transition-all duration-200 ${
                    catPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg"
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
                    catPage === totalCatPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg"
                  }`}
                >
                  Next
                </button>
              </div>
              {selectedCategoryId && (
                <div className="flex justify-center mt-8">
                  <button
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium"
                    onClick={() => {
                      setSelectedCategoryId(null)
                      setSelectedCategoryName(null)
                      setProducts([])
                      setSubcategories([])
                      setSelectedSubcategoryId("all")
                    }}
                  >
                    Clear Selection
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Subcategory Dropdown */}
      {selectedCategoryId && subcategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <label className="block mb-3 text-lg font-bold text-gray-700">Filter by Subcategory:</label>
            <select
              className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors duration-200 font-medium"
              value={selectedSubcategoryId}
              onChange={(e) => setSelectedSubcategoryId(e.target.value)}
            >
              <option value="all">All Subcategories</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Selected Category Products */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {selectedCategoryId && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">
                {selectedCategoryName} Products
              </h3>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-red-600 text-xl font-semibold">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <p className="text-gray-600 text-xl">
                  No products found in this {selectedSubcategoryId !== "all" ? "subcategory" : "category"}
                </p>
                <p className="text-gray-500 mt-2">Try selecting a different category or subcategory</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600 text-lg">
                    Found <span className="font-bold text-gray-800">{products.length}</span> products
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <Link to={`/products/${product.id}`} key={product.id} className="group block">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col border border-gray-100">
                        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          <img
                            src={`http://localhost:3000/uploads/${product.image}`}
                            alt={product.name}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/placeholder.png"
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-amber-600 flex items-center shadow-lg">
                            <span className="mr-1">⭐</span>
                            {product.rating}
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                        </div>
                        <div className="flex-1 flex flex-col p-6">
                          <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-4 flex-1">
                            {product.subcategory ? product.subcategory.name : selectedCategoryName}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md" onClick={() => handleAddToCart(product.id)}>
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ShopHub
              </h4>
              <p className="text-gray-400 text-lg leading-relaxed">
                Your one-stop destination for all your shopping needs. Quality products at affordable prices with
                exceptional service.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-lg">Quick Links</h5>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Shipping Info
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-lg">Categories</h5>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Electronics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Fashion
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Home & Garden
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-lg">
                    Sports
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-lg">Follow Us</h5>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">
                  Instagram
                </a>
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

export default CategoriesPage
