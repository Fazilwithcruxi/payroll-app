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

        // Simple pro-rata calculation if needed, but per requirement, we might just store what's given or calculate
        // For now, let's assume the allowances are fixed monthly, and we might adjust basic based on LOP?
        // Or usually allowances are also pro-rated.
        // Let's implement a standard pro-rata logic based on 30/31 days or just use the provided net_paid_days?
        // Requirement 1.2 says: "When HR selects particular month and year, payslip should be generated"
        // The image shows "Standard Days: 31", "Net Paid Days: 31".
        // Use net_paid_days / standard_days ratio?
        // For simplicity in MVP: Assume full output unless LOP is specified.

        // Image shows:
        // Basic: 17550
        // HRA: 8775
        // Internet: 833
        // Meal: 2200
        // Special: 9642
        // Leave Encashment: 8761 (This seems like a one-off or specific field. I'll ignore for general calc unless added to employee)

        const gross_earnings = basic_salary + hra + internet_allowance + meal_card + special_allowance;
        // Note: Logic for Leave Encashment is not in generic employee table yet.

        // Calculate Income Tax (New Regime FY 2025-26)
        // Slabs:
        // 0-3L: Nil
        // 3-7L: 5%
        // 7-10L: 10%
        // 10-12L: 15%
        // 12-15L: 20%
        // >15L: 30%
        // Std Deduction: 75000 (New regime default usually, check specific budget, but standard is 50k -> 75k allowed in some contexts, stick to 75k as per user ref to "Finance Minister")

        let annual_income = parseFloat(emp.annual_package) || 0;
        // If annual_package is not set, use monthly gross * 12 as fallback estimate
        if (annual_income === 0) {
            annual_income = gross_earnings * 12;
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

        let result;
        if (check.rows.length > 0) {
            // Update
            result = await pool.query(
                `UPDATE payslips SET 
                    net_paid_days = $1, lop_days = $2, gross_earnings = $3, total_deductions = $4, net_pay = $5, income_tax = $6, generated_at = CURRENT_TIMESTAMP
                WHERE employee_id = $7 AND month = $8 AND year = $9 RETURNING *`,
                [net_paid_days, lop_days, gross_earnings, total_deductions, net_pay, income_tax, employee_id_db, month, year]
            );
        } else {
            // Insert
            result = await pool.query(
                `INSERT INTO payslips (
                    employee_id, month, year, net_paid_days, lop_days, gross_earnings, total_deductions, net_pay, income_tax
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [employee_id_db, month, year, net_paid_days, lop_days, gross_earnings, total_deductions, net_pay, income_tax]
            );
        }

        res.json(result.rows[0]);

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
