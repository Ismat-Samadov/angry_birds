import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Loan Balance by Type
    const loansByType = await query(`
      SELECT
        loan_type,
        COUNT(*) as loan_count,
        SUM(outstanding_balance) as total_balance,
        AVG(outstanding_balance) as avg_balance
      FROM demo_bank.loans
      WHERE loan_status = 'active'
      GROUP BY loan_type
      ORDER BY total_balance DESC
    `);

    // 2. Customer Distribution by Account Type
    const customersByAccountType = await query(`
      SELECT
        account_type,
        COUNT(*) as customer_count,
        AVG(account_balance) as avg_balance,
        SUM(account_balance) as total_balance
      FROM demo_bank.customers
      WHERE account_status = 'active'
      GROUP BY account_type
      ORDER BY customer_count DESC
    `);

    // 3. Credit Score Distribution
    const creditScoreDistribution = await query(`
      SELECT
        CASE
          WHEN credit_score >= 750 THEN 'Excellent (750+)'
          WHEN credit_score >= 700 THEN 'Good (700-749)'
          WHEN credit_score >= 650 THEN 'Fair (650-699)'
          ELSE 'Poor (<650)'
        END as score_range,
        COUNT(*) as customer_count,
        AVG(account_balance) as avg_balance
      FROM demo_bank.customers
      WHERE account_status = 'active'
      GROUP BY score_range
      ORDER BY MIN(credit_score) DESC
    `);

    // 4. Top Customers by Balance
    const topCustomers = await query(`
      SELECT
        first_name || ' ' || last_name as customer_name,
        account_type,
        account_balance,
        credit_score
      FROM demo_bank.customers
      WHERE account_status = 'active'
      ORDER BY account_balance DESC
      LIMIT 10
    `);

    // 5. Monthly Transaction Volume (last 6 months)
    const transactionTrends = await query(`
      SELECT
        TO_CHAR(transaction_date, 'YYYY-MM') as month,
        transaction_type,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount
      FROM demo_bank.transactions
      WHERE transaction_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY month, transaction_type
      ORDER BY month DESC, transaction_type
    `);

    // 6. Loan Status Distribution
    const loanStatusDistribution = await query(`
      SELECT
        loan_status,
        COUNT(*) as count,
        SUM(outstanding_balance) as total_balance
      FROM demo_bank.loans
      GROUP BY loan_status
      ORDER BY count DESC
    `);

    // 7. Customer Account Status
    const customerStatusDistribution = await query(`
      SELECT
        account_status,
        COUNT(*) as count,
        AVG(account_balance) as avg_balance,
        AVG(credit_score) as avg_credit_score
      FROM demo_bank.customers
      GROUP BY account_status
      ORDER BY count DESC
    `);

    // 8. High-Value Customers (Balance > 50K)
    const highValueCustomers = await query(`
      SELECT
        COUNT(*) as count,
        SUM(account_balance) as total_balance,
        AVG(credit_score) as avg_credit_score
      FROM demo_bank.customers
      WHERE account_balance > 50000 AND account_status = 'active'
    `);

    // 9. Customers with Loans
    const customersWithLoans = await query(`
      SELECT
        c.account_type,
        COUNT(DISTINCT c.customer_id) as customers_with_loans,
        COUNT(l.loan_id) as total_loans,
        SUM(l.outstanding_balance) as total_loan_balance
      FROM demo_bank.customers c
      INNER JOIN demo_bank.loans l ON c.customer_id = l.customer_id
      WHERE c.account_status = 'active' AND l.loan_status = 'active'
      GROUP BY c.account_type
      ORDER BY total_loan_balance DESC
    `);

    // 10. Recent Large Transactions (last 30 days)
    const recentLargeTransactions = await query(`
      SELECT
        t.transaction_date,
        c.first_name || ' ' || c.last_name as customer_name,
        t.transaction_type,
        t.amount
      FROM demo_bank.transactions t
      INNER JOIN demo_bank.customers c ON t.customer_id = c.customer_id
      WHERE t.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
        AND t.amount > 5000
      ORDER BY t.amount DESC
      LIMIT 15
    `);

    return NextResponse.json({
      success: true,
      data: {
        loansByType: loansByType.rows,
        customersByAccountType: customersByAccountType.rows,
        creditScoreDistribution: creditScoreDistribution.rows,
        topCustomers: topCustomers.rows,
        transactionTrends: transactionTrends.rows,
        loanStatusDistribution: loanStatusDistribution.rows,
        customerStatusDistribution: customerStatusDistribution.rows,
        highValueCustomers: highValueCustomers.rows[0],
        customersWithLoans: customersWithLoans.rows,
        recentLargeTransactions: recentLargeTransactions.rows,
      },
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Analytics yüklənərkən xəta baş verdi' },
      { status: 500 }
    );
  }
}
