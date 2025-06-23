import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user info
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/auth/home", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) setUsername(response.data.user.username);
      else setUsername("");
    } catch {
      setUsername("");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername("");
    navigate("/");
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get("http://localhost:3000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      setError("Failed to fetch orders.");
      setOrders([]);
    }
    setLoading(false);
  };

  // Place order after successful Stripe payment
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("success") === "true") {
      const placeOrder = async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            "http://localhost:3000/api/orders/place",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setOrderPlaced(true);
        } catch (err) {
          setError("Failed to place order after payment.");
        }
        // Always fetch orders to update UI
        await fetchOrders();
        // Remove the query param from the URL
        navigate("/orders", { replace: true });
      };
      placeOrder();
    } else {
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [location.search]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-xl">Loading your orders...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Orders</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );

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
              <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Orders
              </Link>
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
                  <Link to="/cart" className="p-2 text-blue-600 text-xl font-bold hover:text-blue-800 transition-colors">
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
                  <Link to="/cart" className="p-2 text-blue-600 text-xl font-bold hover:text-blue-800 transition-colors">
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

      {/* Success alert */}
      {orderPlaced && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <div className="flex items-center bg-green-50 border border-green-200 rounded-lg shadow-lg px-6 py-4">
            <span className="text-2xl mr-3">✅</span>
            <div className="flex-1">
              <div className="text-green-800 font-semibold text-lg">Order Placed Successfully</div>
              <div className="text-green-700 text-sm">Thank you for your purchase!</div>
            </div>
            <button
              onClick={() => setOrderPlaced(false)}
              className="ml-4 text-green-700 hover:text-green-900 font-bold text-xl focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link
              to="/products"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-800">Order #{order.id}</div>
                    <div className="text-gray-500 text-sm">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-blue-700">
                      ${order.total?.toFixed(2)}
                    </div>
                    <div className="text-sm text-green-600 font-semibold capitalize">
                      {order.status || "Completed"}
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {(order.orderItems || []).map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 flex items-center space-x-3">
                            {item.product?.image ? (
                              <img
                                src={`http://localhost:3000/uploads/${item.product.image}`}
                                alt={item.product?.name || "Product"}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <span className="text-2xl">📦</span>
                            )}
                            <span className="font-medium text-gray-800">{item.product?.name || "Product"}</span>
                          </td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3">${item.price?.toFixed(2)}</td>
                          <td className="px-4 py-3 font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
