import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import PayslipTemplate from '../components/PayslipTemplate';

const PayslipView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(location.state?.employee?.id || '');
    const [month, setMonth] = useState('December');
    const [year, setYear] = useState('2025');
    const [payslipData, setPayslipData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEmps = async () => {
            const res = await api.get('/employees');
            setEmployees(res.data);
        };
        fetchEmps();
    }, []);

    const handleGenerate = async () => {
        if (!selectedEmployeeId) return alert("Select an employee");
        setLoading(true);
        try {
            // In a real app we might calculate days based on attendance. 
            // Here we hardcode 31 days as per image or allow user input.
            // For MVP, we pass default full days.
            const payload = {
                employee_id_db: selectedEmployeeId,
                month,
                year,
                net_paid_days: 31,
                lop_days: 0
            };

            const res = await api.post('/payslips/generate', payload);

            // Fetch employee details again to merge with payslip data for the template
            const emp = employees.find(e => e.id == selectedEmployeeId);

            setPayslipData({ ...res.data, employee: emp });
        } catch (err) {
            console.error(err);
            alert("Error generating payslip");
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="header">
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                <h2>Payslip Gen</h2>
            </div>

            <div className="card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <select value={selectedEmployeeId} onChange={e => setSelectedEmployeeId(e.target.value)} style={{ minWidth: '200px' }}>
                        <option value="">Select Employee</option>
                        {employees.map(e => (
                            <option key={e.id} value={e.id}>{e.name} ({e.employee_id})</option>
                        ))}
                    </select>

                    <select value={month} onChange={e => setMonth(e.target.value)}>
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <input type="number" value={year} onChange={e => setYear(e.target.value)} style={{ width: '100px' }} />

                    <button className="btn" onClick={handleGenerate} disabled={loading}>
                        {loading ? 'Generating...' : 'Generate / View'}
                    </button>
                </div>
            </div>

            {payslipData && (
                <div style={{}}>
                    <PayslipTemplate data={payslipData} />
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button className="btn" onClick={() => window.print()}>Print / Save as PDF</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayslipView;
