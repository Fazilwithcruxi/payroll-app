const router = require('express').Router();
const pool = require('../db');

// Generate Payslip
router.post('/generate', async (req, res) => {
    try {
        const { employee_id_db, month, year, net_paid_days, lop_days } = req.body;

        // Fetch employee details
        const employeeResult = await pool.query('SELECT * FROM employees WHERE id = $1', [employee_id_db]);

        if (employeeResult.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const emp = employeeResult.rows[0];

        // Ensure numeric values
        const basic_salary = parseFloat(emp.basic_salary);
        const hra = parseFloat(emp.hra);
        const internet_allowance = parseFloat(emp.internet_allowance);
        const meal_card = parseFloat(emp.meal_card);
        const special_allowance = parseFloat(emp.special_allowance);
        const professional_tax = parseFloat(emp.professional_tax);

        // Calculate Full Monthly Gross
        const full_monthly_gross = basic_salary + hra + internet_allowance + meal_card + special_allowance;

        // LOP Deduction Formula: (Gross / 30) * LOP Days
        // Check if lop_days is provided
        const lop = lop_days ? parseFloat(lop_days) : 0;
        let deduction = 0;
        if (lop > 0) {
            deduction = (full_monthly_gross / 30) * lop;
        }

        const gross_earnings = Math.max(0, full_monthly_gross - deduction);

        // Calculate Income Tax (New Regime FY 2025-26)
        // Using annual package for projection
        let annual_income = parseFloat(emp.annual_package) || 0;
        if (annual_income === 0) {
            annual_income = full_monthly_gross * 12;
        }

        const standard_deduction = 75000;
        let taxable_income = Math.max(0, annual_income - standard_deduction);
        let tax = 0;

        if (taxable_income > 1500000) {
            tax += (taxable_income - 1500000) * 0.30;
            taxable_income = 1500000;
        }
        if (taxable_income > 1200000) {
            tax += (taxable_income - 1200000) * 0.20;
            taxable_income = 1200000;
        }
        if (taxable_income > 1000000) {
            tax += (taxable_income - 1000000) * 0.15;
            taxable_income = 1000000;
        }
        if (taxable_income > 700000) {
            tax += (taxable_income - 700000) * 0.10;
            taxable_income = 700000;
        }
        if (taxable_income > 300000) {
            tax += (taxable_income - 300000) * 0.05;
            taxable_income = 300000;
        }

        // Rebate u/s 87A: If taxable income <= 7L, tax is NIL. (New Regime 2023 onwards, actually limit is 7L for rebate, effectively 0 tax up to 7L)
        // However, if it exceeds 7L, the rebate is lost usually (marginal relief applies).
        // For simplicity:
        if ((annual_income - standard_deduction) <= 700000) {
            tax = 0;
        }

        const monthly_tax = tax / 12;
        const income_tax = parseFloat(monthly_tax.toFixed(2));

        const total_deductions = professional_tax + income_tax;

        const net_pay = gross_earnings - total_deductions;

        // Check if payslip already exists
        const check = await pool.query(
            'SELECT * FROM payslips WHERE employee_id = $1 AND month = $2 AND year = $3',
            [employee_id_db, month, year]
        );

        // Ensure we handle missing values
        const sick_leave_val = req.body.sick_leave ? parseInt(req.body.sick_leave) : 0;
        const paid_leave_val = req.body.paid_leave ? parseInt(req.body.paid_leave) : 0;

        let result;
        if (check.rows.length > 0) {
            // Update
            result = await pool.query(
                `UPDATE payslips SET 
                    net_paid_days = $1, lop_days = $2, gross_earnings = $3, total_deductions = $4, net_pay = $5, income_tax = $6, 
                    sick_leave = $7, paid_leave = $8, generated_at = CURRENT_TIMESTAMP
                WHERE employee_id = $9 AND month = $10 AND year = $11 RETURNING *`,
                [net_paid_days, lop_days, gross_earnings, total_deductions, net_pay, income_tax,
                    sick_leave_val, paid_leave_val,
                    employee_id_db, month, year]
            );
        } else {
            // Insert
            result = await pool.query(
                `INSERT INTO payslips (
                    employee_id, month, year, net_paid_days, lop_days, gross_earnings, total_deductions, net_pay, income_tax, sick_leave, paid_leave
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
                [employee_id_db, month, year, net_paid_days, lop_days, gross_earnings, total_deductions, net_pay, income_tax, sick_leave_val, paid_leave_val]
            );
        }

        // Calculate Available Leaves
        // 1. Get total used
        const usageResult = await pool.query(
            'SELECT SUM(sick_leave) as total_sick, SUM(paid_leave) as total_paid FROM payslips WHERE employee_id = $1',
            [employee_id_db]
        );
        const total_sick_used = parseInt(usageResult.rows[0].total_sick || 0);
        const total_paid_used = parseInt(usageResult.rows[0].total_paid || 0);

        // 2. Get quotas (defaults to 12 if null, based on schema update)
        // We already fetched 'emp' at the start, lets check if it has quota columns (it might not if cached, but it's a new query)
        // Re-fetching or just assuming defaults if not present in 'emp' object (if 'SELECT *' was used, it should be there)
        const sick_quota = emp.sick_leave_quota || 12;
        const paid_quota = emp.paid_leave_quota || 12;

        const available_sick_leave = Math.max(0, sick_quota - total_sick_used);
        const available_paid_leave = Math.max(0, paid_quota - total_paid_used);

        res.json({
            ...result.rows[0],
            lop_deduction: deduction,
            full_gross: full_monthly_gross,
            available_sick_leave,
            available_paid_leave
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Payslip for a specific month/year/employee
router.get('/:employee_id/:month/:year', async (req, res) => {
    try {
        const { employee_id, month, year } = req.params;
        const result = await pool.query(
            'SELECT * FROM payslips WHERE employee_id = $1 AND month = $2 AND year = $3',
            [employee_id, month, year]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Payslip not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
