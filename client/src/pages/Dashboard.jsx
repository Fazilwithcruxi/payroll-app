import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="main-content">
                <header className="dashboard-header animate-fade-in">
                    <div>
                        <h1>Dashboard</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Overview of your workforce and payroll status.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn" onClick={() => navigate('/add-employee')}>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Employee
                        </button>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="stats-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <h3>Total Employees</h3>
                            <p>{employees.length}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <h3>Active Status</h3>
                            <p style={{ fontSize: '1.2rem' }}>System Online</p>
                        </div>
                    </div>

                    <div
                        className="stat-card"
                        style={{ cursor: 'pointer', border: '1px solid var(--primary)' }}
                        onClick={() => {
                            const lastPath = localStorage.getItem('lastPath');
                            if (lastPath && lastPath !== '/dashboard') {
                                navigate(lastPath);
                            } else {
                                alert("No previous task found.");
                            }
                        }}
                    >
                        <div className="stat-icon orange">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <h3>Resume Work</h3>
                            <p style={{ fontSize: '1rem', color: 'var(--primary)' }}>Go to last task &rarr;</p>
                        </div>
                    </div>
                </div>

                {/* Employee Table */}
                <div className="table-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Designation</th>
                                <th>Joined Date</th>
                                <th>Employee ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.8rem', fontWeight: '600', color: '#64748b'
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
                                        <button
                                            className="btn"
                                            style={{
                                                fontSize: '0.8rem',
                                                padding: '6px 12px',
                                                background: 'transparent',
                                                color: 'var(--primary)',
                                                border: '1px solid var(--border)',
                                                boxShadow: 'none'
                                            }}
                                            onClick={() => navigate('/payslip', { state: { employee: emp } })}
                                        >
                                            Generate Payslip
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                        No employees found. Click "Add Employee" to get started.
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
