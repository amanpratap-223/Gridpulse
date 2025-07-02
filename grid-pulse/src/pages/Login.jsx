// pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/attendant/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('attendant', JSON.stringify(res.data.attendant));
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D] text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1A1A1A] w-full max-w-md sm:max-w-lg md:max-w-xl p-10 rounded-2xl shadow-2xl border border-[#333]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back to GridPulse</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-400">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#111] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm text-gray-400">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#111] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#007BFF] hover:bg-[#005FCC] text-white font-semibold rounded-lg transition duration-200"
        >
          Login
        </button>

        <p className="text-center text-sm mt-6 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 underline hover:text-blue-300">
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
}
