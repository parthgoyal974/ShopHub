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

  // Subcategory-related state
  const [subcategories, setSubcategories] = useState([])
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("all")

  // Pagination state for categories
  const [catPage, setCatPage] = useState(1)
  const totalCatPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE)
  const paginatedCategories = categories.slice(
    (catPage - 1) * CATEGORIES_PER_PAGE,
    catPage * CATEGORIES_PER_PAGE
  )

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
      const match = categories.find(
        cat => cat.name.toLowerCase() === initialCategory.toLowerCase()
      )
      if (match) {
        setSelectedCategoryId(match.id)
        setSelectedCategoryName(match.name)
        // Jump to the page containing this category
        const idx = categories.findIndex(cat => cat.id === match.id)
        setCatPage(Math.floor(idx / CATEGORIES_PER_PAGE) + 1)
      }
    }
    // eslint-disable-next-line
  }, [initialCategory, categories])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
                ShopHub
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors">Products</Link>
              <span className="text-blue-600 font-semibold">Categories</span>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-3">Browse by Category</h2>
          <p className="text-blue-100 text-lg">
            Explore all our products, neatly organized by category.
          </p>
        </div>
      </section>

      {/* Shop by Category with Pagination */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Click a category to see its products
            </p>
          </div>
          {loading ? (
            <div className="text-center text-gray-500 py-12 text-xl">Loading categories...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-12 text-xl">{error}</div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-500 py-12 text-xl">No categories found.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {paginatedCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`text-center p-6 rounded-lg transition-shadow cursor-pointer border-2 w-full h-full ${
                      selectedCategoryId === category.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                        : "bg-gray-50 text-gray-900 border-transparent hover:shadow-md"
                    }`}
                    onClick={() => {
                      setSelectedCategoryId(category.id)
                      setSelectedCategoryName(category.name)
                    }}
                  >
                    <div className="text-4xl mb-3">{
                      category.icon || "🗂️"
                    }</div>
                    <h4 className="font-semibold mb-1">{category.name}</h4>
                   
                  </button>
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
              {selectedCategoryId && (
                <div className="flex justify-center mt-8">
                  <button
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-700">
            Filter by Subcategory:
          </label>
          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedSubcategoryId}
            onChange={(e) => setSelectedSubcategoryId(e.target.value)}
          >
            <option value="all">All</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected Category Products */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {selectedCategoryId && (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-3 mt-10">
              {selectedCategoryName} Products
            </h3>
            {loading ? (
              <div className="text-center text-gray-500 py-24 text-xl">Loading products...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-24 text-xl">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-500 py-24 text-xl">
                No products found in this {selectedSubcategoryId !== "all" ? "subcategory" : "category"}.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <Link to={`/products/${product.id}`} key={product.id} className="block">
  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
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
                      <p className="text-sm text-gray-500 mb-4 truncate">
                        {product.subcategory ? product.subcategory.name : selectedCategoryName}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">
                          ${product.price}
                        </span>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div></div></Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-8">
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

export default CategoriesPage
