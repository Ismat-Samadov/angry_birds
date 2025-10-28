import { NextRequest, NextResponse } from 'next/server';
import { generateQuery } from '@/lib/gemini';
import { query } from '@/lib/db';

interface ChartValidation {
  isValid: boolean;
  reason?: string;
  chartType: 'bar' | 'line' | 'pie' | null;
  chartConfig?: any;
}

function validateChartData(
  data: any[],
  chartType: string | null,
  chartConfig: any
): ChartValidation {
  // Rule 1: Must have data
  if (!data || data.length === 0) {
    return { isValid: false, reason: 'No data', chartType: null };
  }

  // Rule 2: Single row with single value - no chart needed
  if (data.length === 1 && Object.keys(data[0]).length <= 2) {
    const values = Object.values(data[0]);
    const numericValues = values.filter(v => typeof v === 'number' || !isNaN(parseFloat(String(v))));
    if (numericValues.length === 1) {
      return { isValid: false, reason: 'Single value result', chartType: null };
    }
  }

  // Rule 3: Pie chart - limit to 10 categories max
  if (chartType === 'pie' && data.length > 10) {
    console.log(`Pie chart has too many categories (${data.length}), switching to bar chart`);
    return {
      isValid: true,
      chartType: 'bar',
      chartConfig: chartConfig,
    };
  }

  // Rule 4: Check if x and y columns exist in data
  if (chartConfig) {
    const firstRow = data[0];
    const columns = Object.keys(firstRow);

    if (chartConfig.x_column && !columns.includes(chartConfig.x_column)) {
      // Try to find a suitable x column
      const textColumn = columns.find(col => {
        const val = firstRow[col];
        return typeof val === 'string' || isNaN(parseFloat(String(val)));
      });

      if (textColumn) {
        console.log(`X column "${chartConfig.x_column}" not found, using "${textColumn}"`);
        chartConfig = { ...chartConfig, x_column: textColumn };
      } else {
        return { isValid: false, reason: `X column "${chartConfig.x_column}" not found`, chartType: null };
      }
    }

    if (chartConfig.y_column && !columns.includes(chartConfig.y_column)) {
      // Try to find a suitable numeric y column
      const numericColumn = columns.find(col => {
        const val = firstRow[col];
        return typeof val === 'number' || !isNaN(parseFloat(String(val)));
      });

      if (numericColumn) {
        console.log(`Y column "${chartConfig.y_column}" not found, using "${numericColumn}"`);
        chartConfig = { ...chartConfig, y_column: numericColumn };
      } else {
        return { isValid: false, reason: `Y column "${chartConfig.y_column}" not found`, chartType: null };
      }
    }
  }

  // Rule 5: Validate numeric data for y-axis
  if (chartConfig && chartConfig.y_column) {
    const yColumn = chartConfig.y_column;
    const hasValidNumbers = data.some(row => {
      const val = row[yColumn];
      return typeof val === 'number' || !isNaN(parseFloat(String(val)));
    });

    if (!hasValidNumbers) {
      return { isValid: false, reason: `Y column "${yColumn}" has no numeric data`, chartType: null };
    }
  }

  // Rule 6: Too many data points for line/bar (>50)
  if ((chartType === 'line' || chartType === 'bar') && data.length > 50) {
    console.log(`Too many data points (${data.length}) for ${chartType} chart, disabling chart`);
    return { isValid: false, reason: 'Too many data points (>50)', chartType: null };
  }

  // Rule 7: Duplicate x-axis values - might look confusing
  if (chartConfig && chartConfig.x_column) {
    const xValues = data.map(row => row[chartConfig.x_column]);
    const uniqueXValues = new Set(xValues);
    if (xValues.length !== uniqueXValues.size) {
      console.log('Duplicate x-axis values detected, chart might be confusing');
      // Don't fail, but log warning
    }
  }

  // All validations passed
  return {
    isValid: true,
    chartType: chartType as 'bar' | 'line' | 'pie',
    chartConfig: chartConfig,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Sual tələb olunur' },
        { status: 400 }
      );
    }

    // Validate question is meaningful (not random gibberish)
    const trimmedQuestion = question.trim();
    const hasLetters = /[a-zA-Zəüöğışçİ]/i.test(trimmedQuestion);
    const hasMinLength = trimmedQuestion.length >= 3;
    const isNotOnlySpecialChars = /[a-zA-Z0-9əüöğışçİ]/.test(trimmedQuestion);

    if (!hasLetters || !hasMinLength || !isNotOnlySpecialChars) {
      return NextResponse.json(
        { error: 'Daxil etdiyiniz sorğu anlaşıqlı deyil.' },
        { status: 400 }
      );
    }

    // Generate SQL query using AI
    const queryInfo = await generateQuery(question);

    // Handle different response types
    if (queryInfo.response_type === 'error') {
      return NextResponse.json(
        { error: queryInfo.message || 'Daxil etdiyiniz sorğu anlaşıqlı deyil.' },
        { status: 400 }
      );
    }

    // Handle conversational and text-only responses (no database query needed)
    if (queryInfo.response_type === 'conversational' || queryInfo.response_type === 'text_only') {
      return NextResponse.json({
        success: true,
        response_type: queryInfo.response_type,
        data: [],
        queryInfo: {
          query: null,
          explanation: queryInfo.message,
          needs_chart: false,
          chart_type: null,
          chart_config: null,
        },
      });
    }

    // For query_with_data and query_with_chart, we need to execute SQL
    if (!queryInfo.query) {
      return NextResponse.json(
        { error: 'AI sorğu yarada bilmədi.' },
        { status: 500 }
      );
    }

    // Execute the query
    let result;
    let data = [];

    // Check if query contains SET search_path (multi-statement)
    if (queryInfo.query.includes('SET search_path')) {
      // Split the query and execute the SELECT part only
      const statements = queryInfo.query.split(';').map(s => s.trim()).filter(s => s.length > 0);
      const selectStatement = statements.find(s => s.toUpperCase().startsWith('SELECT'));

      if (selectStatement) {
        // Prepend schema name to tables if needed
        const modifiedQuery = selectStatement.replace(
          /FROM\s+([\w.]+)/gi,
          (match, table) => {
            // Don't modify if already schema-qualified
            if (table.includes('.')) return match;
            return `FROM demo_bank.${table}`;
          }
        ).replace(
          /JOIN\s+([\w.]+)/gi,
          (match, table) => {
            if (table.includes('.')) return match;
            return `JOIN demo_bank.${table}`;
          }
        );

        console.log('Modified query:', modifiedQuery);
        result = await query(modifiedQuery);
        data = result.rows || [];
      } else {
        result = await query(queryInfo.query);
        data = result.rows || [];
      }
    } else {
      result = await query(queryInfo.query);
      data = result.rows || [];
    }

    // Validate if chart should actually be shown
    let shouldShowChart = queryInfo.needs_chart;
    let validatedChartType = queryInfo.chart_type;
    let validatedChartConfig = queryInfo.chart_config;

    if (queryInfo.needs_chart && data.length > 0) {
      const validation = validateChartData(data, queryInfo.chart_type, queryInfo.chart_config);
      shouldShowChart = validation.isValid;
      validatedChartType = validation.chartType;
      validatedChartConfig = validation.chartConfig;

      if (!validation.isValid) {
        console.log('Chart validation failed:', validation.reason);
      }
    } else if (queryInfo.needs_chart && data.length === 0) {
      shouldShowChart = false;
      console.log('Chart disabled: No data returned');
    }

    return NextResponse.json({
      success: true,
      response_type: queryInfo.response_type,
      data: data,
      queryInfo: {
        query: queryInfo.query,
        message: queryInfo.message,
        explanation: queryInfo.explanation,
        needs_chart: shouldShowChart,
        chart_type: shouldShowChart ? validatedChartType : null,
        chart_config: shouldShowChart ? validatedChartConfig : null,
      },
    });
  } catch (error: any) {
    console.error('Query error:', error);
    return NextResponse.json(
      { error: error.message || 'Sorğu zamanı xəta baş verdi' },
      { status: 500 }
    );
  }
}
