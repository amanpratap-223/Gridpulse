// pages/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    substation: ''
  });
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/attendant/signup', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('attendant', JSON.stringify(res.data.attendant));
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#211F1E] text-[#F5FBFE] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#2A2A2A] w-full max-w-sm p-6 rounded-2xl shadow-lg space-y-4 border border-[#383838]"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Create an Account</h2>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-[#1F1F1F] border border-[#444] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-[#1F1F1F] border border-[#444] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-[#1F1F1F] border border-[#444] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
        />
        <input
          name="substation"
          placeholder="Assigned Substation"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-[#1F1F1F] border border-[#444] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
        />

        <button
          type="submit"
          className="w-full py-2 bg-[#00A86B] hover:bg-[#00905f] text-white rounded-lg font-semibold transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-[#C3C3C3] mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#00A86B] underline">Login here</Link>
        </p>
      </form>
    </div>
  );
}
