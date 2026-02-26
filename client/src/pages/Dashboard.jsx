import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    Users, Activity, ShieldCheck, Plus,
    ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Payroll Integrity
    const calculateIntegrity = () => {
        if (employees.length === 0) return 0;
        const readyEmployees = employees.filter(emp =>
            emp.bank_account_no &&
            emp.ifsc_code &&
            emp.pan &&
            emp.pan.length >= 10 &&
            emp.ifsc_code.length >= 11
        ).length;
        return Math.round((readyEmployees / employees.length) * 100);
    };

    const integrityScore = calculateIntegrity();
    const readyCount = employees.filter(emp =>
        emp.bank_account_no && emp.ifsc_code && emp.pan
    ).length;

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="main-content">
                <header className="dashboard-header animate-fade-in">
                    <div>
                        <h1>Dashboard</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Overview of your workforce and payroll readiness.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn" onClick={() => navigate('/add-employee')}>
                            <Plus size={20} style={{ marginRight: '8px' }} />
                            Add Employee
                        </button>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="stats-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <Users size={24} />
                        </div>
                        <div className="stat-details">
                            <h3>Total Employees</h3>
                            <p>{employees.length}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            <Activity size={24} />
                        </div>
                        <div className="stat-details">
                            <h3>Server Status</h3>
                            <p style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CheckCircle2 size={16} /> Online
                            </p>
                        </div>
                    </div>

                    <div
                        className="stat-card"
                        style={{
                            border: integrityScore < 100 ? '1px solid var(--warning)' : '1px solid var(--primary)',
                            background: integrityScore < 100 ? 'rgba(245, 158, 11, 0.05)' : 'var(--surface)'
                        }}
                    >
                        <div className={`stat-icon ${integrityScore < 100 ? 'orange' : 'green'}`}>
                            <ShieldCheck size={24} />
                        </div>
                        <div className="stat-details">
                            <h3>Payroll Integrity</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <p style={{ color: integrityScore < 100 ? 'var(--warning)' : 'var(--primary)' }}>
                                    {integrityScore}%
                                </p>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    ({readyCount}/{employees.length} Ready)
                                </span>
                            </div>
                        </div>
                        {integrityScore < 100 && (
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                <AlertCircle size={16} style={{ color: 'var(--warning)' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Employee Table */}
                <div className="table-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Employee Directory</h2>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{employees.length} staff members total</span>
                    </div>
                    <table style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Designation</th>
                                <th>Joined Date</th>
                                <th>Employee ID</th>
                                <th>Payroll Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => {
                                const isReady = emp.bank_account_no && emp.ifsc_code && emp.pan;
                                return (
                                    <tr key={emp.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '50%',
                                                    background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)',
                                                    border: '1px solid var(--border)'
                                                }}>
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <span style={{ fontWeight: '500' }}>{emp.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-designation">{emp.designation}</span>
                                        </td>
                                        <td>{new Date(emp.doj).toLocaleDateString()}</td>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{emp.employee_id}</td>
                                        <td>
                                            {isReady ? (
                                                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                                                    <CheckCircle2 size={14} /> Ready
                                                </span>
                                            ) : (
                                                <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                                                    <AlertCircle size={14} /> Incomplete
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn"
                                                style={{
                                                    fontSize: '0.8rem',
                                                    padding: '6px 14px',
                                                    background: 'transparent',
                                                    color: 'var(--primary)',
                                                    border: '1px solid var(--border)',
                                                    boxShadow: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                                onClick={() => navigate('/payslip', { state: { employee: emp } })}
                                            >
                                                Generate <ArrowRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {employees.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <Users size={48} style={{ opacity: 0.1 }} />
                                            <p>No employees found. Click "Add Employee" to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

