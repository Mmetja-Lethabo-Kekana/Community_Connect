import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Please enter your name (at least 2 characters)');
      return;
    }
    setError('');
    onLogin(name.trim());
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🏛️</div>
        <h1>Community Connect</h1>
        <p className="subtitle">Welcome to your community hub</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>What's your name?</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            {error && <div className="login-error">{error}</div>}
          </div>
          
          <button type="submit" className="submit-btn login-btn">
            Enter Community Connect
          </button>
        </form>

        <div className="login-footer">
          <p>📍 Your location will be used to show nearby issues</p>
        </div>
      </div>
    </div>
  );
}