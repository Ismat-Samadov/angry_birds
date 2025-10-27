"""
QueryBank Chatbot - AI-powered database query assistant
Uses Gemini AI to generate SQL queries and visualize data
"""

import os
import sys
import json
import re
from typing import Dict, List, Optional, Any, Tuple
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor
import google.generativeai as genai
import matplotlib
matplotlib.use('Agg')  # Use Agg backend for non-GUI environments
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure styling
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['font.size'] = 10


class DatabaseSchema:
    """Holds the database schema documentation for context"""

    SCHEMA_DOC = """
# Demo Bank Database Schema

## Schema: demo_bank

### Table: customers
Stores information about bank customers

Columns:
- customer_id (SERIAL PRIMARY KEY): Unique customer identifier
- first_name (VARCHAR(100)): Customer's first name
- last_name (VARCHAR(100)): Customer's last name
- date_of_birth (DATE): Customer's date of birth
- email (VARCHAR(255) UNIQUE): Customer's email address
- phone_number (VARCHAR(20)): Phone number
- street_address (VARCHAR(255)): Street address
- city (VARCHAR(100)): City
- state (VARCHAR(100)): State
- postal_code (VARCHAR(20)): Postal code
- country (VARCHAR(100)): Country (default 'USA')
- account_number (VARCHAR(20) UNIQUE): Unique account number
- account_type (VARCHAR(50)): Account type ('checking', 'savings', 'business', 'investment')
- account_balance (DECIMAL(15,2)): Current account balance
- ssn_last_four (CHAR(4)): Last 4 digits of SSN
- id_type (VARCHAR(50)): ID type ('passport', 'drivers_license', 'national_id')
- id_number (VARCHAR(50)): ID number
- account_status (VARCHAR(20)): Account status ('active', 'inactive', 'suspended', 'closed')
- credit_score (INTEGER): Credit score (300-850)
- created_at (TIMESTAMP): Record creation timestamp
- updated_at (TIMESTAMP): Last update timestamp
- last_login (TIMESTAMP): Last login timestamp

### Table: loans
Stores loan information

Columns:
- loan_id (SERIAL PRIMARY KEY): Unique loan identifier
- customer_id (INTEGER FOREIGN KEY -> customers.customer_id): Customer reference
- loan_number (VARCHAR(20) UNIQUE): Unique loan number
- loan_type (VARCHAR(50)): Loan type ('personal', 'mortgage', 'auto', 'student', 'business', 'home_equity')
- loan_purpose (TEXT): Purpose of the loan
- principal_amount (DECIMAL(15,2)): Original loan amount
- interest_rate (DECIMAL(5,2)): Annual interest rate
- loan_term_months (INTEGER): Loan term in months
- monthly_payment (DECIMAL(15,2)): Monthly payment amount
- outstanding_balance (DECIMAL(15,2)): Current outstanding balance
- total_paid (DECIMAL(15,2)): Total amount paid
- application_date (DATE): Application date
- approval_date (DATE): Approval date
- disbursement_date (DATE): Disbursement date
- first_payment_date (DATE): First payment date
- maturity_date (DATE): Maturity date
- loan_status (VARCHAR(20)): Loan status ('pending', 'approved', 'active', 'paid_off', 'defaulted', 'rejected')
- payment_status (VARCHAR(20)): Payment status ('current', 'late', 'defaulted', 'grace_period')
- days_past_due (INTEGER): Days past due
- collateral_type (VARCHAR(100)): Type of collateral
- collateral_value (DECIMAL(15,2)): Value of collateral
- loan_officer_name (VARCHAR(200)): Loan officer name
- loan_officer_id (VARCHAR(50)): Loan officer ID
- created_at (TIMESTAMP): Record creation timestamp
- updated_at (TIMESTAMP): Last update timestamp
- last_payment_date (DATE): Last payment date

### Table: transactions
Stores all financial transactions

Columns:
- transaction_id (SERIAL PRIMARY KEY): Unique transaction identifier
- customer_id (INTEGER FOREIGN KEY -> customers.customer_id): Customer reference
- loan_id (INTEGER FOREIGN KEY -> loans.loan_id): Optional loan reference
- transaction_reference (VARCHAR(50) UNIQUE): Unique transaction reference
- transaction_type (VARCHAR(50)): Transaction type ('deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'loan_disbursement', 'loan_payment', 'interest_credit', 'fee_debit', 'refund', 'reversal')
- amount (DECIMAL(15,2)): Transaction amount
- currency (VARCHAR(3)): Currency code (default 'USD')
- balance_before (DECIMAL(15,2)): Balance before transaction
- balance_after (DECIMAL(15,2)): Balance after transaction
- description (TEXT): Transaction description
- notes (TEXT): Additional notes
- transaction_method (VARCHAR(50)): Transaction method ('cash', 'check', 'wire_transfer', 'ach', 'debit_card', 'credit_card', 'online', 'mobile_app', 'atm')
- counterparty_account (VARCHAR(50)): Counterparty account number
- counterparty_name (VARCHAR(200)): Counterparty name
- counterparty_bank (VARCHAR(200)): Counterparty bank
- branch_code (VARCHAR(20)): Branch code
- atm_id (VARCHAR(50)): ATM ID
- ip_address (INET): IP address
- device_id (VARCHAR(100)): Device ID
- transaction_status (VARCHAR(20)): Transaction status ('pending', 'processing', 'completed', 'failed', 'reversed', 'cancelled')
- transaction_date (DATE): Transaction date
- transaction_time (TIMESTAMP): Transaction timestamp
- posted_date (DATE): Posted date
- value_date (DATE): Value date
- created_at (TIMESTAMP): Record creation timestamp
- processed_by (VARCHAR(100)): Processed by
- authorized_by (VARCHAR(100)): Authorized by
- is_flagged (BOOLEAN): Fraud flag
- flag_reason (TEXT): Flag reason

### Views:
- customer_account_summary: Customer overview with loans and transactions
- active_loans_summary: Active loans with customer details
- recent_transactions: Recent transaction history

### Important Notes:
- Always use schema name: demo_bank
- Set search path: SET search_path TO demo_bank;
- JOIN customers and loans: customers.customer_id = loans.customer_id
- JOIN customers and transactions: customers.customer_id = transactions.customer_id
- JOIN loans and transactions: loans.loan_id = transactions.loan_id
"""


class GeminiQueryGenerator:
    """Generates SQL queries using Gemini AI"""

    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def generate_query(self, user_question: str) -> Dict[str, Any]:
        """
        Generate SQL query from user question
        Returns dict with 'query', 'needs_chart', 'chart_type', 'explanation'
        """
        prompt = f"""You are a SQL expert for a PostgreSQL banking database.

Database Schema:
{DatabaseSchema.SCHEMA_DOC}

User Question: {user_question}

Generate a SQL query to answer this question. Follow these rules:
1. ALWAYS start with: SET search_path TO demo_bank;
2. Write ONLY valid PostgreSQL SQL
3. Use proper JOINs when accessing multiple tables
4. For aggregations, use GROUP BY appropriately
5. Format decimal values with 2 decimal places
6. Use meaningful column aliases
7. Return results ordered logically

IMPORTANT: Respond in this EXACT JSON format:
{{
    "query": "SET search_path TO demo_bank; SELECT ...",
    "needs_chart": true/false,
    "chart_type": "bar/line/pie/scatter/null",
    "chart_config": {{
        "x_column": "column_name_for_x_axis",
        "y_column": "column_name_for_y_axis",
        "title": "Chart Title",
        "xlabel": "X Axis Label",
        "ylabel": "Y Axis Label"
    }},
    "explanation": "Brief explanation of what the query does"
}}

Guidelines for charts:
- Set needs_chart=true if query returns aggregated/statistical data suitable for visualization
- Use "bar" for comparisons (counts, sums by category)
- Use "line" for time series data
- Use "pie" for percentage/distribution (limit to <10 categories)
- Set needs_chart=false for individual record lookups or detailed lists

Generate the response now:"""

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            # Extract JSON from response (handle markdown code blocks)
            json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
            else:
                # Try to find JSON object directly
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    response_text = json_match.group(0)

            result = json.loads(response_text)

            # Validate required fields
            if 'query' not in result:
                raise ValueError("No query in response")

            return result

        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}")
            print(f"Response text: {response_text}")
            # Return a safe default
            return {
                "query": "SET search_path TO demo_bank; SELECT 'Error parsing AI response' as error;",
                "needs_chart": False,
                "chart_type": None,
                "explanation": f"Error parsing AI response: {str(e)}"
            }
        except Exception as e:
            print(f"Error generating query: {e}")
            return {
                "query": "SET search_path TO demo_bank; SELECT 'Error generating query' as error;",
                "needs_chart": False,
                "chart_type": None,
                "explanation": f"Error: {str(e)}"
            }


class DatabaseExecutor:
    """Executes SQL queries on the database"""

    def __init__(self, db_url: str):
        self.db_url = db_url

    def execute_query(self, query: str) -> Tuple[List[Dict], List[str]]:
        """
        Execute query and return results with column names
        Returns: (rows, column_names)
        """
        conn = None
        try:
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor(cursor_factory=RealDictCursor)

            # Execute query (might be multiple statements)
            cursor.execute(query)

            # Get results
            try:
                rows = cursor.fetchall()
                column_names = [desc[0] for desc in cursor.description] if cursor.description else []

                # Convert RealDictRow to regular dict
                results = [dict(row) for row in rows]

                return results, column_names
            except psycopg2.ProgrammingError:
                # Query didn't return results (like SET command)
                return [], []

        except Exception as e:
            print(f"Database error: {e}")
            return [{"error": str(e)}], ["error"]
        finally:
            if conn:
                conn.close()


class ChartGenerator:
    """Generates charts from query results"""

    @staticmethod
    def generate_chart(data: List[Dict], config: Dict[str, Any], chart_type: str):
        """Generate and display a chart based on data and configuration"""

        if not data or len(data) == 0:
            print("No data to visualize")
            return

        # Convert to DataFrame
        df = pd.DataFrame(data)

        # Get configuration with defaults
        x_col = config.get('x_column', df.columns[0])
        y_col = config.get('y_column', df.columns[1] if len(df.columns) > 1 else df.columns[0])
        title = config.get('title', 'Data Visualization')
        xlabel = config.get('xlabel', x_col)
        ylabel = config.get('ylabel', y_col)

        # Ensure columns exist
        if x_col not in df.columns:
            x_col = df.columns[0]
        if y_col not in df.columns and len(df.columns) > 1:
            y_col = df.columns[1]
        elif y_col not in df.columns:
            y_col = df.columns[0]

        plt.figure(figsize=(12, 6))

        try:
            if chart_type == 'bar':
                # Convert to numeric if needed
                df[y_col] = pd.to_numeric(df[y_col], errors='coerce')

                plt.bar(range(len(df)), df[y_col], color='steelblue', alpha=0.8)
                plt.xticks(range(len(df)), df[x_col], rotation=45, ha='right')

                # Add value labels on bars
                for i, v in enumerate(df[y_col]):
                    if pd.notna(v):
                        plt.text(i, v, f'{v:,.2f}', ha='center', va='bottom', fontsize=9)

            elif chart_type == 'line':
                df[y_col] = pd.to_numeric(df[y_col], errors='coerce')
                plt.plot(df[x_col], df[y_col], marker='o', linewidth=2, markersize=8, color='steelblue')
                plt.xticks(rotation=45, ha='right')
                plt.grid(True, alpha=0.3)

            elif chart_type == 'pie':
                df[y_col] = pd.to_numeric(df[y_col], errors='coerce')

                # Limit to top 10 for readability
                if len(df) > 10:
                    df = df.nlargest(10, y_col)
                    title += " (Top 10)"

                colors = plt.cm.Set3(range(len(df)))
                plt.pie(df[y_col], labels=df[x_col], autopct='%1.1f%%',
                       colors=colors, startangle=90)
                plt.axis('equal')

            elif chart_type == 'scatter':
                df[x_col] = pd.to_numeric(df[x_col], errors='coerce')
                df[y_col] = pd.to_numeric(df[y_col], errors='coerce')
                plt.scatter(df[x_col], df[y_col], s=100, alpha=0.6, color='steelblue')
                plt.grid(True, alpha=0.3)

            else:
                print(f"Unknown chart type: {chart_type}")
                return

            plt.title(title, fontsize=14, fontweight='bold', pad=20)
            plt.xlabel(xlabel, fontsize=11)
            plt.ylabel(ylabel, fontsize=11)
            plt.tight_layout()

            # Save chart to file instead of displaying
            import tempfile
            import time
            timestamp = int(time.time())
            chart_file = f"/tmp/querybank_chart_{timestamp}.png"
            plt.savefig(chart_file, dpi=150, bbox_inches='tight')
            print(f"Chart saved to: {chart_file}")
            plt.close()

        except Exception as e:
            print(f"Error generating chart: {e}")
            print(f"Data columns: {df.columns.tolist()}")


class QueryBankChatbot:
    """Main chatbot class"""

    def __init__(self):
        # Load configuration
        self.db_url = os.getenv('db_url')
        self.gemini_api_key = os.getenv('gemini_api_key')

        if not self.db_url:
            raise ValueError("db_url not found in .env file")
        if not self.gemini_api_key:
            raise ValueError("gemini_api_key not found in .env file")

        # Initialize components
        self.query_generator = GeminiQueryGenerator(self.gemini_api_key)
        self.db_executor = DatabaseExecutor(self.db_url)
        self.chart_generator = ChartGenerator()

        print("QueryBank Chatbot initialized successfully!")

    def process_question(self, question: str):
        """Process a user question end-to-end"""

        print(f"\n{'='*80}")
        print(f"Question: {question}")
        print(f"{'='*80}\n")

        # Step 1: Generate SQL query using AI
        print("Generating SQL query...")
        query_info = self.query_generator.generate_query(question)

        print(f"\nExplanation: {query_info.get('explanation', 'N/A')}")
        print(f"\nGenerated SQL:")
        print("-" * 80)
        print(query_info['query'])
        print("-" * 80)

        # Step 2: Execute query
        print("\nExecuting query...")
        results, columns = self.db_executor.execute_query(query_info['query'])

        if not results:
            print("\nNo results returned.")
            return

        # Step 3: Display results
        print(f"\nResults ({len(results)} rows):")
        print("-" * 80)

        # Display as table
        if results and 'error' not in results[0]:
            df = pd.DataFrame(results)
            print(df.to_string(index=False))
        else:
            print(json.dumps(results, indent=2, default=str))

        print("-" * 80)

        # Step 4: Generate chart if needed
        if query_info.get('needs_chart') and query_info.get('chart_type'):
            print(f"\nGenerating {query_info['chart_type']} chart...")
            chart_config = query_info.get('chart_config', {})
            self.chart_generator.generate_chart(results, chart_config, query_info['chart_type'])

        print("\n" + "="*80 + "\n")

    def run_interactive(self):
        """Run interactive chatbot session"""

        print("\n" + "="*80)
        print(" "*25 + "QueryBank AI Chatbot")
        print("="*80)
        print("\nAsk me anything about your banking data!")
        print("Type 'exit' or 'quit' to end the session.")
        print("Type 'examples' to see example questions.")
        print("="*80 + "\n")

        while True:
            try:
                question = input("Your question: ").strip()

                if not question:
                    continue

                if question.lower() in ['exit', 'quit', 'q']:
                    print("\nGoodbye!")
                    break

                if question.lower() == 'examples':
                    self.show_examples()
                    continue

                self.process_question(question)

            except KeyboardInterrupt:
                print("\n\nGoodbye!")
                break
            except Exception as e:
                print(f"\nError: {e}")
                import traceback
                traceback.print_exc()

    def show_examples(self):
        """Show example questions"""
        examples = [
            "How many customers do we have?",
            "Show me all active loans",
            "What is the total outstanding loan balance by loan type?",
            "Show me transactions for customer John Smith",
            "What is the average credit score of our customers?",
            "Show me customers with account balance over $50,000",
            "What are the top 5 largest loans?",
            "Show me loan distribution by type",
            "How many transactions were made in October 2024?",
            "What is the total deposit amount by customer?",
            "Show me customers with their total loan amounts",
            "Which loan types have the highest average interest rates?",
        ]

        print("\n" + "="*80)
        print("Example Questions:")
        print("="*80)
        for i, example in enumerate(examples, 1):
            print(f"{i}. {example}")
        print("="*80 + "\n")


def main():
    """Main entry point"""
    try:
        chatbot = QueryBankChatbot()
        chatbot.run_interactive()
    except Exception as e:
        print(f"Failed to initialize chatbot: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
