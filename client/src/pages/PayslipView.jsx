import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import PayslipTemplate from '../components/PayslipTemplate';
import {
    Users, Calendar, Clock, FileText, Printer,
    ChevronLeft, Settings, AlertCircle, RefreshCcw
} from 'lucide-react';

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
            try {
                const res = await api.get('/employees');
                setEmployees(res.data);
            } catch (err) {
                console.error("Failed to fetch employees", err);
            }
        };
        fetchEmps();
    }, []);

    const handleGenerate = async () => {
        if (!selectedEmployeeId) return alert("Please select an employee first.");

        const emp = employees.find(e => e.id == selectedEmployeeId);
        if (!emp) return;

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = months.indexOf(month);
        const selectedMonthYear = new Date(year, monthIndex);
        const joiningDate = new Date(emp.doj);
        const joiningMonthYear = new Date(joiningDate.getFullYear(), joiningDate.getMonth());

        if (selectedMonthYear < joiningMonthYear) {
            alert(`Cannot generate payslip. Employee joined later in ${joiningDate.toLocaleDateString()}.`);
            return;
        }

        if (sickLeave > 1) {
            alert("Maximum 1 Sick Leave is allowed per month according to company policy.");
            return;
        }

        if (paidLeave > 1) {
            alert("Maximum 1 Paid Leave is allowed per month according to company policy.");
            return;
        }

        setLoading(true);
        try {
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
            alert("Error occurred while generating payslip.");
        }
        setLoading(false);
    };

    return (
        <div className="main-content" style={{ marginLeft: 0 }}>
            <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            className="btn-logout"
                            onClick={() => navigate('/dashboard')}
                            style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.5rem' }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Generate Payslip</h1>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Create and preview official employee payslips</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <Settings size={20} style={{ color: 'var(--primary)' }} />
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Payslip Configuration</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> Select Employee</label>
                            <select
                                className="form-input"
                                value={selectedEmployeeId}
                                onChange={e => setSelectedEmployeeId(e.target.value)}
                            >
                                <option value="">Choose an employee...</option>
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.name} ({e.employee_id})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Period</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select
                                    className="form-input"
                                    value={month}
                                    onChange={e => setMonth(e.target.value)}
                                >
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <input
                                    className="form-input"
                                    type="number"
                                    value={year}
                                    onChange={e => setYear(e.target.value)}
                                    style={{ width: '100px' }}
                                    placeholder="Year"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Leaves & LOP</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>LOP</span>
                                    <input
                                        className="form-input"
                                        type="number"
                                        min="0"
                                        max="31"
                                        value={lopDays}
                                        onChange={e => setLopDays(Number(e.target.value))}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sick</span>
                                    <input
                                        className="form-input"
                                        type="number"
                                        min="0"
                                        max="1"
                                        value={sickLeave}
                                        onChange={e => setSickLeave(Number(e.target.value))}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Paid</span>
                                    <input
                                        className="form-input"
                                        type="number"
                                        min="0"
                                        max="1"
                                        value={paidLeave}
                                        onChange={e => setPaidLeave(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="btn"
                            onClick={handleGenerate}
                            disabled={loading}
                            style={{ width: 'auto', minWidth: '220px' }}
                        >
                            {loading ? (
                                <><RefreshCcw size={18} className="animate-spin" style={{ marginRight: '8px' }} /> Processing...</>
                            ) : (
                                <><FileText size={18} style={{ marginRight: '8px' }} /> Generate & Preview</>
                            )}
                        </button>
                    </div>
                </div>

                {payslipData ? (
                    <div className="animate-slide-up">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={20} style={{ color: 'var(--primary)' }} />
                                Preview
                            </h3>
                            <button className="btn" onClick={() => window.print()} style={{ width: 'auto', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', boxShadow: 'none' }}>
                                <Printer size={18} style={{ marginRight: '8px' }} /> Print / Export PDF
                            </button>
                        </div>

                        <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', padding: '2rem' }}>
                            <PayslipTemplate data={payslipData} />
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <AlertCircle size={14} />
                            <span>This is a system generated preview. Verify all details before exporting.</span>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        background: 'var(--surface)',
                        borderRadius: '12px',
                        border: '2px dashed var(--border)',
                        color: 'var(--text-secondary)'
                    }}>
                        <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <p>Configure the parameters above to generate a payslip preview.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayslipView;
