"use client"

import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  // Fetch user info
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/auth/home", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUsername(response.data.user.username);
      } else {
        setUsername("");
      }
    } catch (err) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // In a real app, this would connect to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
              <span className="text-blue-600 font-bold">Contact</span>
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

      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-5xl font-bold mb-4">Contact Us</h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            Have questions? We're here to help! Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h3>
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <span className="mr-2 text-xl">✅</span>
                <div>
                  <p className="font-semibold">Message Sent Successfully!</p>
                  <p className="text-sm">We'll get back to you as soon as possible.</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <span className="mr-2 text-xl">⚠️</span>
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="How can we help?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
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
                    Sending Message...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl p-8 border border-blue-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <p className="text-gray-700 mb-8 text-lg">
                We'd love to hear from you! Reach out to us using any of the following methods.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl mr-4">
                    📍
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Our Location</h4>
                    <p className="text-gray-600">
                      123 Commerce Street<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 text-xl mr-4">
                    📞
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Phone Number</h4>
                    <p className="text-gray-600">
                      +1 (555) 123-4567<br />
                      Mon-Fri, 9am-6pm PST
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl mr-4">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Email Address</h4>
                    <p className="text-gray-600">
                      support@shophub.com<br />
                      info@shophub.com
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 text-lg mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    <span className="text-xl">📱</span>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors">
                    <span className="text-xl">💬</span>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-100 hover:text-pink-600 transition-colors">
                    <span className="text-xl">📸</span>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    <span className="text-xl">🐦</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-xl overflow-hidden border border-gray-200 aspect-video">
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">🗺️</div>
                  <p className="font-semibold">Store Location Map</p>
                  <p className="text-sm mt-1">Interactive map would appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Find answers to common questions about our services and policies
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="font-bold text-xl text-gray-900 mb-3">What is your return policy?</h4>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee on all products. If you're not satisfied with your purchase, 
                you can return it for a full refund. Items must be in original condition with all tags attached.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="font-bold text-xl text-gray-900 mb-3">How long does shipping take?</h4>
              <p className="text-gray-600">
                Standard shipping takes 3-5 business days. Express shipping is available for an additional fee 
                with delivery in 1-2 business days. International shipping typically takes 7-14 business days.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="font-bold text-xl text-gray-900 mb-3">Do you ship internationally?</h4>
              <p className="text-gray-600">
                Yes, we ship to over 100 countries worldwide. International shipping costs and delivery times 
                vary by destination. Additional customs fees may apply depending on your country's regulations.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="font-bold text-xl text-gray-900 mb-3">How can I track my order?</h4>
              <p className="text-gray-600">
                Once your order ships, you'll receive a confirmation email with a tracking number. 
                You can track your order using our website's tracking tool or directly through the carrier's website.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200">
              View All FAQs
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ShopHub
              </h4>
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
  );
};

export default Contact;