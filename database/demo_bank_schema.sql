-- =====================================================
-- Demo Bank Database Schema
-- =====================================================
-- This schema creates a demonstration banking database
-- with customers, loans, and transactions tables
-- =====================================================

-- Create the demo_bank schema
CREATE SCHEMA IF NOT EXISTS demo_bank;

-- Set search path to use the demo_bank schema
SET search_path TO demo_bank;

-- =====================================================
-- TABLE: customers
-- =====================================================
-- Stores information about bank customers
-- =====================================================

CREATE TABLE IF NOT EXISTS customers (
    -- Primary identifier for the customer
    customer_id SERIAL PRIMARY KEY,

    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,

    -- Contact Information
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),

    -- Address Information
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',

    -- Account Information
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('checking', 'savings', 'business', 'investment')),
    account_balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,

    -- KYC (Know Your Customer) Information
    ssn_last_four CHAR(4), -- Last 4 digits of SSN for security
    id_type VARCHAR(50) CHECK (id_type IN ('passport', 'drivers_license', 'national_id')),
    id_number VARCHAR(50),

    -- Account Status
    account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'inactive', 'suspended', 'closed')),
    credit_score INTEGER CHECK (credit_score BETWEEN 300 AND 850),

    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_age CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years')
);

-- Create indexes for better query performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_account_number ON customers(account_number);
CREATE INDEX idx_customers_last_name ON customers(last_name);
CREATE INDEX idx_customers_account_status ON customers(account_status);

-- =====================================================
-- TABLE: loans
-- =====================================================
-- Stores information about loans issued to customers
-- =====================================================

CREATE TABLE IF NOT EXISTS loans (
    -- Primary identifier for the loan
    loan_id SERIAL PRIMARY KEY,

    -- Foreign Key to customers table
    customer_id INTEGER NOT NULL,

    -- Loan Details
    loan_number VARCHAR(20) UNIQUE NOT NULL,
    loan_type VARCHAR(50) NOT NULL CHECK (loan_type IN ('personal', 'mortgage', 'auto', 'student', 'business', 'home_equity')),
    loan_purpose TEXT,

    -- Financial Information
    principal_amount DECIMAL(15, 2) NOT NULL CHECK (principal_amount > 0),
    interest_rate DECIMAL(5, 2) NOT NULL CHECK (interest_rate >= 0 AND interest_rate <= 100),
    loan_term_months INTEGER NOT NULL CHECK (loan_term_months > 0),
    monthly_payment DECIMAL(15, 2) NOT NULL,

    -- Outstanding Balance
    outstanding_balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    total_paid DECIMAL(15, 2) DEFAULT 0.00,

    -- Dates
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    approval_date DATE,
    disbursement_date DATE,
    first_payment_date DATE,
    maturity_date DATE,

    -- Status Information
    loan_status VARCHAR(20) DEFAULT 'pending' CHECK (loan_status IN ('pending', 'approved', 'active', 'paid_off', 'defaulted', 'rejected')),
    payment_status VARCHAR(20) DEFAULT 'current' CHECK (payment_status IN ('current', 'late', 'defaulted', 'grace_period')),
    days_past_due INTEGER DEFAULT 0,

    -- Collateral Information (if applicable)
    collateral_type VARCHAR(100),
    collateral_value DECIMAL(15, 2),

    -- Loan Officer Information
    loan_officer_name VARCHAR(200),
    loan_officer_id VARCHAR(50),

    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_payment_date DATE,

    -- Foreign Key Constraint
    CONSTRAINT fk_loan_customer FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_loans_customer_id ON loans(customer_id);
CREATE INDEX idx_loans_loan_number ON loans(loan_number);
CREATE INDEX idx_loans_loan_status ON loans(loan_status);
CREATE INDEX idx_loans_loan_type ON loans(loan_type);
CREATE INDEX idx_loans_payment_status ON loans(payment_status);

-- =====================================================
-- TABLE: transactions
-- =====================================================
-- Stores all financial transactions for customers
-- =====================================================

CREATE TABLE IF NOT EXISTS transactions (
    -- Primary identifier for the transaction
    transaction_id SERIAL PRIMARY KEY,

    -- Foreign Key to customers table
    customer_id INTEGER NOT NULL,

    -- Optional Foreign Key to loans table (for loan-related transactions)
    loan_id INTEGER,

    -- Transaction Identification
    transaction_reference VARCHAR(50) UNIQUE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN (
        'deposit', 'withdrawal', 'transfer_in', 'transfer_out',
        'loan_disbursement', 'loan_payment', 'interest_credit',
        'fee_debit', 'refund', 'reversal'
    )),

    -- Transaction Details
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'USD',

    -- Balance Information
    balance_before DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,

    -- Transaction Description
    description TEXT,
    notes TEXT,

    -- Transaction Method
    transaction_method VARCHAR(50) CHECK (transaction_method IN (
        'cash', 'check', 'wire_transfer', 'ach', 'debit_card',
        'credit_card', 'online', 'mobile_app', 'atm'
    )),

    -- Related Party Information (for transfers)
    counterparty_account VARCHAR(50),
    counterparty_name VARCHAR(200),
    counterparty_bank VARCHAR(200),

    -- Location and Device Information
    branch_code VARCHAR(20),
    atm_id VARCHAR(50),
    ip_address INET,
    device_id VARCHAR(100),

    -- Status and Processing
    transaction_status VARCHAR(20) DEFAULT 'completed' CHECK (transaction_status IN (
        'pending', 'processing', 'completed', 'failed', 'reversed', 'cancelled'
    )),

    -- Dates and Timestamps
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    posted_date DATE,
    value_date DATE,

    -- Audit and Compliance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by VARCHAR(100),
    authorized_by VARCHAR(100),

    -- Fraud Detection Flags
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,

    -- Foreign Key Constraints
    CONSTRAINT fk_transaction_customer FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_transaction_loan FOREIGN KEY (loan_id)
        REFERENCES loans(loan_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    -- Check that balance calculation is correct
    CONSTRAINT chk_balance_calculation CHECK (
        (transaction_type IN ('deposit', 'transfer_in', 'loan_disbursement', 'interest_credit', 'refund')
            AND balance_after = balance_before + amount) OR
        (transaction_type IN ('withdrawal', 'transfer_out', 'loan_payment', 'fee_debit')
            AND balance_after = balance_before - amount) OR
        (transaction_type = 'reversal')
    )
);

-- Create indexes for better query performance
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_loan_id ON transactions(loan_id);
CREATE INDEX idx_transactions_transaction_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_transaction_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_transaction_status ON transactions(transaction_status);
CREATE INDEX idx_transactions_reference ON transactions(transaction_reference);
CREATE INDEX idx_transactions_flagged ON transactions(is_flagged) WHERE is_flagged = TRUE;

-- Create composite index for common queries
CREATE INDEX idx_transactions_customer_date ON transactions(customer_id, transaction_date DESC);

-- =====================================================
-- VIEWS: Useful reporting views
-- =====================================================

-- View for customer account summary
CREATE OR REPLACE VIEW customer_account_summary AS
SELECT
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    c.account_number,
    c.account_type,
    c.account_balance,
    c.account_status,
    COUNT(DISTINCT l.loan_id) as total_loans,
    COALESCE(SUM(l.outstanding_balance), 0) as total_loan_balance,
    COUNT(DISTINCT t.transaction_id) as total_transactions,
    c.created_at as customer_since
FROM customers c
LEFT JOIN loans l ON c.customer_id = l.customer_id AND l.loan_status = 'active'
LEFT JOIN transactions t ON c.customer_id = t.customer_id
GROUP BY c.customer_id;

-- View for active loans summary
CREATE OR REPLACE VIEW active_loans_summary AS
SELECT
    l.loan_id,
    l.loan_number,
    l.loan_type,
    c.customer_id,
    c.first_name || ' ' || c.last_name as customer_name,
    l.principal_amount,
    l.outstanding_balance,
    l.interest_rate,
    l.monthly_payment,
    l.loan_status,
    l.payment_status,
    l.days_past_due,
    l.disbursement_date,
    l.maturity_date
FROM loans l
JOIN customers c ON l.customer_id = c.customer_id
WHERE l.loan_status IN ('approved', 'active');

-- View for recent transactions
CREATE OR REPLACE VIEW recent_transactions AS
SELECT
    t.transaction_id,
    t.transaction_reference,
    c.customer_id,
    c.first_name || ' ' || c.last_name as customer_name,
    c.account_number,
    t.transaction_type,
    t.amount,
    t.currency,
    t.description,
    t.transaction_date,
    t.transaction_time,
    t.transaction_status,
    t.is_flagged
FROM transactions t
JOIN customers c ON t.customer_id = c.customer_id
ORDER BY t.transaction_time DESC;

-- =====================================================
-- TRIGGERS: Auto-update timestamps
-- =====================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for customers table
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for loans table
CREATE TRIGGER update_loans_updated_at
    BEFORE UPDATE ON loans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA: Insert demonstration data
-- =====================================================

-- Insert sample customers
INSERT INTO customers (first_name, last_name, date_of_birth, email, phone_number, street_address, city, state, postal_code, account_number, account_type, account_balance, ssn_last_four, id_type, id_number, credit_score)
VALUES
    ('John', 'Smith', '1985-03-15', 'john.smith@email.com', '+1-555-0101', '123 Main St', 'New York', 'NY', '10001', 'ACC1001', 'checking', 15000.00, '1234', 'drivers_license', 'DL123456', 720),
    ('Sarah', 'Johnson', '1990-07-22', 'sarah.johnson@email.com', '+1-555-0102', '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'ACC1002', 'savings', 25000.00, '5678', 'passport', 'P987654', 750),
    ('Michael', 'Williams', '1978-11-08', 'michael.williams@email.com', '+1-555-0103', '789 Pine Rd', 'Chicago', 'IL', '60601', 'ACC1003', 'business', 50000.00, '9012', 'drivers_license', 'DL789012', 680),
    ('Emily', 'Brown', '1995-05-30', 'emily.brown@email.com', '+1-555-0104', '321 Elm St', 'Houston', 'TX', '77001', 'ACC1004', 'checking', 8500.00, '3456', 'national_id', 'NID456789', 700),
    ('David', 'Martinez', '1982-09-18', 'david.martinez@email.com', '+1-555-0105', '654 Maple Dr', 'Phoenix', 'AZ', '85001', 'ACC1005', 'investment', 75000.00, '7890', 'passport', 'P123789', 780);

-- Insert sample loans
INSERT INTO loans (customer_id, loan_number, loan_type, loan_purpose, principal_amount, interest_rate, loan_term_months, monthly_payment, outstanding_balance, total_paid, application_date, approval_date, disbursement_date, first_payment_date, maturity_date, loan_status, payment_status, collateral_type, collateral_value, loan_officer_name, loan_officer_id)
VALUES
    (1, 'LOAN1001', 'auto', 'Purchase new vehicle', 25000.00, 4.5, 60, 466.08, 20000.00, 5000.00, '2023-01-15', '2023-01-20', '2023-01-25', '2023-02-25', '2028-01-25', 'active', 'current', 'vehicle', 25000.00, 'Robert Davis', 'LO001'),
    (2, 'LOAN1002', 'mortgage', 'Home purchase', 350000.00, 3.75, 360, 1620.91, 340000.00, 10000.00, '2022-06-10', '2022-06-25', '2022-07-01', '2022-08-01', '2052-07-01', 'active', 'current', 'property', 400000.00, 'Jennifer Wilson', 'LO002'),
    (3, 'LOAN1003', 'business', 'Business expansion', 100000.00, 6.25, 120, 1110.21, 85000.00, 15000.00, '2023-03-05', '2023-03-15', '2023-03-20', '2023-04-20', '2033-03-20', 'active', 'current', 'business_assets', 150000.00, 'Robert Davis', 'LO001'),
    (4, 'LOAN1004', 'personal', 'Debt consolidation', 15000.00, 8.5, 48, 370.36, 12000.00, 3000.00, '2023-05-12', '2023-05-18', '2023-05-22', '2023-06-22', '2027-05-22', 'active', 'current', NULL, NULL, 'Lisa Anderson', 'LO003'),
    (5, 'LOAN1005', 'student', 'Graduate education', 50000.00, 5.5, 120, 542.49, 50000.00, 0.00, '2024-08-01', '2024-08-10', '2024-08-15', '2024-09-15', '2034-08-15', 'active', 'grace_period', NULL, NULL, 'Jennifer Wilson', 'LO002');

-- Insert sample transactions
INSERT INTO transactions (customer_id, loan_id, transaction_reference, transaction_type, amount, balance_before, balance_after, description, transaction_method, transaction_status, transaction_date, branch_code, processed_by)
VALUES
    (1, NULL, 'TXN1001', 'deposit', 5000.00, 10000.00, 15000.00, 'Salary deposit', 'ach', 'completed', '2024-10-15', 'BR001', 'SYSTEM'),
    (1, 1, 'TXN1002', 'loan_payment', 466.08, 15000.00, 14533.92, 'Auto loan monthly payment', 'online', 'completed', '2024-10-20', NULL, 'SYSTEM'),
    (2, NULL, 'TXN1003', 'deposit', 7500.00, 17500.00, 25000.00, 'Investment returns', 'wire_transfer', 'completed', '2024-10-18', 'BR002', 'SYSTEM'),
    (2, 2, 'TXN1004', 'loan_payment', 1620.91, 25000.00, 23379.09, 'Mortgage payment', 'ach', 'completed', '2024-10-25', NULL, 'SYSTEM'),
    (3, NULL, 'TXN1005', 'deposit', 25000.00, 25000.00, 50000.00, 'Business revenue', 'check', 'completed', '2024-10-10', 'BR003', 'Jane Smith'),
    (3, 3, 'TXN1006', 'loan_payment', 1110.21, 50000.00, 48889.79, 'Business loan payment', 'online', 'completed', '2024-10-22', NULL, 'SYSTEM'),
    (4, NULL, 'TXN1007', 'deposit', 3200.00, 5300.00, 8500.00, 'Payroll deposit', 'ach', 'completed', '2024-10-16', NULL, 'SYSTEM'),
    (4, 4, 'TXN1008', 'loan_payment', 370.36, 8500.00, 8129.64, 'Personal loan payment', 'debit_card', 'completed', '2024-10-23', NULL, 'SYSTEM'),
    (5, NULL, 'TXN1009', 'deposit', 10000.00, 65000.00, 75000.00, 'Investment dividend', 'wire_transfer', 'completed', '2024-10-12', 'BR001', 'SYSTEM'),
    (1, NULL, 'TXN1010', 'withdrawal', 500.00, 14533.92, 14033.92, 'ATM withdrawal', 'atm', 'completed', '2024-10-26', NULL, 'SYSTEM');

-- =====================================================
-- GRANT PERMISSIONS (Optional - uncomment if needed)
-- =====================================================
-- GRANT USAGE ON SCHEMA demo_bank TO your_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA demo_bank TO your_user;
-- GRANT SELECT ON ALL SEQUENCES IN SCHEMA demo_bank TO your_user;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
