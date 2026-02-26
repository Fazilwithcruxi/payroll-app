import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import {
    User, Briefcase, Calendar, CreditCard, Building2,
    Hash, ChevronLeft, IndianRupee, Save, Info
} from 'lucide-react';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', designation: '', doj: '', gender: 'Male',
        payment_mode: 'Online', bank_account_no: '', ifsc_code: '', pan: '',
        annual_package: '',
        basic_salary: 0, hra: 0, internet_allowance: 0, meal_card: 0, special_allowance: 0,
        professional_tax: 0
    });

    const calculateSplit = (pkg) => {
        if (!pkg || isNaN(pkg)) return {
            basic_salary: 0, hra: 0, internet_allowance: 0, meal_card: 0, special_allowance: 0, professional_tax: 0
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
            basic_salary: Math.round(basic),
            hra: Math.round(hra),
            internet_allowance: internet,
            meal_card: meal,
            special_allowance: Math.round(special),
            professional_tax: pt
        };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData };

        if (name === 'annual_package') {
            const val = parseFloat(value);
            const split = calculateSplit(val);
            newFormData = { ...newFormData, [name]: value, ...split };
        } else if (name === 'pan' || name === 'ifsc_code') {
            newFormData = { ...newFormData, [name]: value.toUpperCase() };
        } else {
            newFormData = { ...newFormData, [name]: value };
        }

        setFormData(newFormData);
    };

    const validateForm = () => {
        const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
        if (!panRegex.test(formData.pan)) {
            alert('Invalid PAN Number format (e.g., ABCDE1234F)');
            return false;
        }

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
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to add employee');
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    return (
        <div className="main-content" style={{ marginLeft: 0 }}>
            <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        className="btn-logout"
                        onClick={() => navigate('/dashboard')}
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.5rem' }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 style={{ margin: 0, fontSize: '1.875rem' }}>Add New Employee</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                        {/* Section 1: Personal Details */}
                        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <User size={24} style={{ color: 'var(--primary)' }} />
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Personal Details</h3>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14} /> Full Name</label>
                                <input className="form-input" name="name" placeholder="John Doe" onChange={handleChange} required value={formData.name} />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Briefcase size={14} /> Designation</label>
                                <input className="form-input" name="designation" placeholder="Software Engineer" onChange={handleChange} required value={formData.designation} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> Joining Date</label>
                                    <input className="form-input" type="date" name="doj" onChange={handleChange} required value={formData.doj} />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select className="form-input" name="gender" onChange={handleChange} value={formData.gender}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Bank & Identity */}
                        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <Building2 size={24} style={{ color: 'var(--primary)' }} />
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Bank & Identity</h3>
                            </div>

                            <div className="form-group">
                                <label>Payment Mode</label>
                                <select className="form-input" name="payment_mode" onChange={handleChange} value={formData.payment_mode}>
                                    <option value="Online">Online</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CreditCard size={14} /> Bank Account Number</label>
                                <input className="form-input" name="bank_account_no" placeholder="Enter Account Number" onChange={handleChange} required value={formData.bank_account_no} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Hash size={14} /> IFSC Code</label>
                                    <input className="form-input" name="ifsc_code" placeholder="SBIN0123456" value={formData.ifsc_code} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Hash size={14} /> PAN Number</label>
                                    <input className="form-input" name="pan" placeholder="ABCDE1234F" value={formData.pan} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Salary Breakdown */}
                        <div className="stat-card" style={{ gridColumn: '1 / -1', flexDirection: 'column', alignItems: 'stretch' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <IndianRupee size={24} style={{ color: 'var(--primary)' }} />
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Salary Structure</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                                <div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '1rem', fontWeight: '600' }}>Annual Package (CTC)</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>₹</span>
                                            <input
                                                className="form-input"
                                                type="number"
                                                name="annual_package"
                                                placeholder="e.g. 1200000"
                                                style={{ paddingLeft: '25px', fontSize: '1.25rem', fontWeight: '700' }}
                                                onChange={handleChange}
                                                required
                                                value={formData.annual_package}
                                            />
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Info size={14} />
                                            Components calculate automatically based on company policy.
                                        </p>
                                    </div>
                                </div>

                                <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                                    <h4 style={{ margin: '0 0 1.25rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        Monthly Breakdown
                                        <span className="badge badge-designation">Scale View</span>
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1.5rem' }}>
                                        <div className="stat-details">
                                            <h3>Basic</h3>
                                            <p style={{ fontSize: '1.125rem' }}>{formatCurrency(formData.basic_salary)}</p>
                                        </div>
                                        <div className="stat-details">
                                            <h3>HRA</h3>
                                            <p style={{ fontSize: '1.125rem' }}>{formatCurrency(formData.hra)}</p>
                                        </div>
                                        <div className="stat-details">
                                            <h3>Special</h3>
                                            <p style={{ fontSize: '1.125rem' }}>{formatCurrency(formData.special_allowance)}</p>
                                        </div>
                                        <div className="stat-details">
                                            <h3>Internet</h3>
                                            <p style={{ fontSize: '1.125rem' }}>{formatCurrency(formData.internet_allowance)}</p>
                                        </div>
                                        <div className="stat-details">
                                            <h3>Meal Card</h3>
                                            <p style={{ fontSize: '1.125rem' }}>{formatCurrency(formData.meal_card)}</p>
                                        </div>
                                        <div className="stat-details">
                                            <h3>Prof. Tax</h3>
                                            <p style={{ fontSize: '1.125rem' }}>{formatCurrency(formData.professional_tax)}</p>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Monthly Gross</span>
                                        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                                            {formatCurrency(parseFloat(formData.annual_package || 0) / 12)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn" style={{ width: 'auto', minWidth: '240px' }}>
                            <Save size={20} /> Save Employee Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;

