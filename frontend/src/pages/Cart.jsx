"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

const Cart = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")

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

  // Fetch cart items from backend
  const fetchCart = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }
      const res = await axios.get("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCartItems(res.data)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/login")
      } else {
        setError("Failed to load cart.")
      }
      setCartItems([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCart()
    // eslint-disable-next-line
  }, [])

  // Remove item from cart
  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchCart()
    } catch (err) {
      setError("Failed to remove item.")
    }
  }

  // Increase quantity
  const handleIncrease = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        "http://localhost:3000/api/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      fetchCart()
    } catch (err) {
      setError("Failed to update quantity.")
    }
  }

  // Decrease quantity
  const handleDecrease = async (productId, currentQty) => {
    if (currentQty <= 1) {
      handleRemove(productId)
      return
    }
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        "http://localhost:3000/api/cart/add",
        { productId, quantity: -1 },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      fetchCart()
    } catch (err) {
      setError("Failed to update quantity.")
    }
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-xl">Loading your cart...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Cart</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={fetchCart}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )

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
              <Link to="/categories" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Categories
              </Link>
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
                  <span className="p-2 text-blue-600 text-xl font-bold">🛒</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span className="p-2 text-blue-600 text-xl font-bold">🛒</span>
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

      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
            <p className="text-gray-600 text-lg">Review your items and proceed to checkout</p>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Start Shopping
              </Link>
              <Link
                to="/"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Cart Items ({cartItems.length})</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                          {item.product?.image ? (
                            <img
                              src={`http://localhost:3000/uploads/${item.product.image}`}
                              alt={item.product?.name || "Product"}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>


                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.productId}`}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 block truncate"
                          >
                            {item.product?.name || "Product"}
                          </Link>
                          <p className="text-gray-500 text-sm mt-1">
                            Price: <span className="font-semibold">${item.product?.price?.toFixed(2) || "--"}</span>
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleDecrease(item.productId, item.quantity)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition-colors duration-200"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrease(item.productId)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition-colors duration-200"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({cartItems.length})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${(subtotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>${(subtotal * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => alert("Checkout functionality coming soon!")}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to empty your cart?")) {
                        cartItems.forEach((item) => handleRemove(item.productId))
                      }
                    }}
                    className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    Empty Cart
                  </button>
                </div>

                {/* Security Features */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span>Free Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Shopping */}
        {cartItems.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              <span className="mr-2">←</span>
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
