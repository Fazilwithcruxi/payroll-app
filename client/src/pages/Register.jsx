import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/file.svg';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await register(formData.username, formData.email, formData.password);
            if (result.success) {
                navigate('/login');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Left Panel - Branding */}
            <div className="auth-left animate-slide-in">
                <div className="brand-content">
                    <img src={logo} alt="Odenkirk Logo" className="brand-logo" />
                    <h1 className="brand-title">Odenkirk</h1>
                    <p className="brand-description">Accounting - Payroll Management App</p>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="auth-right">
                <div className="auth-card animate-fade-in">
                    <div className="auth-header">
                        <h2>Create Account</h2>
                        <p>Set up your HR access to get started</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-message">
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

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

                        <button
                            type="submit"
                            className="btn"
                            style={{ marginTop: '1rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>

                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1.5rem', fontSize: '0.95rem' }}>
                            Already have an account? <Link to="/login" className="text-link">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
