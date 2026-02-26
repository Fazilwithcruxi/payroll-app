const router = require('express').Router();
const pool = require('../db');

// Get all employees
router.get('/', async (req, res) => {
    try {
        const allEmployees = await pool.query('SELECT * FROM employees ORDER BY id ASC');
        res.json(allEmployees.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get a single employee
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
        res.json(employee.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a new employee
router.post('/', async (req, res) => {
    try {
        const {
            name, designation, doj, gender, payment_mode,
            bank_account_no, ifsc_code, pan,
            basic_salary, hra, internet_allowance, meal_card, special_allowance, professional_tax,
            annual_package
        } = req.body;

        // Auto-generate employee_id
        const countResult = await pool.query('SELECT COUNT(*) FROM employees');
        const count = parseInt(countResult.rows[0].count) + 1;
        const auto_employee_id = `ODIN${count.toString().padStart(3, '0')}`;

        const newEmployee = await pool.query(
            `INSERT INTO employees (
                employee_id, name, designation, doj, gender, payment_mode,
                bank_account_no, ifsc_code, pan,
                basic_salary, hra, internet_allowance, meal_card, special_allowance, professional_tax,
                annual_package
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
            [
                auto_employee_id, name, designation, doj, gender, payment_mode,
                bank_account_no, ifsc_code, pan,
                basic_salary, hra || 0, internet_allowance || 0, meal_card || 0, special_allowance || 0, professional_tax || 200,
                annual_package || 0
            ]
        );

        res.json(newEmployee.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM employees WHERE id = $1', [id]);
        res.json("Employee was deleted!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
