import React from 'react';
import logo from '../assets/file.svg';

const PayslipTemplate = ({ data }) => {
    const {
        employee, month, year, net_paid_days, lop_days,
        gross_earnings, total_deductions, net_pay, income_tax,
        sick_leave = 0, paid_leave = 0, lop_deduction = 0, full_gross
    } = data;

    // Helper to format currency
    const fmt = (n) => Number(n).toFixed(2);

    // Calculate display values
    const displayGross = full_gross || (parseFloat(gross_earnings) + parseFloat(lop_deduction));
    const displayTotalDeductions = parseFloat(total_deductions) + parseFloat(lop_deduction);

    return (
        <div className="printable-payslip" style={{
            background: 'white',
            padding: '20px',
            border: '2px solid black',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'serif',
            color: 'black'
        }}>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .printable-payslip, .printable-payslip * { visibility: visible; }
                    .printable-payslip {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .btn, .header, .card:not(.printable-payslip) { display: none !important; }
                }
                .payslip-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                .payslip-table th, .payslip-table td { border: 1px solid black; padding: 5px; vertical-align: top; color: black; }
                .header-row { background-color: #ffe4cd; text-align: center; font-weight: bold; padding: 10px; border-bottom: 2px solid black; color: black; }
                .company-header { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px; border-bottom: 2px solid black; padding-bottom: 10px; }
                .company-logo { height: 50px; }
                .company-name { font-size: 24px; font-weight: bold; text-transform: uppercase; }
                .section-header { font-weight: bold; border-bottom: 2px solid black; }
                .no-border-bottom td { border-bottom: none; }
                .no-border-top td { border-top: none; }
            `}</style>

            <div className="company-header">
                <img src={logo} alt="Oden Kirk" className="company-logo" />
                <div className="company-name">Oden Kirk</div>
            </div>

            <div className="header-row">
                Pay slip for the month of {month} {year}
            </div>

            <table className="payslip-table">
                <tbody>
                    <tr>
                        <td style={{ width: '50%' }}>
                            <div><strong>Employee Id:</strong> {employee.employee_id}</div>
                            <div><strong>Name:</strong> {employee.name}</div>
                            <div><strong>Designation:</strong> {employee.designation}</div>
                            <div><strong>DOJ:</strong> {new Date(employee.doj).toLocaleDateString()}</div>
                            <div><strong>Gender:</strong> {employee.gender}</div>
                            {employee.annual_package > 0 && <div><strong>Annual Package:</strong> {fmt(employee.annual_package)}</div>}
                        </td>
                        <td style={{ width: '50%' }}>
                            <div><strong>Payment Mode:</strong> {employee.payment_mode}</div>
                            <div><strong>Bank A/c:</strong> {employee.bank_account_no}</div>
                            <div><strong>IFSC:</strong> {employee.ifsc_code}</div>
                            <div><strong>PAN:</strong> {employee.pan}</div>
                        </td>
                    </tr>

                    <tr>
                        <td style={{ borderBottom: '2px solid black' }}>
                            <div><strong>Standard Days :</strong> {new Date(year, ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(month) + 1, 0).getDate()}</div>
                            <div><strong>Net Paid Days :</strong> {net_paid_days}</div>
                        </td>
                        <td style={{ borderBottom: '2px solid black' }}>
                            <div><strong>LOP Days :</strong> {lop_days}</div>
                            <div><strong>Leaves Taken :</strong> Sick: {sick_leave}, Paid: {paid_leave}</div>
                            <div><strong>Available :</strong> Sick: {data.available_sick_leave || 0}, Paid: {data.available_paid_leave || 0}</div>
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
                        <td>LOP Deduction <span style={{ float: 'right' }}>{fmt(lop_deduction)}</span></td>
                    </tr>
                    {/* Spacer rows */}
                    <tr className="no-border-top">
                        <td style={{ height: '30px' }}></td>
                        <td></td>
                    </tr>

                    <tr style={{ fontWeight: 'bold', borderTop: '2px solid black' }}>
                        <td>Gross Earnings <span style={{ float: 'right' }}>{fmt(displayGross)}</span></td>
                        <td>Total Deductions <span style={{ float: 'right' }}>{fmt(displayTotalDeductions)}</span></td>
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
