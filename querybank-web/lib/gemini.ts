import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SCHEMA_DOC = `
# Demo Bank Database Schema

## Schema: demo_bank

### Table: customers
- customer_id (SERIAL PRIMARY KEY)
- first_name, last_name (VARCHAR)
- date_of_birth (DATE)
- email (VARCHAR UNIQUE)
- phone_number (VARCHAR)
- street_address, city, state, postal_code, country (VARCHAR)
- account_number (VARCHAR UNIQUE)
- account_type ('checking', 'savings', 'business', 'investment')
- account_balance (DECIMAL(15,2))
- ssn_last_four (CHAR(4))
- id_type, id_number (VARCHAR)
- account_status ('active', 'inactive', 'suspended', 'closed')
- credit_score (INTEGER 300-850)
- created_at, updated_at, last_login (TIMESTAMP)

### Table: loans
- loan_id (SERIAL PRIMARY KEY)
- customer_id (FK -> customers)
- loan_number (VARCHAR UNIQUE)
- loan_type ('personal', 'mortgage', 'auto', 'student', 'business', 'home_equity')
- loan_purpose (TEXT)
- principal_amount, interest_rate, loan_term_months, monthly_payment (NUMERIC)
- outstanding_balance, total_paid (DECIMAL)
- application_date, approval_date, disbursement_date, maturity_date (DATE)
- loan_status ('pending', 'approved', 'active', 'paid_off', 'defaulted', 'rejected')
- payment_status ('current', 'late', 'defaulted', 'grace_period')
- days_past_due (INTEGER)
- collateral_type, collateral_value (VARCHAR, DECIMAL)
- loan_officer_name, loan_officer_id (VARCHAR)

### Table: transactions
- transaction_id (SERIAL PRIMARY KEY)
- customer_id (FK -> customers)
- loan_id (FK -> loans, optional)
- transaction_reference (VARCHAR UNIQUE)
- transaction_type ('deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'loan_disbursement', 'loan_payment', 'interest_credit', 'fee_debit', 'refund', 'reversal')
- amount (DECIMAL)
- balance_before, balance_after (DECIMAL)
- description, notes (TEXT)
- transaction_method ('cash', 'check', 'wire_transfer', 'ach', 'debit_card', 'credit_card', 'online', 'mobile_app', 'atm')
- transaction_status ('pending', 'processing', 'completed', 'failed', 'reversed', 'cancelled')
- transaction_date, transaction_time (DATE, TIMESTAMP)
- is_flagged (BOOLEAN)

### Views:
- customer_account_summary
- active_loans_summary
- recent_transactions

### Important:
- Always use: SET search_path TO demo_bank;
- JOIN: customers.customer_id = loans.customer_id
- JOIN: customers.customer_id = transactions.customer_id
`;

export interface QueryResponse {
  query: string;
  needs_chart: boolean;
  chart_type: 'bar' | 'line' | 'pie' | 'scatter' | null;
  chart_config?: {
    x_column: string;
    y_column: string;
    title: string;
    xlabel: string;
    ylabel: string;
  };
  explanation: string;
}

export async function generateQuery(userQuestion: string): Promise<QueryResponse> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a SQL expert for a PostgreSQL banking database.

Database Schema:
${SCHEMA_DOC}

User Question (in Azerbaijani or English): ${userQuestion}

Generate a SQL query to answer this question. Follow these rules:
1. ALWAYS start with: SET search_path TO demo_bank;
2. Write ONLY valid PostgreSQL SQL
3. Use proper JOINs when accessing multiple tables
4. For aggregations, use GROUP BY appropriately
5. Format decimal values with 2 decimal places
6. Use meaningful column aliases
7. Return results ordered logically

IMPORTANT: Respond in this EXACT JSON format:
{
    "query": "SET search_path TO demo_bank; SELECT ...",
    "needs_chart": true/false,
    "chart_type": "bar/line/pie/scatter/null",
    "chart_config": {
        "x_column": "column_name_for_x_axis",
        "y_column": "column_name_for_y_axis",
        "title": "Chart Title",
        "xlabel": "X Axis Label",
        "ylabel": "Y Axis Label"
    },
    "explanation": "Brief explanation in Azerbaijani"
}

Guidelines for charts:
- Set needs_chart=true if query returns aggregated/statistical data suitable for visualization
- Use "bar" for comparisons (counts, sums by category)
- Use "line" for time series data
- Use "pie" for percentage/distribution (limit to <10 categories)
- Set needs_chart=false for individual record lookups or detailed lists

Generate the response now:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const jsonText = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonText);

    return parsed as QueryResponse;
  } catch (error) {
    console.error('Error generating query:', error);
    throw error;
  }
}
