# QueryBank AI Chatbot

An intelligent chatbot that answers questions about your banking database using AI-powered SQL query generation and automatic data visualization.

## Features

- **Natural Language Queries**: Ask questions in plain English
- **AI-Powered SQL Generation**: Uses Google Gemini AI to automatically generate SQL queries
- **Smart Visualization**: Automatically creates charts for aggregated data
- **Interactive Interface**: Easy-to-use command-line interface
- **Real-time Analysis**: Connects directly to your PostgreSQL database
- **Multiple Chart Types**: Bar charts, line charts, pie charts, and scatter plots

## Architecture

```
┌─────────────────┐
│  User Question  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Gemini AI     │  Reads database schema documentation
│ Query Generator │  Generates SQL query + chart config
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │  Executes SQL query
│    Database     │  Returns results
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Result Display │  Shows data in table format
│  + Chart Gen    │  Creates visualizations
└─────────────────┘
```

## Installation

### 1. Clone or download the repository

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Your `.env` file should already contain:

```
db_url=
```

### 4. Run the chatbot

```bash
python chatbot.py
```

## Usage

### Interactive Mode

Simply run the chatbot and start asking questions:

```bash
$ python chatbot.py
```

```
================================================================================
                         QueryBank AI Chatbot
================================================================================

Ask me anything about your banking data!
Type 'exit' or 'quit' to end the session.
Type 'examples' to see example questions.
================================================================================

Your question:
```

### Example Questions

1. **Customer Queries**

   - "How many customers do we have?"
   - "Show me all customers with their account balances"
   - "What is the average credit score of our customers?"
   - "Show me customers with account balance over $50,000"
   - "Which customers have more than 2 loans?"
2. **Loan Queries**

   - "Show me all active loans"
   - "What is the total outstanding loan balance by loan type?"
   - "What are the top 5 largest loans?"
   - "Show me loan distribution by type"
   - "Which loan types have the highest average interest rates?"
   - "How many loans are past due?"
3. **Transaction Queries**

   - "Show me transactions for customer John Smith"
   - "How many transactions were made in October 2024?"
   - "What is the total deposit amount by customer?"
   - "Show me all withdrawals over $1000"
   - "What's the transaction volume by type?"
4. **Aggregate & Analytics**

   - "Show me total outstanding loan balance by loan type" *(generates bar chart)*
   - "What's the distribution of account types?" *(generates pie chart)*
   - "Show customer balances by state" *(generates bar chart)*
   - "Compare loan amounts across loan officers" *(generates bar chart)*

## How It Works

### 1. Question Processing

When you ask a question, the chatbot:

- Sends your question to Gemini AI along with the database schema documentation
- AI analyzes the question and generates appropriate SQL query
- AI determines if visualization is needed and what type of chart

### 2. SQL Generation

The AI generates:

- Valid PostgreSQL SQL query
- Explanation of what the query does
- Chart configuration (if aggregated data)

Example:

```python
{
    "query": "SET search_path TO demo_bank; SELECT loan_type, SUM(outstanding_balance) as total_balance FROM loans WHERE loan_status = 'active' GROUP BY loan_type ORDER BY total_balance DESC;",
    "needs_chart": true,
    "chart_type": "bar",
    "chart_config": {
        "x_column": "loan_type",
        "y_column": "total_balance",
        "title": "Outstanding Loan Balance by Loan Type",
        "xlabel": "Loan Type",
        "ylabel": "Total Outstanding Balance ($)"
    },
    "explanation": "Aggregates outstanding loan balances by loan type for active loans"
}
```

### 3. Query Execution

- Connects to PostgreSQL database
- Executes generated SQL query
- Returns results as structured data

### 4. Result Display

- Shows results in table format
- If aggregated data: generates and displays chart
- Charts appear in separate window

### 5. Visualization

Automatically generates charts for:

- **Bar Charts**: Comparisons (counts, sums, averages by category)
- **Line Charts**: Time series data
- **Pie Charts**: Distribution/percentages
- **Scatter Plots**: Correlation analysis

## Code Structure

```
chatbot.py
├── DatabaseSchema          # Schema documentation for AI context
├── GeminiQueryGenerator    # AI query generation
├── DatabaseExecutor        # SQL query execution
├── ChartGenerator          # Data visualization
└── QueryBankChatbot        # Main chatbot orchestrator
```

### Key Components

#### `DatabaseSchema`

Contains the complete database schema documentation that's provided to the AI as context.

#### `GeminiQueryGenerator`

- Initializes Gemini AI model
- Generates SQL queries from natural language
- Determines chart requirements
- Returns structured response with query and visualization config

#### `DatabaseExecutor`

- Manages database connections
- Executes SQL queries safely
- Returns results as dictionaries
- Handles errors gracefully

#### `ChartGenerator`

- Creates matplotlib visualizations
- Supports multiple chart types
- Auto-formats data for visualization
- Adds labels and styling

#### `QueryBankChatbot`

- Main orchestrator class
- Handles user interaction
- Coordinates all components
- Displays results and charts

## Sample Session

```
Your question: What is the total outstanding loan balance by loan type?

================================================================================
Question: What is the total outstanding loan balance by loan type?
================================================================================

Generating SQL query...

Explanation: Aggregates outstanding loan balances grouped by loan type

Generated SQL:
--------------------------------------------------------------------------------
SET search_path TO demo_bank;
SELECT loan_type, SUM(outstanding_balance) as total_balance
FROM loans
WHERE loan_status = 'active'
GROUP BY loan_type
ORDER BY total_balance DESC;
--------------------------------------------------------------------------------

Executing query...

Results (5 rows):
--------------------------------------------------------------------------------
   loan_type  total_balance
    mortgage      340000.00
    business       85000.00
     student       50000.00
        auto       20000.00
    personal       12000.00
--------------------------------------------------------------------------------

Generating bar chart...
Chart displayed in new window.

================================================================================
```

## Chart Examples

The chatbot automatically generates charts for aggregated data:

### Bar Chart Example

Question: "Show me outstanding loan balance by loan type"

- X-axis: Loan types
- Y-axis: Total balance
- Shows value labels on top of bars

### Pie Chart Example

Question: "What's the distribution of account types?"

- Shows percentage of each account type
- Limited to top 10 categories for readability

### Line Chart Example

Question: "Show transaction volume by date"

- X-axis: Dates
- Y-axis: Transaction count
- Shows trends over time

## Customization

### Adding Custom Chart Types

Edit `ChartGenerator.generate_chart()` in `chatbot.py`:

```python
elif chart_type == 'your_custom_type':
    # Your custom visualization logic
    pass
```

### Modifying AI Behavior

Edit the prompt in `GeminiQueryGenerator.generate_query()` to:

- Change SQL generation style
- Adjust chart selection criteria
- Add custom instructions

### Adding More Schema Context

Update `DatabaseSchema.SCHEMA_DOC` to include:

- Additional tables
- Business rules
- Common query patterns

## Troubleshooting

### "No module named 'psycopg2'"

```bash
pip install psycopg2-binary
```

### "No module named 'google.generativeai'"

```bash
pip install google-generativeai
```

### Charts not displaying

- Ensure you have a GUI environment
- On Linux, you may need: `apt-get install python3-tk`
- On macOS, should work out of the box
- On Windows, should work out of the box

### Database connection errors

- Verify `.env` file exists and has correct credentials
- Check network connectivity
- Ensure database is accessible

### AI generates invalid SQL

- Check that schema documentation is up to date
- Try rephrasing your question
- More specific questions get better results

## Security Notes

- Database credentials are stored in `.env` file
- Never commit `.env` to version control
- Use read-only database user for production
- Validate SQL queries before execution in production
- Consider adding SQL injection protection for production use

## Performance Tips

1. **For large result sets**: Add limits to questions

   - Instead of: "Show all transactions"
   - Use: "Show the last 100 transactions"
2. **For complex aggregations**: Be specific

   - Good: "Total balance by loan type for active loans"
   - Better: "Top 5 loan types by outstanding balance"
3. **For charts**: Limit data points

   - Pie charts work best with < 10 categories
   - Bar charts readable with < 20 bars
   - Use TOP N or LIMIT clauses

## Future Enhancements

Potential features to add:

- [ ] Web interface (Flask/Streamlit)
- [ ] Export results to CSV/Excel
- [ ] Save chart images
- [ ] Query history
- [ ] Multi-turn conversations
- [ ] Advanced filtering options
- [ ] Real-time data updates
- [ ] User authentication
- [ ] Query templates
- [ ] Natural language result summaries

## Contributing

To add features:

1. Fork the repository
2. Create feature branch
3. Add your enhancement
4. Test thoroughly
5. Submit pull request

## License

This project is provided as-is for demonstration and educational purposes.

## Support

For issues or questions:

- Review the documentation
- Check example questions with `examples` command
- Examine the code comments
- Check database schema documentation in `DEMO_BANK_DOCUMENTATION.md`

---

**Built with:**

- Python 3.8+
- Google Gemini AI
- PostgreSQL
- Matplotlib/Seaborn
- Pandas

**Happy querying!**
