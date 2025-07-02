"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotStep, setForgotStep] = useState(1) // 1 = email input, 2 = OTP and new password
  const [forgotOTP, setForgotOTP] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [forgotError, setForgotError] = useState("")
  const [forgotSuccess, setForgotSuccess] = useState("")
  const [isForgotLoading, setIsForgotLoading] = useState(false)

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSumbit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", values)
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token)
        navigate("/")
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Incorrect password")
      }
      if (err.response && err.response.status === 404) {
        setError("No Account with this email exists")
      }
      console.log(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setIsForgotLoading(true)
    setForgotError("")
    setForgotSuccess("")
    
    try {
      const response = await axios.post("http://localhost:3000/api/auth/forgot-password", { email: forgotEmail })
      if (response.status === 200) {
        setForgotSuccess("OTP has been sent to your email.")
        setForgotStep(2)
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setForgotError("No account found with this email")
      } else {
        setForgotError("Failed to send OTP. Please try again.")
      }
    } finally {
      setIsForgotLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setIsForgotLoading(true)
    setForgotError("")
    
    try {
      const response = await axios.post("http://localhost:3000/api/auth/reset-password", {
        email: forgotEmail,
        otp: forgotOTP,
        newPassword: newPassword
      })
      
      if (response.status === 200) {
        setForgotSuccess("Password has been reset successfully! You can now login.")
        setTimeout(() => {
          setShowForgotPassword(false)
          setForgotStep(1)
          setForgotEmail("")
          setForgotOTP("")
          setNewPassword("")
          setForgotSuccess("")
        }, 3000)
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setForgotError("Invalid OTP")
      } else if (err.response && err.response.status === 410) {
        setForgotError("OTP has expired. Please request a new one.")
      } else {
        setForgotError("Failed to reset password. Please try again.")
      }
    } finally {
      setIsForgotLoading(false)
    }
  }

  const closeForgotPassword = () => {
    setShowForgotPassword(false)
    setForgotStep(1)
    setForgotEmail("")
    setForgotOTP("")
    setNewPassword("")
    setForgotError("")
    setForgotSuccess("")
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">🔐</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSumbit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              name="email"
              onChange={handleChanges}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              name="password"
              onChange={handleChanges}
              required
            />
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
            <button
              onClick={closeForgotPassword}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h3>
            
            {forgotSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                <span className="mr-2">✅</span>
                {forgotSuccess}
              </div>
            )}
            
            {forgotError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {forgotError}
              </div>
            )}
            
            {forgotStep === 1 ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label htmlFor="forgotEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter your email
                  </label>
                  <input
                    type="email"
                    placeholder="Your registered email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isForgotLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit OTP from email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    value={forgotOTP}
                    onChange={(e) => setForgotOTP(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isForgotLoading ? "Resetting password..." : "Reset Password"}
                </button>
                
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Back to email entry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Login