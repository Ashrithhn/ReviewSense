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

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

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
    <div className="app-container" style={{ justifyContent: 'center' }}>
      <header className="header" style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <h1>ReviewSense</h1>
        <p>Log in to access your AI reports</p>
      </header>

      <main className="main-content" style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="custom-input"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="custom-input"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="auth-button"
            >
              {loading ? <span className="spinner"></span> : 'Log In Securely'}
            </button>
            
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', margin: '10px 0' }}>
              — OR —
            </div>
            
            <button 
              onClick={handleSignUp} 
              disabled={loading}
              className="auth-button secondary"
            >
              Create Free Account
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
