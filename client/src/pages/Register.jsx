import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(formData.username, formData.email, formData.password);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary)', fontSize: '2.5rem' }}>HR Registration</h1>
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
                        placeholder="Choose a username"
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        className="form-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
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
                        placeholder="Create a password"
                    />
                </div>
                <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }}>Register</button>
                <p style={{ textAlign: 'center', color: 'var(--text)', marginTop: '1rem' }}>
                    Already have an account? <a href="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Login</a>
                </p>
            </form>
        </div>
    );
};

export default Register;
