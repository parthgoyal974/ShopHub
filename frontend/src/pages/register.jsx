import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const navigate = useNavigate();

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (name === 'password') {
      setPasswordTouched(true);
    }
  };

  const getPasswordValidation = (password) => ({
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    specialChar: /[\W_]/.test(password),
  });

  const validations = getPasswordValidation(values.password);
  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleSumbit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(values.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet the required conditions');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/register', values);
      console.log(response)
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token)
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('Account Already Exists');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="shadow-lg px-8 py-5 border bg-white w-80 rounded">
        <h2 className="text-lg font-bold mb-4 text-center">Register</h2>

        {error && (
          <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSumbit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              className="w-full px-3 py-2 border rounded"
              name="username"
              onChange={handleChanges}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-3 py-2 border rounded"
              name="email"
              onChange={handleChanges}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className={`w-full px-3 py-2 border rounded ${
                passwordTouched && !isPasswordValid ? 'border-red-500' : ''
              }`}
              name="password"
              onChange={handleChanges}
              onBlur={() => setPasswordTouched(true)}
              required
            />
            {passwordTouched && (
              <div className="mt-2 text-xs space-y-1">
                {Object.entries(validations).map(([key, valid]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-1 ${
                      valid ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: valid ? '#16a34a' : '#ef4444' }}></span>
                    {{
                      length: 'At least 8 characters',
                      lowercase: 'At least one lowercase letter',
                      uppercase: 'At least one uppercase letter',
                      digit: 'At least one number',
                      specialChar: 'At least one special character',
                    }[key]}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 active:scale-95 transition transform duration-100">
            Submit
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
