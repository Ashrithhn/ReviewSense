import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Reuse our styles

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // If sign up is successful and email confirmation is off, it logs them in
      alert("Account created! You can now log in.");
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Redirect to dashboard
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>ReviewSense</h1>
        <p>Log in to access your AI reports</p>
      </header>

      <main className="main-content" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="reviews-textarea"
              style={{ padding: '10px' }}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="reviews-textarea"
              style={{ padding: '10px' }}
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="analyze-button" 
              style={{ flex: 1, marginTop: 0 }}
            >
              {loading ? 'Wait...' : 'Log In'}
            </button>
            <button 
              onClick={handleSignUp} 
              disabled={loading}
              className="analyze-button" 
              style={{ flex: 1, marginTop: 0, backgroundColor: '#2ecc71' }}
            >
              Sign Up
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
