import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/file.svg';
import { Mail, Lock, Smartphone, ArrowRight, RefreshCcw, User, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
    const [otpStep, setOtpStep] = useState(1); // 1: username, 2: otp
    const [formData, setFormData] = useState({ username: '', password: '', otp: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, sendOtp, verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await login(formData.username, formData.password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!formData.username) return setError("Username is required");
        setIsLoading(true);
        try {
            const result = await sendOtp(formData.username);
            if (result.success) {
                setOtpStep(2);
                if (result.otp) {
                    console.log(`[DEV MODE] OTP: ${result.otp}`);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await verifyOtp(formData.username, formData.otp);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left animate-slide-in">
                <div className="brand-content">
                    <h1 className="brand-title">Payroll System</h1>
                    <p className="brand-description">Accounting - Payroll Management App</p>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-card animate-fade-in" style={{ width: '100%', maxWidth: '440px' }}>
                    <div className="auth-header" style={{ marginBottom: '2rem' }}>
                        <h2>{loginMode === 'password' ? 'Welcome back' : 'OTP Login'}</h2>
                        <p>{loginMode === 'password' ? 'Please enter your details to sign in' : 'Secure sign in with one-time password'}</p>
                    </div>

                    <div style={{
                        display: 'flex',
                        background: 'var(--bg)',
                        padding: '4px',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        border: '1px solid var(--border)'
                    }}>
                        <button
                            onClick={() => { setLoginMode('password'); setError(''); }}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: 'none',
                                borderRadius: '8px',
                                background: loginMode === 'password' ? 'var(--surface)' : 'transparent',
                                color: loginMode === 'password' ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: loginMode === 'password' ? '600' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem',
                                boxShadow: loginMode === 'password' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            Password
                        </button>
                        <button
                            onClick={() => { setLoginMode('otp'); setOtpStep(1); setError(''); }}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: 'none',
                                borderRadius: '8px',
                                background: loginMode === 'otp' ? 'var(--surface)' : 'transparent',
                                color: loginMode === 'otp' ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: loginMode === 'otp' ? '600' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem',
                                boxShadow: loginMode === 'otp' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            OTP Login
                        </button>
                    </div>

                    {error && (
                        <div className="error-message" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.9rem' }}>
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {loginMode === 'password' ? (
                        <form onSubmit={handlePasswordLogin}>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={14} /> Username</label>
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
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={14} /> Password</label>
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

                            <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }} disabled={isLoading}>
                                {isLoading ? <RefreshCcw className="animate-spin" size={20} /> : 'Sign in'}
                            </button>
                        </form>
                    ) : (
                        <div className="otp-flow">
                            {otpStep === 1 ? (
                                <form onSubmit={handleSendOtp}>
                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={14} /> Username</label>
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
                                    <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }} disabled={isLoading}>
                                        {isLoading ? <RefreshCcw className="animate-spin" size={20} /> : 'Send OTP'} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp}>
                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={14} /> Enter 6-digit OTP</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            name="otp"
                                            value={formData.otp}
                                            onChange={handleChange}
                                            required
                                            maxLength="6"
                                            placeholder="000000"
                                            style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 'bold' }}
                                        />
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'center' }}>
                                            OTP sent to registered device for <b>{formData.username}</b>
                                        </p>
                                    </div>
                                    <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }} disabled={isLoading}>
                                        {isLoading ? <RefreshCcw className="animate-spin" size={20} /> : 'Verify & Login'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOtpStep(1)}
                                        style={{ width: '100%', background: 'none', border: 'none', color: 'var(--primary)', marginTop: '1rem', cursor: 'pointer', fontSize: '0.9rem' }}
                                    >
                                        Change Username
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem', fontSize: '0.9rem' }}>
                        Don't have an account? <Link to="/register" className="text-link" style={{ fontWeight: '600' }}>Register now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Simple AlertCircle replacement if not available in lucide-react (though it should be)
const AlertCircle = ({ size }) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Login;
