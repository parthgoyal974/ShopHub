"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch products based on search term
  useEffect(() => {
    let cancelToken
    const fetchProducts = async () => {
      setLoading(true)
      setError("")
      try {
        let url = "http://localhost:3000/api/products"
        if (searchTerm.trim() !== "") {
          url = `http://localhost:3000/api/products/search?query=${encodeURIComponent(searchTerm)}`
        }
        cancelToken = axios.CancelToken.source()

        const res = await axios.get(url, { cancelToken: cancelToken.token })

        setProducts(res.data)
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Failed to fetch products.")
          setProducts([])
        }
      }
      setLoading(false)
    }

    // Debounce: wait 300ms after user stops typing
    const timeout = setTimeout(fetchProducts, 300)
    return () => {
      clearTimeout(timeout)
      if (cancelToken) cancelToken.cancel()
    }
  }, [searchTerm])

  // Debug: Log products array on each render
  useEffect(() => {}, [products])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Products</h1>
            <p className="text-gray-600 text-lg">Discover amazing products at unbeatable prices</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                }}
              />
            </div>
            {searchTerm && (
              <p className="mt-3 text-sm text-gray-600 text-center">
                {loading ? "Searching..." : `Showing results for "${searchTerm}"`}
              </p>
            )}
          </div>
        </div>

        {/* Results Section */}
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
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-600 text-xl">No products found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found <span className="font-semibold text-gray-800">{products.length}</span> products
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link to={`/products/${product.id}`} key={product.id} className="group block">
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col h-full">
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
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-amber-600 flex items-center shadow-lg">
                        <span className="mr-1">⭐</span>
                        {product.rating}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                    <div className="flex-1 flex flex-col p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 flex-1">
                        {product.subcategory
                          ? product.subcategory.name
                          : product.category
                            ? product.category.name
                            : "Uncategorized"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md">
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
      </div>
    </div>
  )
}

export default ProductsPage
