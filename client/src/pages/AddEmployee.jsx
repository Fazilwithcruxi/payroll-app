import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        employee_id: '', name: '', designation: '', doj: '', gender: 'Male',
        payment_mode: 'Online', bank_account_no: '', ifsc_code: '', pan: '',
        annual_package: '',
        basic_salary: '', hra: '', internet_allowance: '', meal_card: '', special_allowance: '',
        professional_tax: ''
    });

    const calculateSplit = (pkg) => {
        if (!pkg) return {
            basic_salary: '', hra: '', internet_allowance: '', meal_card: '', special_allowance: '', professional_tax: ''
        };

        const monthlyCTC = pkg / 12;
        const basic = monthlyCTC * 0.40;
        const hra = basic * 0.50;
        const internet = 1000;
        const meal = 2200;
        const pt = 200;
        let special = monthlyCTC - (basic + hra + internet + meal + pt);
        if (special < 0) special = 0;

        return {
            basic_salary: basic.toFixed(2),
            hra: hra.toFixed(2),
            internet_allowance: internet.toFixed(2),
            meal_card: meal.toFixed(2),
            special_allowance: special.toFixed(2),
            professional_tax: pt
        };
    };

    // Load saved data on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('addEmployeeForm');
        if (saved) {
            try {
                setFormData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved form data", e);
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData };

        if (name === 'annual_package') {
            const split = calculateSplit(parseFloat(value));
            newFormData = { ...newFormData, [name]: value, ...split };
        } else if (name === 'employee_id') {
            let newVal = value.toUpperCase();
            newFormData = { ...newFormData, [name]: newVal };
        } else if (name === 'pan' || name === 'ifsc_code') {
            newFormData = { ...newFormData, [name]: value.toUpperCase() };
        } else {
            newFormData = { ...newFormData, [name]: value };
        }

        setFormData(newFormData);
        localStorage.setItem('addEmployeeForm', JSON.stringify(newFormData));
    };

    const validateForm = () => {
        // Employee ID Validation
        if (!formData.employee_id.startsWith('ODIN')) {
            alert('Employee ID must start with "ODIN"');
            return false;
        }

        // PAN Validation
        const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
        if (!panRegex.test(formData.pan)) {
            alert('Invalid PAN Number format (e.g., ABCDE1234F)');
            return false;
        }

        // IFSC Validation
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(formData.ifsc_code)) {
            alert('Invalid IFSC Code format (e.g., SBIN0123456)');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await api.post('/employees', formData);
            alert('Employee Added Successfully');
            localStorage.removeItem('addEmployeeForm'); // Clear saved data
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to add employee');
        }
    };

    return (
        <div className="container">
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem' }}>Back</button>
            <div className="card">
                <h2>Add New Employee</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Personal Details */}
                    <div>
                        <h3>Personal Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input name="employee_id" placeholder="Employee ID (starts with ODIN)" value={formData.employee_id} onChange={handleChange} required />
                            <input name="name" placeholder="Full Name" onChange={handleChange} required />
                            <input name="designation" placeholder="Designation" onChange={handleChange} required />
                            <input type="date" name="doj" placeholder="Date of Joining" onChange={handleChange} required />
                            <select name="gender" onChange={handleChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div>
                        <h3>Bank & Payment</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <select name="payment_mode" onChange={handleChange}>
                                <option value="Online">Online</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Cash">Cash</option>
                            </select>
                            <input name="bank_account_no" placeholder="Bank Account No" onChange={handleChange} required />
                            <input name="ifsc_code" placeholder="IFSC Code (e.g. SBIN0123456)" value={formData.ifsc_code} onChange={handleChange} required />
                            <input name="pan" placeholder="PAN Number (e.g. ABCDE1234F)" value={formData.pan} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Salary Details */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <h3>Salary Structure</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Annual Package (LPA)</label>
                            <input
                                type="number"
                                name="annual_package"
                                placeholder="Enter Annual Package (e.g. 1200000)"
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', fontSize: '1.1rem' }}
                                required
                                value={formData.annual_package}
                            />
                            <small style={{ color: '#666' }}>Monthly components will be calculated automatically.</small>
                        </div>

                        <h3>Monthly Components (Auto-Calculated)</h3>
                        <div className="grid-cols-2">
                            <div>
                                <label>Basic Salary</label>
                                <input value={formData.basic_salary} readOnly placeholder="Basic Salary" style={{ background: 'var(--bg)', color: 'var(--text)', fontWeight: 'bold' }} />
                            </div>
                            <div>
                                <label>HRA</label>
                                <input value={formData.hra} readOnly placeholder="HRA" style={{ background: 'var(--bg)', color: 'var(--text)', fontWeight: 'bold' }} />
                            </div>
                            <div>
                                <label>Internet Allowance</label>
                                <input value={formData.internet_allowance} readOnly placeholder="Internet" style={{ background: 'var(--bg)', color: 'var(--text)', fontWeight: 'bold' }} />
                            </div>
                            <div>
                                <label>Meal Card</label>
                                <input value={formData.meal_card} readOnly placeholder="Meal Card" style={{ background: 'var(--bg)', color: 'var(--text)', fontWeight: 'bold' }} />
                            </div>
                            <div>
                                <label>Special Allowance</label>
                                <input value={formData.special_allowance} readOnly placeholder="Special Allowance" style={{ background: 'var(--bg)', color: 'var(--text)', fontWeight: 'bold' }} />
                            </div>
                            <div>
                                <label>Professional Tax</label>
                                <input value={formData.professional_tax} readOnly placeholder="PT" style={{ background: 'var(--bg)', color: 'var(--text)', fontWeight: 'bold' }} />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>Save Employee</button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
