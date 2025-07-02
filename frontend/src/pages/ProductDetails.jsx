"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"

// import { CartContext } from "../context/CartContext"; // Uncomment if using context

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  // const { addToCart } = useContext(CartContext); // Uncomment if using context

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [loading, setLoading] = useState(true)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [similarProducts, setSimilarProducts] = useState([])
  const [similarLoading, setSimilarLoading] = useState(true)
  const [similarError, setSimilarError] = useState("")

  const [username, setUsername] = useState("")
  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/cart/add",
        { productId: product.id, quantity: 1 },
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

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`http://localhost:3000/api/products/${id}`)
        setProduct(res.data)
        console.log("[DEBUG] Product loaded:", res.data)
      } catch (err) {
        setProduct(null)
        console.error("[DEBUG] Error loading product:", err)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/reviews/product/${id}`)
        setReviews(res.data)
        console.log("[DEBUG] Reviews loaded:", res.data)
      } catch (err) {
        setReviews([])
        console.error("[DEBUG] Error loading reviews:", err)
      }
    }
    fetchReviews()
  }, [id])

  // Fetch similar products
  useEffect(() => {
    if (!id) return
    setSimilarLoading(true)
    setSimilarError("")
    const fetchSimilar = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/products/${id}/similar`)
        setSimilarProducts(res.data)
        console.log("[DEBUG] Similar products loaded:", res.data)
      } catch (err) {
        setSimilarProducts([])
        setSimilarError("Could not load similar products.")
        console.error("[DEBUG] Error loading similar products:", err)
      }
      setSimilarLoading(false)
    }
    fetchSimilar()
  }, [id])

  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setReviewSubmitting(true)
    try {
      await axios.post(`http://localhost:3000/api/reviews/product/${id}`, newReview, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setNewReview({ rating: 5, comment: "" })
      // Refresh reviews and product
      const resReview = await axios.get(`http://localhost:3000/api/reviews/product/${id}`)
      setReviews(resReview.data)
      const resProduct = await axios.get(`http://localhost:3000/api/products/${id}`)
      setProduct(resProduct.data)
    } catch (err) {
      navigate("/login")
    }
    setReviewSubmitting(false)
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-xl">Loading product details...</p>
        </div>
      </div>
    )
  if (!product)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/products"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
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
              <Link to="/categories" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Categories
              </Link>
<Link to="/orders" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Orders</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</Link>
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

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link to="/products" className="hover:text-blue-600 transition-colors">
            Products
          </Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Product Details */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-12 relative overflow-hidden">
            <img
              src={`http://localhost:3000/uploads/${product.image}`}
              alt={product.name}
              className="object-contain rounded-2xl w-full h-96 shadow-lg transform hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder.png"
              }}
            />
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-lg font-bold text-amber-600 flex items-center shadow-lg">
              <span className="mr-2">⭐</span>
              {product.rating}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-12 flex flex-col justify-center">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                {product.category?.name}
                {product.subcategory ? ` / ${product.subcategory.name}` : ""}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center mb-6">
              <div className="flex items-center mr-6">
                <span className="text-yellow-500 text-2xl mr-2">⭐</span>
                <span className="font-bold text-xl text-gray-800">{product.rating}</span>
                <span className="text-gray-500 ml-2">({reviews.length} reviews)</span>
              </div>
            </div>

            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              {product.description ||
                "Experience premium quality with this amazing product. Crafted with attention to detail and designed to exceed your expectations."}
            </p>

            <div className="flex items-center justify-between mb-8">
              <div className="text-4xl font-bold text-blue-600">${product.price}</div>
              <div className="flex space-x-4">
                <button
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                  // onClick={() => addToCart(product)} // Uncomment if using context
                  onClick={handleAddToCart}
                >
                  <span className="mr-2">🛒</span>
                  Add to Cart
                </button>
                <button className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                  <span className="mr-2">❤️</span>
                  Wishlist
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-green-600 font-semibold">In Stock</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                <span className="text-gray-600">30-Day Returns</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto mt-12 bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Customer Reviews</h3>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-gray-600 text-lg">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {(review.user?.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.user?.username || "Anonymous User"}</h4>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="font-semibold text-gray-700">{review.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Leave a Review */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h4 className="text-2xl font-bold text-gray-900 mb-6">Leave a Review</h4>
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
                rows={4}
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={reviewSubmitting}
            >
              {reviewSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="max-w-6xl mx-auto mt-12 bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Similar Products</h3>
        {similarLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading similar products...</p>
          </div>
        ) : similarError ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 text-lg font-semibold">{similarError}</p>
          </div>
        ) : similarProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-600 text-lg">No similar products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((sp) => (
              <Link to={`/products/${sp.id}`} key={sp.id} className="group block">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center transition-all duration-300 transform hover:scale-105 border border-gray-200">
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img
                      src={`http://localhost:3000/uploads/${sp.image}`}
                      alt={sp.name}
                      className="object-cover rounded-xl w-full h-40 transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.png"
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold text-amber-600 flex items-center shadow">
                      <span className="mr-1">⭐</span>
                      {sp.rating}
                    </div>
                  </div>
                  <h4 className="font-bold text-lg text-center text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {sp.name}
                  </h4>
                  <div className="text-2xl font-bold text-blue-600 mb-2">${sp.price}</div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Back Link */}
      <div className="max-w-6xl mx-auto mt-12 text-center">
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
        >
          <span className="mr-2">←</span>
          Back to Products
        </Link>
      </div>
    </div>
  )
}

export default ProductDetails
