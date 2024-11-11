// components/LoginForm.js
"use client";
import { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        { email },
        { withCredentials: true } // Add this to save the session cookie
      );
      onLoginSuccess(response.data.patient);
    } catch (error) {
      setError('Login failed. Please check your email.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />
      <button onClick={handleLogin} className="login-button">Login</button>
      {error && <p className="error-message">{error}</p>}
      <style jsx>{`
        .login-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px;
          background-color: #e0f7f9;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        h2 {
          color: #1d5c63;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .login-input {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #cfd8dc;
          border-radius: 5px;
          margin-bottom: 15px;
          box-sizing: border-box;
        }

        .login-button {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          color: #ffffff;
          background-color: #4db6ac;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .login-button:hover {
          background-color: #00897b;
        }

        .error-message {
          color: #e57373;
          font-size: 14px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
