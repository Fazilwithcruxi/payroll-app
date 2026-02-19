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
    const [lopDays, setLopDays] = useState(0);
    const [sickLeave, setSickLeave] = useState(0);
    const [paidLeave, setPaidLeave] = useState(0);
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

        const emp = employees.find(e => e.id == selectedEmployeeId);
        if (!emp) return;

        // Validation: Joining Date
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = months.indexOf(month);
        const selectedDate = new Date(year, monthIndex, 1); // 1st of selected month
        const joiningDate = new Date(emp.doj);

        // Normalize joining date to start of month for comparison if needed, or strict comparison
        // Strict comparison: If selected month/year is before joining month/year
        const selectedMonthYear = new Date(year, monthIndex);
        const joiningMonthYear = new Date(joiningDate.getFullYear(), joiningDate.getMonth());

        if (selectedMonthYear < joiningMonthYear) {
            alert(`Cannot generate payslip. Employee joined in ${joiningDate.toLocaleDateString()}.`);
            return;
        }

        if (sickLeave > 1) {
            alert("Maximum 1 Sick Leave allowed per month.");
            return;
        }

        if (paidLeave > 1) {
            alert("Maximum 1 Paid Leave allowed per month.");
            return;
        }

        setLoading(true);
        try {
            // Calculate days in month
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            const netPaidDays = Math.max(0, daysInMonth - lopDays);

            const payload = {
                employee_id_db: selectedEmployeeId,
                month,
                year,
                net_paid_days: netPaidDays,
                lop_days: lopDays,
                sick_leave: sickLeave,
                paid_leave: paidLeave
            };

            const res = await api.post('/payslips/generate', payload);

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
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <select value={selectedEmployeeId} onChange={e => setSelectedEmployeeId(e.target.value)} style={{ minWidth: '200px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <option value="">Select Employee</option>
                        {employees.map(e => (
                            <option key={e.id} value={e.id}>{e.name} ({e.employee_id})</option>
                        ))}
                    </select>

                    <select value={month} onChange={e => setMonth(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        style={{ width: '80px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        placeholder="Year"
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <label style={{ fontWeight: '500', fontSize: '0.9rem' }}>LOP:</label>
                        <input
                            type="number"
                            min="0"
                            max="31"
                            value={lopDays}
                            onChange={e => setLopDays(Number(e.target.value))}
                            style={{ width: '60px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <label style={{ fontWeight: '500', fontSize: '0.9rem' }}>Sick:</label>
                        <input
                            type="number"
                            min="0"
                            max="1"
                            value={sickLeave}
                            onChange={e => setSickLeave(Number(e.target.value))}
                            style={{ width: '60px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <label style={{ fontWeight: '500', fontSize: '0.9rem' }}>Paid:</label>
                        <input
                            type="number"
                            min="0"
                            max="1"
                            value={paidLeave}
                            onChange={e => setPaidLeave(Number(e.target.value))}
                            style={{ width: '60px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                    </div>

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
