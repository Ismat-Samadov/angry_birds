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

export async function generateQuery(userQuestion: string, retryCount: number = 0): Promise<QueryResponse> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: retryCount > 0 ? 0.1 : 0.3, // Lower temperature on retry for more deterministic output
      maxOutputTokens: 1024,
    }
  });

  const prompt = `You are a SQL query generator for a PostgreSQL banking database.
${retryCount > 0 ? '\n⚠️ CRITICAL: Your previous response was not valid JSON. You MUST return ONLY a JSON object. NO explanations, NO text before or after, ONLY JSON.\n' : ''}

User Question: "${userQuestion}"

IMPORTANT: Only reject the question if it is:
1. A greeting (salam, hello, hi, etc.)
2. Random gibberish with no meaning (asdfjkl, sfgdsa, etc.)
3. Not related to banking data at all

If it's ANY question about customers, loans, transactions, balances, credit scores, or banking data (even if using words like "worst", "bad", "lowest"), you MUST generate a valid SQL query. Do NOT reject business questions just because they use negative words.

BUSINESS METRICS YOU MUST RECOGNIZE:
- CLV / LTV (Customer Lifetime Value) = Total transaction value per customer
- RFM (Recency, Frequency, Monetary) = Customer segmentation analysis
- CAC (Customer Acquisition Cost) = Cost to acquire customer (not available in this DB)
- Churn Rate = Customer attrition rate
- AOV (Average Order Value) = Average transaction amount
- ARPU (Average Revenue Per User) = Average revenue per customer

These are ALL valid business queries - generate appropriate SQL for them!

Database Schema (demo_bank):
- Table: customers
  Columns: customer_id, first_name, last_name, account_type, account_balance, account_status, credit_score

- Table: loans
  Columns: loan_id, customer_id (FK), loan_type, outstanding_balance, loan_status

- Table: transactions
  Columns: transaction_id, customer_id (FK), amount, transaction_type, transaction_date

Generate a response in this EXACT JSON format:
{
  "query": "SET search_path TO demo_bank; SELECT customer_id FROM customers LIMIT 10",
  "needs_chart": false,
  "chart_type": null,
  "chart_config": {
    "x_column": "column_name",
    "y_column": "column_name",
    "title": "Chart Title",
    "xlabel": "X axis label",
    "ylabel": "Y axis label"
  },
  "explanation": "Sorğu nəticəsinin izahı Azərbaycan dilində"
}

Important Rules:
1. Start SQL with "SET search_path TO demo_bank;"
2. After SET search_path, use table names WITHOUT schema prefix (write "customers", not "demo_bank.customers")
3. Use PostgreSQL syntax (not MySQL)
4. If the query returns data suitable for a chart (multiple rows with numeric values), set needs_chart to true
5. For charts: use "bar" for comparisons, "pie" for distributions, "line" for trends
6. In chart_config, use the EXACT column names from your SELECT query
7. Write explanation in Azerbaijani language
8. Return ONLY the JSON object, no additional text

Example 1 - Valid question: "Ən yüksək balansa malik müştərilər"
Response:
{
  "query": "SET search_path TO demo_bank; SELECT first_name, last_name, account_balance FROM customers ORDER BY account_balance DESC LIMIT 10",
  "needs_chart": true,
  "chart_type": "bar",
  "chart_config": {
    "x_column": "first_name",
    "y_column": "account_balance",
    "title": "Ən Yüksək Balansa Malik Müştərilər",
    "xlabel": "Müştəri",
    "ylabel": "Balans (₼)"
  },
  "explanation": "Ən yüksək hesab balansına malik 10 müştəri göstərilir."
}

Example 2 - Invalid input (greeting, gibberish): "salam" or "asdfjkl"
Response:
{
  "query": "ERROR",
  "needs_chart": false,
  "chart_type": null,
  "chart_config": null,
  "explanation": "Daxil etdiyiniz sorğu anlaşıqlı deyil. Zəhmət olmasa bank məlumatları haqqında konkret sual verin."
}

Example 3 - Valid question with negative words: "en pis musteri" or "lowest credit score"
Response:
{
  "query": "SET search_path TO demo_bank; SELECT first_name, last_name, credit_score, account_balance FROM customers ORDER BY credit_score ASC LIMIT 10",
  "needs_chart": true,
  "chart_type": "bar",
  "chart_config": {
    "x_column": "first_name",
    "y_column": "credit_score",
    "title": "Ən Aşağı Kredit Reytinqinə Malik Müştərilər",
    "xlabel": "Müştəri",
    "ylabel": "Kredit Reytinqi"
  },
  "explanation": "Ən aşağı kredit reytinqinə malik 10 müştəri göstərilir."
}

Example 4 - Complex analytical query: "RFM analizi" or "müşteri seqmentasiyası"
For RFM analysis (Recency, Frequency, Monetary), create a query that calculates:
- R (Recency): Days since last transaction
- F (Frequency): Number of transactions
- M (Monetary): Total transaction amount
Response:
{
  "query": "SET search_path TO demo_bank; SELECT c.customer_id, c.first_name, c.last_name, COUNT(t.transaction_id) as frequency, COALESCE(SUM(t.amount), 0) as monetary, COALESCE(CURRENT_DATE - MAX(t.transaction_date), 9999) as recency_days FROM customers c LEFT JOIN transactions t ON c.customer_id = t.customer_id GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY frequency DESC, monetary DESC LIMIT 20",
  "needs_chart": true,
  "chart_type": "bar",
  "chart_config": {
    "x_column": "first_name",
    "y_column": "monetary",
    "title": "Müştərilərin Ümumi Əməliyyat Dəyəri (RFM - Monetary)",
    "xlabel": "Müştəri",
    "ylabel": "Ümumi Məbləğ (₼)"
  },
  "explanation": "RFM analizi: Müştərilər əməliyyat sayı (F), ümumi dəyər (M) və son əməliyyat tarixi (R) əsasında təhlil edilir. 20 ən aktiv müştəri göstərilir."
}

Example 5 - Customer Lifetime Value: "CLV hesabla" or "LTV göstər" or "müştəri həyat boyu dəyəri"
CLV (Customer Lifetime Value) and LTV (Lifetime Value) are the SAME metric - total transaction value per customer.
Response:
{
  "query": "SET search_path TO demo_bank; SELECT c.customer_id, c.first_name, c.last_name, COALESCE(SUM(t.amount), 0) as lifetime_value FROM customers c LEFT JOIN transactions t ON c.customer_id = t.customer_id GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY lifetime_value DESC LIMIT 20",
  "needs_chart": true,
  "chart_type": "bar",
  "chart_config": {
    "x_column": "first_name",
    "y_column": "lifetime_value",
    "title": "Müştərilərin Həyat Boyu Dəyəri (CLV/LTV)",
    "xlabel": "Müştəri",
    "ylabel": "Həyat Boyu Dəyər (₼)"
  },
  "explanation": "CLV (Customer Lifetime Value): Hər müştərinin bütün əməliyyatlarının ümumi dəyəri. Ən yüksək CLV-yə malik 20 müştəri göstərilir."
}

IMPORTANT REMINDER: You MUST return ONLY valid JSON. Do NOT include any explanatory text before or after the JSON. Do NOT use markdown formatting. Return ONLY the JSON object starting with { and ending with }.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Check if response is empty
    if (!text || text.trim().length === 0) {
      console.error('AI returned empty response!');
      console.error('Result:', JSON.stringify(result, null, 2));
      console.error('Response candidates:', response.candidates);

      // Check for safety blocks or other issues
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        console.error('Candidate:', JSON.stringify(candidate, null, 2));
      }

      // Return a helpful error instead of retrying with empty response
      return {
        query: 'ERROR',
        needs_chart: false,
        chart_type: null,
        explanation: 'AI xidməti cavab vermədi. Zəhmət olmasa bir az sonra yenidən cəhd edin və ya sualınızı sadələşdirin.'
      };
    }

    console.log('AI Response:', text.substring(0, 300)); // Debug

    // Extract JSON from response - try multiple patterns
    let jsonText = '';

    // Pattern 1: JSON in markdown code block with json tag
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
        } else {
          // Pattern 4: JSON might be after some text, look for { ... } more aggressively
          const aggressiveMatch = text.match(/(\{[^{}]*\{[^{}]*\}[^{}]*\}|\{[^{}]*\})/);
          if (aggressiveMatch) {
            jsonText = aggressiveMatch[0];
          }
        }
      }
    }

    if (!jsonText) {
      console.error('Failed to extract JSON from response:', text);
      console.error('Full AI response:', text);

      // RETRY LOGIC: Try one more time with stricter instructions
      if (retryCount === 0) {
        console.warn('No JSON found, retrying with stricter prompt...');
        return generateQuery(userQuestion, 1);
      }

      // FALLBACK: If AI didn't return JSON after retry, check if it's trying to answer the question
      // If the response mentions CLV, LTV, RFM, etc., return a helpful error
      const lowerText = text.toLowerCase();
      if (lowerText.includes('clv') || lowerText.includes('ltv') ||
          lowerText.includes('lifetime') || lowerText.includes('həyat boyu') ||
          lowerText.includes('rfm') || lowerText.includes('recency')) {
        return {
          query: 'ERROR',
          needs_chart: false,
          chart_type: null,
          explanation: 'AI cavab formatı düzgün deyil. Zəhmət olmasa sorğunu yenidən cəhd edin. (Metrika aşkar edildi, lakin JSON formatı düzgün deyil)'
        };
      }

      throw new Error('No JSON found in response after retry. AI returned: ' + text.substring(0, 100));
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Attempted to parse:', jsonText);

      // RETRY on parse error too
      if (retryCount === 0) {
        console.warn('JSON parse failed, retrying with stricter prompt...');
        return generateQuery(userQuestion, 1);
      }

      throw new Error('Failed to parse JSON: ' + jsonText.substring(0, 100));
    }

    return parsed as QueryResponse;
  } catch (error) {
    console.error('Error generating query:', error);
    throw error;
  }
}
