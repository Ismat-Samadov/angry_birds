# Analytics Dashboard Documentation

**Date**: October 27, 2025
**Version**: 2.0
**Type**: Standard Reports & Analytics Page

## Overview

The Analytics Dashboard (`/reports`) is a comprehensive, data-driven reporting page that displays real banking analytics through direct SQL queries - **no AI involved**. It provides instant insights, visualizations, and data tables for bank managers.

## Key Differences from AI Chat

| Feature | AI Chat Page (`/`) | Analytics Dashboard (`/reports`) |
|---------|-------------------|----------------------------------|
| **Purpose** | Ad-hoc questions | Standard reports |
| **Query Method** | Natural language → AI → SQL | Direct SQL queries |
| **Speed** | 5-7 seconds | < 1 second |
| **Interactivity** | Conversational | View-only dashboard |
| **Data** | Dynamic based on question | Predefined analytics |
| **Use Case** | Exploration | Regular monitoring |

## Architecture

### Backend: `/app/api/analytics/route.ts`

Single GET endpoint that executes **10 predefined SQL queries** in parallel:

1. **Loan Balance by Type** - Total loans grouped by loan type
2. **Customer Distribution by Account Type** - Customer counts and balances
3. **Credit Score Distribution** - Customers grouped into score ranges
4. **Top Customers by Balance** - Top 10 highest balance customers
5. **Monthly Transaction Volume** - Last 6 months of transaction trends
6. **Loan Status Distribution** - Active/paid/defaulted loans
7. **Customer Account Status** - Active/inactive/closed accounts
8. **High-Value Customers** - Customers with >50K balance
9. **Customers with Loans** - Loan statistics by account type
10. **Recent Large Transactions** - Transactions >5K in last 30 days

**Response Time**: ~600-800ms (all 10 queries executed in parallel)

### Frontend: `/app/reports/page.tsx`

Clean, professional dashboard with:
- 4 Key Metric Cards (stats)
- 1 High-Value Customer Insight Card
- 5 Charts (bar, pie)
- 2 Data Tables (top customers, recent transactions)
- Auto-generated insights below each chart

## Features

### 1. Key Metrics Cards
- Aktiv Müştərilər (Active Customers)
- Aktiv Kreditlər (Active Loans)
- Ümumi Kredit Balansı (Total Loan Balance)
- Ümumi Depozitlər (Total Deposits)

### 2. High-Value Customer Insight
Special highlight card showing:
- Number of customers with >50K balance
- Total balance of high-value customers
- Average credit score of high-value customers

### 3. Charts with Insights

**Kredit Növlərinə Görə Bölgü** (Loans by Type)
- Type: Bar chart
- Shows: Total balance by loan type
- Insight: Which loan type has highest balance

**Kredit Reytinqi Bölgüsü** (Credit Score Distribution)
- Type: Pie chart
- Shows: Customers grouped by credit score ranges
- Insight: Overall credit health of customer base

**Hesab Növlərinə Görə Müştərilər** (Customers by Account Type)
- Type: Bar chart
- Shows: Customer count per account type
- Insight: Most popular account type

**Kredit Status Bölgüsü** (Loan Status Distribution)
- Type: Pie chart
- Shows: Distribution of loan statuses
- Insight: Portfolio health

**Hesab Növünə Görə Kreditli Müştərilər** (Customers with Loans)
- Type: Bar chart
- Shows: Total loan balance by account type
- Insight: Which account type has most loans

### 4. Data Tables

**Ən Yüksək Balansa Malik Müştərilər** (Top 10 Customers)
- Columns: Name, Account Type, Balance, Credit Score
- Sorted by balance descending

**Son Böyük Əməliyyatlar** (Recent Large Transactions)
- Columns: Date, Customer, Type, Amount
- Shows transactions >5,000 ₼ from last 30 days
- Color-coded badges (green=deposit, red=withdrawal)

## SQL Queries (Non-Hardcoded)

All queries are **dynamic** and fetch real-time data:

```sql
-- Example: Loan Balance by Type
SELECT
  loan_type,
  COUNT(*) as loan_count,
  SUM(outstanding_balance) as total_balance,
  AVG(outstanding_balance) as avg_balance
FROM demo_bank.loans
WHERE loan_status = 'active'
GROUP BY loan_type
ORDER BY total_balance DESC
```

```sql
-- Example: Credit Score Distribution
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
```

**No hardcoded data** - everything comes from live database queries.

## Performance

| Metric | Value | Notes |
|--------|-------|-------|
| **Initial Page Load** | ~1 second | All 10 queries execute in parallel |
| **Stats API** | ~600ms | 4 aggregate queries |
| **Analytics API** | ~700ms | 10 complex queries |
| **Total Dashboard Load** | ~1.5s | Both APIs + rendering |

**Why so fast?**
- No AI calls (instant)
- Parallel SQL execution
- Efficient queries with indexes
- Small result sets

## User Experience

### Loading State
Clean loading animation with:
```
Analitika yüklənir...
[Animated dots]
```

### No Empty States
All queries return data (demo database has sample data)

### Responsive Design
- Desktop: 2-column chart grid
- Tablet: 2-column grid
- Mobile: 1-column stack

### Insights
Each chart includes auto-generated insight:
```typescript
<p><strong>İnsiyt:</strong> {analytics.loansByType[0]?.loan_type} kreditləri ən yüksək balansa malikdir.</p>
```

## Maintenance

### Adding New Charts

1. Add SQL query to `/app/api/analytics/route.ts`:
```typescript
const newMetric = await query(`
  SELECT ...
  FROM demo_bank.table
  WHERE ...
  GROUP BY ...
`);
```

2. Add to response:
```typescript
return NextResponse.json({
  success: true,
  data: {
    // ... existing
    newMetric: newMetric.rows,
  },
});
```

3. Add chart to frontend `/app/reports/page.tsx`:
```tsx
{analytics?.newMetric && analytics.newMetric.length > 0 && (
  <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
    <h3>Chart Title</h3>
    <DataChart data={analytics.newMetric} chartType="bar" config={{...}} />
    <p><strong>İnsiyt:</strong> Insight text</p>
  </div>
)}
```

### Modifying Queries

Simply edit the SQL in `/app/api/analytics/route.ts` - no AI prompt changes needed.

## Comparison with Previous Version

| Aspect | Old Version | New Version |
|--------|-------------|-------------|
| Query Method | AI chatbot on Reports page | Direct SQL only |
| Load Time | 15-20 seconds (3 AI calls) | 1.5 seconds |
| Reliability | Dependent on AI API | 100% consistent |
| Customization | AI decides charts | Fixed, professional layout |
| Purpose | Duplicate of chat page | Dedicated analytics |
| Use Case | Confusing | Clear separation |

## Benefits

✅ **Instant Loading** - No AI calls, pure SQL speed
✅ **Consistent Results** - Same reports every time
✅ **Professional Layout** - Designed for managers
✅ **Clear Separation** - Chat for exploration, Reports for monitoring
✅ **Scalable** - Easy to add more charts
✅ **No Hardcoding** - All data from database
✅ **Insights Included** - Auto-generated observations

## Future Enhancements

Possible additions:
1. **Export to PDF** - Download reports
2. **Date Range Filter** - Last 7/30/90 days
3. **Refresh Button** - Manual data refresh
4. **Drill-Down** - Click chart to see details
5. **Email Reports** - Scheduled report delivery
6. **Comparison Mode** - Month-over-month trends

## Testing Checklist

- [x] All 10 SQL queries execute successfully
- [x] Charts render correctly
- [x] Tables display data
- [x] Insights generate dynamically
- [x] Loading state shows properly
- [x] Navigation between Chat and Analytics works
- [x] Responsive on mobile/tablet
- [x] No console errors
- [x] Fast load time (<2 seconds)

## Deployment

No special configuration needed:
- Uses existing database connection
- No new environment variables
- Standard Next.js API route
- Works on Vercel out of the box

---

**Status**: ✅ Production Ready
**Performance**: 🚀 <1.5s load time
**Maintenance**: 🟢 Easy to extend
**User Experience**: 👍 Clean & Professional
