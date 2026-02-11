import React from 'react';

const PayslipTemplate = ({ data }) => {
    const { employee, month, year, net_paid_days, lop_days, gross_earnings, total_deductions, net_pay, income_tax } = data;

    // Helper to format currency
    const fmt = (n) => Number(n).toFixed(2);

    return (
        <div style={{
            background: 'white',
            padding: '20px',
            border: '2px solid black',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'serif',
            color: 'black' // Ensure text is black for printing/viewing in dark mode
        }}>
            <style>{`
                .payslip-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                .payslip-table th, .payslip-table td { border: 1px solid black; padding: 5px; vertical-align: top; color: black; }
                .header-row { background-color: #ffe4cd; text-align: center; font-weight: bold; padding: 10px; border-bottom: 2px solid black; color: black; }
                .section-header { font-weight: bold; border-bottom: 2px solid black; }
                .no-border-bottom td { border-bottom: none; }
                .no-border-top td { border-top: none; }
            `}</style>

            <div className="header-row">
                Pay slip for the month of {month}'{String(year).slice(-2)}
            </div>

            <table className="payslip-table">
                <tbody>
                    <tr>
                        <td style={{ width: '50%' }}>
                            <div><strong>Employee Id number:</strong> {employee.employee_id}</div>
                            <div><strong>Employee name:</strong> {employee.name}</div>
                            <div><strong>Designation:</strong> {employee.designation}</div>
                            <div><strong>Date of joining:</strong> {new Date(employee.doj).toLocaleDateString()}</div>
                            <div><strong>Gender:</strong> {employee.gender}</div>
                            {employee.annual_package > 0 && <div><strong>Annual Package:</strong> {fmt(employee.annual_package)}</div>}
                        </td>
                        <td style={{ width: '50%' }}>
                            <div><strong>Payment Mode:</strong> {employee.payment_mode}</div>
                            <div><strong>Bank A/c no:</strong> {employee.bank_account_no}</div>
                            <div><strong>IFSC Code:</strong> {employee.ifsc_code}</div>
                            <div><strong>PAN:</strong> {employee.pan}</div>
                        </td>
                    </tr>

                    <tr>
                        <td style={{ borderBottom: '2px solid black' }}>
                            <div><strong>Standard Days :</strong> 31</div>
                            <div><strong>Net Paid Days :</strong> {net_paid_days}</div>
                        </td>
                        <td style={{ borderBottom: '2px solid black' }}>
                            <div><strong>LOP days :</strong> {lop_days}</div>
                            <div><strong>Available Leaves :</strong> 0</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="payslip-table" style={{ borderTop: 'none' }}>
                <thead>
                    <tr>
                        <th style={{ width: '50%' }}>Earnings</th>
                        <th style={{ width: '50%' }}>Deductions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="no-border-bottom">
                        <td>Basic Salary <span style={{ float: 'right' }}>{fmt(employee.basic_salary)}</span></td>
                        <td>Provident Fund <span style={{ float: 'right' }}>0.00</span></td>
                    </tr>
                    <tr className="no-border-bottom no-border-top">
                        <td>House Rent Allowance <span style={{ float: 'right' }}>{fmt(employee.hra)}</span></td>
                        <td>ESI <span style={{ float: 'right' }}>0.00</span></td>
                    </tr>
                    <tr className="no-border-bottom no-border-top">
                        <td>Internet Allowance <span style={{ float: 'right' }}>{fmt(employee.internet_allowance)}</span></td>
                        <td>Professional Tax <span style={{ float: 'right' }}>{fmt(employee.professional_tax)}</span></td>
                    </tr>
                    <tr className="no-border-bottom no-border-top">
                        <td>Meal Card <span style={{ float: 'right' }}>{fmt(employee.meal_card)}</span></td>
                        <td>Income Tax <span style={{ float: 'right' }}>{fmt(income_tax || 0)}</span></td>
                    </tr>
                    <tr className="no-border-bottom no-border-top">
                        <td>Special allowance <span style={{ float: 'right' }}>{fmt(employee.special_allowance)}</span></td>
                        <td>LOP <span style={{ float: 'right' }}>0.00</span></td>
                    </tr>
                    {/* Spacer rows if needed to match height */}
                    <tr className="no-border-top">
                        <td style={{ height: '30px' }}></td>
                        <td></td>
                    </tr>

                    <tr style={{ fontWeight: 'bold', borderTop: '2px solid black' }}>
                        <td>Gross earnings <span style={{ float: 'right' }}>{fmt(gross_earnings)}</span></td>
                        <td>Total deductions <span style={{ float: 'right' }}>{fmt(total_deductions)}</span></td>
                    </tr>
                </tbody>
            </table>

            <div style={{ background: '#ffe4cd', padding: '5px', textAlign: 'right', fontWeight: 'bold', border: '2px solid black', borderTop: 'none', color: 'black' }}>
                NET PAY: {fmt(net_pay)}
            </div>

            <div style={{ marginTop: '10px', fontSize: '10px', color: '#555', textAlign: 'center' }}>
                * Income Tax calculated based on New Tax Regime (FY 2025-26) guidelines.
            </div>
        </div>
    );
};

export default PayslipTemplate;
