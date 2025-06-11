import React, { useState } from 'react';
import '../styles/RegisterPage.css'; // Import the CSS file
// import logo from '../assets/logo.png'; 
// import sideImage from '../assets/side-image.jpg'; 
import axios from 'axios';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const { name, email, password } = form;
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      setMessage(res.data.msg || 'Registered successfully');
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="register-container">
      <div className="left-side">
        <img src="/dashboard.png" alt="side" className="side-image" />
      </div>
      <div className="right-side">
        <div className="form-wrapper">
          <img src="/logo.jpg" alt="Logo" className="logo" />
          <h2>HR Registration</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit">Register</button>
          </form>
          {error && <p className="error">{error}</p>}
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
