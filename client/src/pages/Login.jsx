import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData.username, formData.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary)', fontSize: '2.5rem' }}>Payroll App Login</h1>
            <form onSubmit={handleSubmit} className="auth-card">
                {error && <div style={{ color: '#ef4444', background: '#fee2e2', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fecaca' }}>{error}</div>}
                <div className="form-group">
                    <label>Username</label>
                    <input
                        className="form-input"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter your username"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        className="form-input"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }}>Login</button>
                <p style={{ textAlign: 'center', color: 'var(--text)', marginTop: '1rem' }}>
                    Don't have an account? <a href="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Register</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
