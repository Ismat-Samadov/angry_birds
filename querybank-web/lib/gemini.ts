import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SCHEMA_DOC = `Schema: demo_bank
Tables: customers(customer_id, first_name, last_name, account_type, account_balance, account_status, credit_score), loans(loan_id, customer_id FK, loan_type, outstanding_balance, loan_status), transactions(transaction_id, customer_id FK, amount, transaction_type, transaction_date)`;

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
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1024,
    }
  });

  const prompt = `PostgreSQL query for: ${userQuestion}

Schema demo_bank: customers(customer_id,first_name,last_name,account_type,account_balance,account_status,credit_score), loans(loan_id,customer_id,loan_type,outstanding_balance,loan_status), transactions(transaction_id,customer_id,amount,transaction_type,transaction_date)

Return only JSON:
{"query":"SET search_path TO demo_bank; SELECT ...","needs_chart":true/false,"chart_type":"bar/line/pie/null","chart_config":{"x_column":"col","y_column":"col","title":"text","xlabel":"text","ylabel":"text"},"explanation":"Azerbaijani"}

Note: After SET search_path, use table names WITHOUT schema prefix.`;

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
