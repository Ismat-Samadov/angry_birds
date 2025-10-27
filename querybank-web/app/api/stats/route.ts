import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const [customersRes, loansRes, loanBalanceRes, depositsRes] = await Promise.all([
      query('SELECT COUNT(*) as count FROM demo_bank.customers WHERE account_status = $1', ['active']),
      query('SELECT COUNT(*) as count FROM demo_bank.loans WHERE loan_status = $1', ['active']),
      query('SELECT COALESCE(SUM(outstanding_balance), 0) as total FROM demo_bank.loans WHERE loan_status = $1', ['active']),
      query('SELECT COALESCE(SUM(account_balance), 0) as total FROM demo_bank.customers WHERE account_status = $1', ['active']),
    ]);

    return NextResponse.json({
      customers: parseInt(customersRes.rows[0]?.count || '0'),
      loans: parseInt(loansRes.rows[0]?.count || '0'),
      totalLoanBalance: parseFloat(loanBalanceRes.rows[0]?.total || '0'),
      totalDeposits: parseFloat(depositsRes.rows[0]?.total || '0'),
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
