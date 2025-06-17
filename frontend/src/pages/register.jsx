"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const Register = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [otpSuccess, setOtpSuccess] = useState("")
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChanges = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    if (name === "password") {
      setPasswordTouched(true)
    }
  }

  const getPasswordValidation = (password) => ({
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    specialChar: /[\W_]/.test(password),
  })

  const validations = getPasswordValidation(values.password)
  const isPasswordValid = Object.values(validations).every(Boolean)

  const handleSumbit = async (e) => {
    e.preventDefault()

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(values.email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!isPasswordValid) {
      setError("Password does not meet the required conditions")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")
    setOtpError("")
    setOtpSuccess("")
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", values)
      if (response.status === 200) {
        setSuccess("Account created! Please check your email for an OTP to verify your account.")
        setOtpSent(true)
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Account Already Exists")
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value)
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setOtpLoading(true)
    setOtpError("")
    setOtpSuccess("")
    try {
      const response = await axios.post("http://localhost:3000/api/auth/verify-otp", {
        email: values.email,
        otp: otp,
      })
      if (response.status === 200) {
        setOtpSuccess("Email verified successfully! You can now log in.")
        // Optionally, store token or redirect to login
        setTimeout(() => {
          navigate("/login")
        }, 1500)
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setOtpError("Invalid OTP. Please try again.")
      } else if (err.response && err.response.status === 410) {
        setOtpError("OTP expired. Please request a new one.")
      } else if (err.response && err.response.status === 404) {
        setOtpError("OTP not found. Please check your email and try again.")
      } else {
        setOtpError("Something went wrong. Please try again.")
      }
    } finally {
      setOtpLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">👤</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600">Join us today and start shopping</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
            <span className="mr-2">✅</span>
            {success}
          </div>
        )}

        {!otpSent && (
          <form onSubmit={handleSumbit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                name="username"
                onChange={handleChanges}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
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
                placeholder="Create a strong password"
                className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 bg-gray-50 focus:bg-white ${
                  passwordTouched && !isPasswordValid
                    ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                }`}
                name="password"
                onChange={handleChanges}
                onBlur={() => setPasswordTouched(true)}
                required
              />
              {passwordTouched && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                  <div className="space-y-1">
                    {Object.entries(validations).map(([key, valid]) => (
                      <div
                        key={key}
                        className={`flex items-center gap-2 text-xs ${valid ? "text-green-600" : "text-red-500"}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${valid ? "bg-green-500" : "bg-red-400"}`}></div>
                        {
                          {
                            length: "At least 8 characters",
                            lowercase: "One lowercase letter",
                            uppercase: "One uppercase letter",
                            digit: "One number",
                            specialChar: "One special character",
                          }[key]
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}

        {otpSent && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                Enter OTP sent to your email
              </label>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                required
                maxLength={6}
              />
            </div>
            {otpError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-2 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {otpError}
              </div>
            )}
            {otpSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-2 text-sm flex items-center">
                <span className="mr-2">✅</span>
                {otpSuccess}
              </div>
            )}
            <button
              type="submit"
              disabled={otpLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otpLoading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </form>
        )}

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors duration-200"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
