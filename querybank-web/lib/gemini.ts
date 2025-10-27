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

  const prompt = `You are a PostgreSQL expert. Generate a SQL query to answer this question: "${userQuestion}"

Database schema (demo_bank):
- customers: customer_id, first_name, last_name, account_type, account_balance, account_status, credit_score
- loans: loan_id, customer_id, loan_type, outstanding_balance, loan_status
- transactions: transaction_id, customer_id, amount, transaction_type, transaction_date

Return ONLY valid JSON (no markdown, no explanation outside JSON):
{
  "query": "SET search_path TO demo_bank; SELECT ...",
  "needs_chart": true or false,
  "chart_type": "bar" or "line" or "pie" or null,
  "chart_config": {
    "x_column": "column_name",
    "y_column": "column_name",
    "title": "Chart Title",
    "xlabel": "X Label",
    "ylabel": "Y Label"
  },
  "explanation": "Brief explanation in Azerbaijani"
}

Rules:
1. Start query with "SET search_path TO demo_bank;"
2. After SET search_path, use table names WITHOUT schema prefix (customers, NOT demo_bank.customers)
3. Use proper PostgreSQL syntax
4. For chart_config, use actual column names from the SELECT query
5. Return explanation in Azerbaijani language`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI Response:', text.substring(0, 200)); // Debug

    // Extract JSON from response - try multiple patterns
    let jsonText = '';

    // Pattern 1: JSON in markdown code block
    const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownMatch) {
      jsonText = markdownMatch[1];
    } else {
      // Pattern 2: JSON in plain code block
      const codeMatch = text.match(/```\s*([\s\S]*?)\s*```/);
      if (codeMatch) {
        jsonText = codeMatch[1];
      } else {
        // Pattern 3: Raw JSON (find first { to last })
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }
      }
    }

    if (!jsonText) {
      console.error('Failed to extract JSON from response:', text);
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonText.trim());

    return parsed as QueryResponse;
  } catch (error) {
    console.error('Error generating query:', error);
    throw error;
  }
}
