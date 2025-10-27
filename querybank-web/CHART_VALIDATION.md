# Chart Validation System

## Overview

The application now includes **intelligent chart validation** that checks whether a chart should be displayed **BEFORE** showing it to the user. This prevents horrible or confusing chart displays.

## Problem Solved

### Before Chart Validation:
❌ AI suggests a chart → We blindly show it → Chart looks horrible
- Single number shown as a bar chart
- 100 categories crammed into one pie chart
- Wrong column names causing empty charts
- Non-numeric data trying to plot on Y-axis

### After Chart Validation:
✅ AI suggests a chart → **We validate it** → Only show if it looks good
- Single values: Show only as text, no chart
- Too many categories: Either disable or switch chart type
- Missing columns: Auto-detect correct columns
- Invalid data: Disable chart, show only table

---

## Validation Rules

### Rule 1: Must Have Data
```typescript
if (!data || data.length === 0) {
  return { isValid: false, reason: 'No data' };
}
```
**Result**: Chart disabled, only show explanation

---

### Rule 2: Single Value Results
```typescript
if (data.length === 1 && numericValues.length === 1) {
  return { isValid: false, reason: 'Single value result' };
}
```

**Example:**
```
Question: "Neçə aktiv müştərimiz var?"
Data: [{ active_customer_count: "5" }]
```
**Decision**: ❌ No chart needed
**Display**: Only show "5" in a table

**Why**: A bar chart with one bar showing "5" looks silly. Just show the number.

---

### Rule 3: Pie Chart Category Limit
```typescript
if (chartType === 'pie' && data.length > 10) {
  console.log(`Pie chart has too many categories (${data.length}), switching to bar chart`);
  return { isValid: true, chartType: 'bar', chartConfig };
}
```

**Example:**
```
Question: "Show all customer types"
Data: 50 different customer types
AI says: "pie chart"
```
**Decision**: ✅ Switch to bar chart
**Display**: Bar chart instead of unreadable pie

**Why**: Pie charts with >10 slices are impossible to read. Bar charts handle more categories better.

---

### Rule 4: Column Name Validation
```typescript
if (chartConfig.x_column && !columns.includes(chartConfig.x_column)) {
  // Try to find a suitable replacement
  const textColumn = columns.find(col => isNaN(parseFloat(firstRow[col])));
  if (textColumn) {
    chartConfig = { ...chartConfig, x_column: textColumn };
  } else {
    return { isValid: false, reason: `X column not found` };
  }
}
```

**Example:**
```
AI config: { x_column: "customer_name", y_column: "total" }
Actual data: { full_name: "John", amount: 100 }
```
**Decision**: ✅ Auto-fix
**Action**: Use "full_name" for x-axis instead
**Display**: Chart with correct column

**Why**: AI might use a different column name than what the query returns. We auto-detect and fix it.

---

### Rule 5: Numeric Y-Axis Validation
```typescript
const hasValidNumbers = data.some(row =>
  !isNaN(parseFloat(String(row[yColumn])))
);
if (!hasValidNumbers) {
  return { isValid: false, reason: 'Y column has no numeric data' };
}
```

**Example:**
```
Data: [
  { customer: "John", status: "active" },
  { customer: "Sarah", status: "inactive" }
]
AI wants: Plot "status" on Y-axis
```
**Decision**: ❌ No chart
**Display**: Only table

**Why**: You can't plot text values like "active", "inactive" on a numeric axis. Chart would be broken.

---

### Rule 6: Too Many Data Points
```typescript
if ((chartType === 'line' || chartType === 'bar') && data.length > 50) {
  return { isValid: false, reason: 'Too many data points (>50)' };
}
```

**Example:**
```
Question: "Show all transactions"
Data: 1000 transactions
AI says: "bar chart"
```
**Decision**: ❌ No chart
**Display**: Only table (with pagination if needed)

**Why**: 1000 bars on a chart are unreadable. Table is better for large datasets.

**Note**: For time-series data over time, line charts can handle more points, but we still limit to 50 for clarity.

---

### Rule 7: Duplicate X-Axis Values (Warning Only)
```typescript
const xValues = data.map(row => row[chartConfig.x_column]);
const uniqueXValues = new Set(xValues);
if (xValues.length !== uniqueXValues.size) {
  console.log('Duplicate x-axis values detected, chart might be confusing');
  // Don't fail, but log warning
}
```

**Example:**
```
Data: [
  { month: "January", sales: 100 },
  { month: "January", sales: 200 },  // Duplicate!
  { month: "February", sales: 150 }
]
```
**Decision**: ⚠️ Allow but warn
**Display**: Chart shows, but might look confusing

**Why**: Sometimes duplicates are valid (e.g., same month from different years). We allow it but log a warning for monitoring.

---

## Validation Flow

```
User asks question
       ↓
AI generates query + chart config
       ↓
Execute query → Get data
       ↓
┌─────────────────────────────┐
│  CHART VALIDATION LAYER     │
│  (validateChartData)        │
│                             │
│  ✓ Check data exists        │
│  ✓ Check single value       │
│  ✓ Check pie chart limit    │
│  ✓ Validate column names    │
│  ✓ Validate numeric data    │
│  ✓ Check data point limit   │
│  ✓ Check for duplicates     │
└─────────────────────────────┘
       ↓
   Is Valid?
    /     \
  YES      NO
   ↓        ↓
Show      Show only
Chart +   Table +
Table     Explanation
```

---

## Code Location

**File**: `/app/api/query/route.ts`

### Validation Function (lines 12-112):
```typescript
function validateChartData(
  data: any[],
  chartType: string | null,
  chartConfig: any
): ChartValidation {
  // 7 validation rules
  // Returns: { isValid, reason, chartType, chartConfig }
}
```

### Integration (lines 158-175):
```typescript
// Validate if chart should actually be shown
let shouldShowChart = queryInfo.needs_chart;

if (queryInfo.needs_chart && data.length > 0) {
  const validation = validateChartData(data, queryInfo.chart_type, queryInfo.chart_config);
  shouldShowChart = validation.isValid;
  validatedChartType = validation.chartType;
  validatedChartConfig = validation.chartConfig;

  if (!validation.isValid) {
    console.log('Chart validation failed:', validation.reason);
  }
}
```

---

## Test Cases

### Test 1: Single Value ✅
**Input**: "Neçə aktiv müştərimiz var?"
**Data**: `[{ count: 5 }]`
**AI Says**: `needs_chart: true`
**Validation**: ❌ Failed - "Single value result"
**Result**: `needs_chart: false`
**Display**: Only table showing "5"

### Test 2: Good Bar Chart ✅
**Input**: "Kredit növlərinə görə balans"
**Data**: `[{type: "mortgage", total: 340000}, {type: "auto", total: 20000}, ...]`
**AI Says**: `needs_chart: true, chart_type: bar`
**Validation**: ✅ Passed
**Result**: `needs_chart: true, chart_type: bar`
**Display**: Table + Bar chart

### Test 3: Too Many Pie Slices ✅
**Input**: "All customer segments" (50 segments)
**Data**: 50 rows
**AI Says**: `needs_chart: true, chart_type: pie`
**Validation**: ⚠️ Modified - "Too many categories, switching to bar"
**Result**: `needs_chart: true, chart_type: bar`
**Display**: Table + Bar chart (not pie)

### Test 4: Wrong Column Names ✅
**Input**: "Customer balances"
**Data**: `[{full_name: "John", balance: 1000}]`
**AI Config**: `{x_column: "name", y_column: "amount"}`
**Validation**: ⚠️ Auto-fixed - Using "full_name" and "balance"
**Result**: Chart with corrected columns
**Display**: Table + Chart with proper data

### Test 5: Non-Numeric Y-Axis ✅
**Input**: "Customer statuses"
**Data**: `[{name: "John", status: "active"}]`
**AI Says**: `needs_chart: true, y_column: "status"`
**Validation**: ❌ Failed - "Y column has no numeric data"
**Result**: `needs_chart: false`
**Display**: Only table

### Test 6: Too Many Data Points ✅
**Input**: "All transactions" (1000 rows)
**Data**: 1000 rows
**AI Says**: `needs_chart: true, chart_type: bar`
**Validation**: ❌ Failed - "Too many data points (>50)"
**Result**: `needs_chart: false`
**Display**: Only table

---

## Benefits

### 1. Better User Experience
- ✅ Users never see broken or ugly charts
- ✅ Data is always displayed in the most appropriate format
- ✅ No confusion from poorly rendered visualizations

### 2. Intelligent Fallbacks
- ✅ Auto-switch chart types (pie → bar)
- ✅ Auto-detect correct columns
- ✅ Gracefully disable charts when inappropriate

### 3. Performance
- ✅ Validation is fast (regex + simple checks)
- ✅ No additional API calls
- ✅ Happens server-side before sending response

### 4. Maintainability
- ✅ Centralized validation logic
- ✅ Easy to add new rules
- ✅ Clear logging for debugging

---

## Server Logs

When validation fails or modifies charts, you'll see:

```bash
# Single value detected
Chart validation failed: Single value result

# Too many pie slices
Pie chart has too many categories (25), switching to bar chart

# Wrong column name
X column "customer_name" not found, using "full_name"

# No numeric data
Chart validation failed: Y column "status" has no numeric data

# Too many points
Too many data points (100) for bar chart, disabling chart

# Duplicate x values
Duplicate x-axis values detected, chart might be confusing
```

---

## Future Enhancements

Possible additional rules:

1. **Zero/Negative Values**: Warn for pie charts with negative values
2. **Outliers**: Detect extreme outliers that distort scale
3. **Color Accessibility**: Validate color choices for colorblind users
4. **Aspect Ratio**: Suggest chart height based on data points
5. **Time Series Detection**: Auto-detect dates and suggest line charts
6. **Currency Formatting**: Auto-format monetary values
7. **Percentage Detection**: Use 0-100 scale for percentages

---

## Configuration

### Limits (Can be adjusted):

```typescript
// Maximum pie chart categories
const MAX_PIE_CATEGORIES = 10;

// Maximum data points for bar/line charts
const MAX_CHART_POINTS = 50;

// Minimum data rows for chart
const MIN_CHART_ROWS = 2;
```

To change these, edit the validation function in `/app/api/query/route.ts`.

---

## Summary

✅ **Chart validation is now active and working**

The system:
1. ✅ Validates all charts before display
2. ✅ Disables inappropriate charts
3. ✅ Auto-fixes common issues
4. ✅ Provides clear logging
5. ✅ Improves user experience significantly

**Result**: Users only see well-designed, readable charts. No more horrible chart displays!
