const pool = require('./db');

const updateSchema = async () => {
    try {
        console.log('Updating schema...');

        // Add quota columns to employees if not exist
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='sick_leave_quota') THEN 
                    ALTER TABLE employees ADD COLUMN sick_leave_quota INTEGER DEFAULT 12; 
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='paid_leave_quota') THEN 
                    ALTER TABLE employees ADD COLUMN paid_leave_quota INTEGER DEFAULT 12; 
                END IF;
            END $$;
        `);
        console.log('Employee table updated.');

        // Add leave columns to payslips if not exist
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payslips' AND column_name='sick_leave') THEN 
                    ALTER TABLE payslips ADD COLUMN sick_leave INTEGER DEFAULT 0; 
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payslips' AND column_name='paid_leave') THEN 
                    ALTER TABLE payslips ADD COLUMN paid_leave INTEGER DEFAULT 0; 
                END IF;
            END $$;
        `);
        console.log('Payslips table updated.');

        process.exit(0);
    } catch (err) {
        console.error('Schema update failed:', err);
        process.exit(1);
    }
};

updateSchema();
