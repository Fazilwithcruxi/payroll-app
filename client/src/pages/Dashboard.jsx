import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const { logout, user } = useAuth();
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
        <div>
            <div className="header">
                <h2>Welcome, {user?.username} (HR)</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn" onClick={() => navigate('/add-employee')}>Add Employee</button>
                    <button className="btn" onClick={() => navigate('/payslip')}>Generate Payslip</button>
                    <button className="btn btn-secondary" onClick={logout}>Logout</button>
                </div>
            </div>

            <div className="container">
                <h3>Employee List</h3>
                <div className="card" style={{ padding: '0' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Designation</th>
                                <th>DOJ</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td>{emp.employee_id}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.designation}</td>
                                    <td>{new Date(emp.doj).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="btn"
                                            style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                                            onClick={() => navigate('/payslip', { state: { employee: emp } })}
                                        >
                                            Payslip
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No employees found. Add one!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
